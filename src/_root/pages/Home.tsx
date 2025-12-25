// Home.tsx
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";

import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { useUserContext } from "@/context/authContext";
import FollowUserCard from "@/components/shared/FollowUserCard";
import { Link } from "react-router-dom";

const Home = () => {
  const { user: currentUser } = useUserContext();
  
  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  const {
    data: creators,
    isLoading: isUsersLoading,
    isError: isErrorCreators,
  } = useGetUsers();

  // Filter to exclude current user and get 4-5 suggested users
  const suggestedUsers = creators?.documents
    ?.filter((creator: any) => creator.$id !== currentUser.id)
    ?.slice(0, 5) || [];

  return (
    <div className="flex flex-1">
      {/* Main Posts Feed */}
      <div className="flex-1 max-w-2xl mx-auto py-10 px-5 md:p-10 w-full">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full mb-6">Home Feed</h2>
          
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-6 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <PostCard post={post} key={post.$id} />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Instagram-style Right Sidebar */}
      <div className="hidden lg:flex flex-col w-80 xl:w-96 px-6 py-8 border-l border-dark-4">
        <div className="sticky top-20 space-y-8">
          
          

          {/* Suggestions For You */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-light-2">Suggestions For You</h3>
              <Link to="/all-users">
              <button className="text-xs text-light-1 hover:text-light-3 font-medium">
                See All
              </button>
              </Link>
            </div>

            {isUsersLoading ? (
              <div className="flex justify-center py-4">
                <Loader/>
              </div>
            ) : (
              <div className="space-y-5">
                {suggestedUsers.map((creator: Models.Document) => (
                  <FollowUserCard 
                    key={creator.$id} 
                    user={creator}
                    showSuggestionText={true}
                    size="md"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Instagram-style Links Footer */}
          <div className="text-xs text-light-3 space-y-4 pt-4 border-t border-dark-4">
            <div className="flex flex-wrap gap-2">
              <a href="#" className="hover:text-light-2">About</a> • 
              <a href="#" className="hover:text-light-2">Help</a> • 
              <a href="#" className="hover:text-light-2">Press</a> • 
              <a href="#" className="hover:text-light-2">API</a> • 
              <a href="#" className="hover:text-light-2">Privacy</a> • 
              <a href="#" className="hover:text-light-2">Terms</a> • 
              <a href="#" className="hover:text-light-2">Locations</a> • 
              <a href="#" className="hover:text-light-2">Language</a>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <a href="#" className="hover:text-light-2">Meta Verified</a>
            </div>
            
            <div className="pt-2 text-[10px]">
              © {new Date().getFullYear()} Snapgram
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;