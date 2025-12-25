import { ID, Query} from "appwrite";

import { INewUser, INewPost, IUpdatePost, IUpdateUser } from "@/Types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";


export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function SignInAccount(user: { email: string; password: string }) {
  try {
    const existingSession = await account.getSession("current");
    if (existingSession) {
      await account.deleteSession("current");
      console.log("🧹 Old session deleted");
    }
  } catch (err) {
    // No active session, move on
  }
  const session = await account.createEmailPasswordSession(
    user.email,
    user.password
  );
  return session;
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);

    if (!fileUrl) throw new Error("No file URL returned");

    return fileUrl;
  } catch (error) {
    console.log("Error getting file view:", error);
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    console.log(posts);

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    return post;
  } catch (error) {}
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;
      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}


export async function deletePost(postId:string, imageId:string) {
  if (!postId || !imageId) throw Error 
  
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    return {status: "ok"}
  } catch (error) {
    console.log(error)
  }
}


export async function getInfinitePosts({ pageParam }: { pageParam?: string }) {
  const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)];
  
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam)); // already a string
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) {
      throw new Error("No posts found");
    }

    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function SearchPosts(searchTerm : string) {
  
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search('caption', searchTerm)]
    )

    if (!posts) {
      throw Error;
    }

    return posts
  } catch (error) {
    
  }
}


export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}


export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}


// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================== FOLLOW USER
export async function followUser(followerId: string, followingId: string) {
  try {
    // Check if already following
    const existingFollow = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("follower", followerId),
        Query.equal("following", followingId)
      ]
    );

    // If already following, don't create duplicate
    if (existingFollow.documents.length > 0) {
      return existingFollow.documents[0];
    }

    // Create follow document
    const follow = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      ID.unique(),
      {
        follower: followerId,
        following: followingId,
        isMutual: false // Default to false, we'll update if mutual
      }
    );

    // Check if it's mutual follow (the other person also follows back)
    const mutualCheck = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("follower", followingId),
        Query.equal("following", followerId)
      ]
    );

    // If mutual follow exists, update both records
    if (mutualCheck.documents.length > 0) {
      // Update current follow to mutual
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.followsCollectionId,
        follow.$id,
        { isMutual: true }
      );
      
      // Update the other follow to mutual
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.followsCollectionId,
        mutualCheck.documents[0].$id,
        { isMutual: true }
      );
    }

    return follow;
  } catch (error) {
    console.log("Follow error:", error);
    throw error;
  }
}

// ============================== UNFOLLOW USER
export async function unfollowUser(followerId: string, followingId: string) {
  try {
    // Find the follow document
    const follows = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("follower", followerId),
        Query.equal("following", followingId)
      ]
    );

    if (follows.documents.length === 0) {
      return { status: "not_following" };
    }

    const followId = follows.documents[0].$id;
    
    // Check if it was a mutual follow
    const wasMutual = follows.documents[0].isMutual;

    // Delete the follow document
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      followId
    );

    // If it was mutual, update the other follow record
    if (wasMutual) {
      const otherFollow = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.followsCollectionId,
        [
          Query.equal("follower", followingId),
          Query.equal("following", followerId)
        ]
      );

      if (otherFollow.documents.length > 0) {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.followsCollectionId,
          otherFollow.documents[0].$id,
          { isMutual: false }
        );
      }
    }

    return { status: "ok" };
  } catch (error) {
    console.log("Unfollow error:", error);
    throw error;
  }
}

// ============================== CHECK IF FOLLOWING
export async function isFollowing(followerId: string, followingId: string) {
  try {
    const follows = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("follower", followerId),
        Query.equal("following", followingId)
      ]
    );

    return {
      isFollowing: follows.documents.length > 0,
      followId: follows.documents[0]?.$id || null,
      isMutual: follows.documents[0]?.isMutual || false
    };
  } catch (error) {
    console.log("Error checking follow status:", error);
    return { isFollowing: false, followId: null, isMutual: false };
  }
}

// ============================== GET USER FOLLOWERS
export async function getUserFollowers(userId: string) {
  try {
    const followers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("following", userId), // People who follow this user
        Query.orderDesc("$createdAt")
      ]
    );

    return followers;
  } catch (error) {
    console.log("Error getting followers:", error);
    return { documents: [], total: 0 };
  }
}

// ============================== GET USER FOLLOWING
export async function getUserFollowing(userId: string) {
  try {
    const following = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("follower", userId), // People this user follows
        Query.orderDesc("$createdAt")
      ]
    );

    return following;
  } catch (error) {
    console.log("Error getting following:", error);
    return { documents: [], total: 0 };
  }
}

// ============================== GET FOLLOWERS COUNT
export async function getFollowersCount(userId: string) {
  try {
    const followers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("following", userId),
        Query.limit(1) // Just get count, not documents
      ]
    );

    return followers.total;
  } catch (error) {
    console.log("Error getting followers count:", error);
    return 0;
  }
}

// ============================== GET FOLLOWING COUNT
export async function getFollowingCount(userId: string) {
  try {
    const following = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("follower", userId),
        Query.limit(1) // Just get count, not documents
      ]
    );

    return following.total;
  } catch (error) {
    console.log("Error getting following count:", error);
    return 0;
  }
}

// ============================== GET FOLLOWERS WITH USER DETAILS
export async function getFollowersWithDetails(userId: string) {
  try {
    const followers = await getUserFollowers(userId);
    
    // Get user details for each follower
    const followersWithDetails = await Promise.all(
      followers.documents.map(async (follow) => {
        try {
          const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            follow.follower
          );
          return {
            ...follow,
            userDetails: user
          };
        } catch (error) {
          console.log(`Error fetching user ${follow.follower}:`, error);
          return {
            ...follow,
            userDetails: null
          };
        }
      })
    );

    return {
      ...followers,
      documents: followersWithDetails
    };
  } catch (error) {
    console.log("Error getting followers with details:", error);
    return { documents: [], total: 0 };
  }
}

// ============================== GET FOLLOWING WITH USER DETAILS
export async function getFollowingWithDetails(userId: string) {
  try {
    const following = await getUserFollowing(userId);
    
    // Get user details for each followed user
    const followingWithDetails = await Promise.all(
      following.documents.map(async (follow) => {
        try {
          const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            follow.following
          );
          return {
            ...follow,
            userDetails: user
          };
        } catch (error) {
          console.log(`Error fetching user ${follow.following}:`, error);
          return {
            ...follow,
            userDetails: null
          };
        }
      })
    );

    return {
      ...following,
      documents: followingWithDetails
    };
  } catch (error) {
    console.log("Error getting following with details:", error);
    return { documents: [], total: 0 };
  }
}


