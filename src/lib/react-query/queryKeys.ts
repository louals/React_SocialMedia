export enum QUERY_KEYS {
  // AUTH KEYS
  CREATE_USER_ACCOUNT = "createUserAccount",

  // USER KEYS
  GET_CURRENT_USER = "getCurrentUser",
  GET_USERS = "getUsers",
  GET_USER_BY_ID = "getUserById",

  // POST KEYS
  GET_POSTS = "getPosts",
  GET_INFINITE_POSTS = "getInfinitePosts",
  GET_RECENT_POSTS = "getRecentPosts",
  GET_POST_BY_ID = "getPostById",
  GET_USER_POSTS = "getUserPosts",
  GET_FILE_PREVIEW = "getFilePreview",

  //  SEARCH KEYS
  SEARCH_POSTS = "getSearchPosts",

  // FOLLOW KEYS - Add these
  GET_FOLLOWERS = "getFollowers",
  GET_FOLLOWING = "getFollowing",
  IS_FOLLOWING = "isFollowing",
  GET_FOLLOWERS_COUNT = "getFollowersCount",
  GET_FOLLOWING_COUNT = "getFollowingCount",
  GET_FOLLOWERS_WITH_DETAILS = "getFollowersWithDetails",
  GET_FOLLOWING_WITH_DETAILS = "getFollowingWithDetails",
  GET_SUGGESTED_USERS = "getSuggestedUsers", // For "who to follow" suggestions
}