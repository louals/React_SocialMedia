// components/shared/UserCard.tsx
import { Link } from "react-router-dom";
import { Models } from "appwrite";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/authContext";
import { 
  useIsFollowing, 
  useFollowUser, 
  useUnfollowUser,
  useGetFollowersCount,
  useGetFollowingCount
} from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";

type UserCardProps = {
  user: Models.Document;
  showFollowButton?: boolean;
  showStats?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact" | "detailed";
};

const UserCard = ({ 
  user, 
  showFollowButton = true,
  showStats = true,
  size = "md",
  variant = "default"
}: UserCardProps) => {
  const { user: currentUser } = useUserContext();
  
  // Fetch follow status
  const { data: followData, isLoading: isCheckingFollow } = useIsFollowing(
    currentUser.id,
    user.$id
  );
  
  // Fetch follower/following counts
  const { data: followersCount } = useGetFollowersCount(user.$id);
  const { data: followingCount } = useGetFollowingCount(user.$id);
  
  // Follow/Unfollow mutations
  const { mutateAsync: followUser, isPending: isFollowing } = useFollowUser();
  const { mutateAsync: unfollowUser, isPending: isUnfollowing } = useUnfollowUser();

  // Don't show follow button for current user
  const shouldShowButton = showFollowButton && currentUser.id !== user.$id;
  
  const isFollowingUser = followData?.isFollowing || false;
  const isLoading = isCheckingFollow || isFollowing || isUnfollowing;

  const handleFollow = async () => {
    if (!currentUser.id || currentUser.id === user.$id || isLoading) return;
    
    try {
      await followUser({
        followerId: currentUser.id,
        followingId: user.$id,
      });
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    if (!currentUser.id || currentUser.id === user.$id || isLoading) return;
    
    try {
      await unfollowUser({
        followerId: currentUser.id,
        followingId: user.$id,
      });
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  // Variant configurations
  const variantConfig = {
    default: {
      container: "bg-dark-2 rounded-xl p-5 border border-dark-4 hover:border-primary-500/30 transition-all",
      image: "h-16 w-16",
      name: "text-base font-semibold",
      username: "text-sm",
      button: "w-full py-2 text-sm"
    },
    compact: {
      container: "bg-dark-3 rounded-lg p-3 border border-dark-4 hover:border-primary-500/30 transition-all",
      image: "h-12 w-12",
      name: "text-sm font-semibold",
      username: "text-xs",
      button: "py-1.5 px-3 text-xs"
    },
    detailed: {
      container: "bg-dark-2 rounded-xl p-6 border border-dark-4 hover:border-primary-500/30 transition-all",
      image: "h-20 w-20",
      name: "text-lg font-bold",
      username: "text-base",
      button: "w-full py-2.5 text-base"
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      container: "p-3",
      image: "h-12 w-12",
      name: "text-sm",
      stats: "text-xs"
    },
    md: {
      container: "p-4",
      image: "h-14 w-14",
      name: "text-base",
      stats: "text-sm"
    },
    lg: {
      container: "p-5",
      image: "h-16 w-16",
      name: "text-lg",
      stats: "text-base"
    }
  };

  return (
    <div className={`${variantConfig[variant].container} ${sizeConfig[size].container}`}>
      {/* Profile Header */}
      <div className="flex items-start gap-4 mb-4">
        <Link to={`/profile/${user.$id}`} className="flex-shrink-0">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt={user.name}
            className={`${variantConfig[variant].image} rounded-full object-cover border-2 border-dark-4 hover:border-primary-500 transition-colors`}
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <Link to={`/profile/${user.$id}`}>
            <h3 className={`${variantConfig[variant].name} text-light-1 truncate hover:text-primary-500 transition-colors`}>
              {user.name}
            </h3>
            <p className={`${variantConfig[variant].username} text-light-3 truncate`}>
              @{user.username || user.name?.toLowerCase()}
            </p>
          </Link>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        
        
        {shouldShowButton && (
          <Button 
            className={`${variantConfig[variant].button} ${
              isFollowingUser 
                ? "bg-dark-4 hover:bg-dark-3 text-light-1" 
                : "bg-primary-500 hover:bg-primary-600 text-light-1"
            }`}
            onClick={isFollowingUser ? handleUnfollow : handleFollow}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader />
              </div>
            ) : isFollowingUser ? (
              "Following"
            ) : (
              "Follow"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserCard;