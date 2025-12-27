import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/authContext";
import { 
  useGetUserById, 
  useGetFollowersCount, 
  useGetFollowingCount,
  useGetFollowersWithDetails,
  useGetFollowingWithDetails 
} from "@/lib/react-query/queriesAndMutations";
import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import FollowButton from "@/components/shared/FollowButton";

interface StatBlockProps {
  value: string | number;
  label: string;
  onClick?: () => void;
}

const StatBlock = ({ value, label, onClick }: StatBlockProps) => (
  <div 
    className="flex-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
    onClick={onClick}
  >
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

// Modal component for showing followers/following list
const FollowModal = ({ 
  type, 
  userId, 
  isOpen, 
  onClose 
}: { 
  type: 'followers' | 'following';
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { data: followersData, isLoading: isLoadingFollowers } = useGetFollowersWithDetails(userId);
  const { data: followingData, isLoading: isLoadingFollowing } = useGetFollowingWithDetails(userId);
  
  const data = type === 'followers' ? followersData : followingData;
  const isLoading = type === 'followers' ? isLoadingFollowers : isLoadingFollowing;

  if (!isOpen) return null;
  {console.log(data)}
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-2 rounded-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-dark-4">
          <h3 className="h3-bold capitalize">
            {type === 'followers' ? 'Followers' : 'Following'} ({data?.total || 0})
            
          </h3>
          <button 
            onClick={onClose}
            className="text-light-3 hover:text-light-1 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex-center h-40">
              <Loader />
            </div>
          ) : data?.documents.length === 0 ? (
            <div className="text-center py-8 text-light-3">
              No {type} yet
            </div>
          ) : (
            <div className="space-y-3">
              {data?.documents.map((follow) => {
                const user = type === 'followers' 
                  ? follow.userDetails 
                  : follow.userDetails;
                
                if (!user) return null;
                
                return (
                  <Link 
                    key={follow.$id}
                    to={`/profile/${user.$id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-lg bg-dark-3 hover:bg-dark-4 transition-colors"
                  >
                    <img
                      src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-light-1 truncate">
                        {user.username || user.name}
                      </p>
                      <p className="text-xs text-light-3 truncate">
                        {user.name && user.name !== user.username ? user.name : `@${user.username || user.name?.toLowerCase()}`}
                      </p>
                    </div>
                    <FollowButton 
                      userId={user.$id} 
                      className="text-xs px-3 py-1"
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useUserContext();
  const { pathname } = useLocation();
  const [modalType, setModalType] = useState<'followers' | 'following' | null>(null);

  const { data: profileUser } = useGetUserById(id || "");
  const { data: followersCount } = useGetFollowersCount(id || "");
  const { data: followingCount } = useGetFollowingCount(id || "");

  if (!profileUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  const openFollowersModal = () => setModalType('followers');
  const openFollowingModal = () => setModalType('following');
  const closeModal = () => setModalType(null);

  // Calculate post count
  const postCount = profileUser.posts?.length || 0;

  return (
    <div className="profile-container">
      {/* Follow Modal */}
      <FollowModal
        type={modalType || 'followers'}
        userId={profileUser.$id}
        isOpen={!!modalType}
        onClose={closeModal}
      />

      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              profileUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full object-cover border-4 border-dark-4"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-4 justify-center xl:justify-start">
                <h1 className="h3-bold md:h1-semibold w-full text-center xl:text-left">
                  {profileUser.name}
                </h1>
                {currentUser.id !== profileUser.$id && (
                  <FollowButton 
                    userId={profileUser.$id} 
                    className="hidden xl:flex"
                  />
                )}
              </div>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{profileUser.username || profileUser.name?.toLowerCase()}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock 
                value={postCount} 
                label="Posts" 
              />
              <StatBlock 
                value={followersCount || 0} 
                label="Followers" 
                onClick={openFollowersModal}
              />
              <StatBlock 
                value={followingCount || 0} 
                label="Following" 
                onClick={openFollowingModal}
              />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {profileUser.bio || ""}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${currentUser.id !== profileUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${profileUser.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  currentUser.id !== profileUser.$id && "hidden"
                }`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${currentUser.id === profileUser.$id && "hidden"} xl:hidden`}>
              <FollowButton 
                userId={profileUser.$id} 
                className="px-8"
              />
            </div>
          </div>
        </div>
      </div>

      {profileUser.$id === currentUser.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
              className="invert-white"
            />
            Posts
          </Link>
          
        </div>
      )}

      <Routes>
        <Route
          index
          element={
            profileUser.posts?.length > 0 ? (
              <GridPostList posts={profileUser.posts} showUser={false} />
            ) : (
              <div className="text-center py-12">
                <p className="text-light-3">No posts yet</p>
                {profileUser.$id === currentUser.id && (
                  <Link to="/create-post" className="text-primary-500 hover:text-primary-600 mt-2 inline-block">
                    Create your first post
                  </Link>
                )}
              </div>
            )
          }
        />
        
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;