// components/shared/FollowUserCard.tsx
import { Link } from "react-router-dom";
import { Models } from "appwrite";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/authContext";
import { useIsFollowing, useFollowUser, useUnfollowUser } from "@/lib/react-query/queriesAndMutations";

type FollowUserCardProps = {
  user: Models.Document;
  showFollowButton?: boolean;
  showSuggestionText?: boolean;
  size?: "sm" | "md" | "lg";
};

const FollowUserCard = ({ 
  user, 
  showFollowButton = true,
  showSuggestionText = false,
  size = "md"
}: FollowUserCardProps) => {
  const { user: currentUser } = useUserContext();
  
  // Fetch follow status
  const { data: followData, isLoading: isCheckingFollow } = useIsFollowing(
    currentUser.id,
    user.$id
  );
  
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

  // Size configuration
  const sizeConfig = {
    sm: {
      image: "h-8 w-8",
      name: "text-xs",
      username: "text-[10px]",
      button: "text-xs px-3 h-7",
      loader: "w-3 h-3"
    },
    md: {
      image: "h-10 w-10",
      name: "text-sm",
      username: "text-xs",
      button: "text-sm px-4 h-8",
      loader: "w-4 h-4"
    },
    lg: {
      image: "h-12 w-12",
      name: "text-base",
      username: "text-sm",
      button: "text-base px-5 h-9",
      loader: "w-5 h-5"
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left side: Image and user info */}
      <Link to={`/profile/${user.$id}`} className="flex items-center gap-3 flex-1 min-w-0">
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt={user.name}
          className={`${sizeConfig[size].image} rounded-full object-cover border border-dark-4`}
        />
        
        <div className="flex flex-col flex-1 min-w-0">
          <p className={`${sizeConfig[size].name} font-semibold text-light-1 truncate`}>
            {user.username || user.name}
          </p>
          <p className={`${sizeConfig[size].username} text-light-3 truncate`}>
            {user.username && user.name !== user.username ? user.name : `@${user.username || user.name?.toLowerCase()}`}
          </p>
          
          {showSuggestionText && (
            <p className="text-[10px] text-light-3 mt-0.5">
              Suggested for you
            </p>
          )}
        </div>
      </Link>
      
      {/* Right side: Follow button */}
      {shouldShowButton && (
        <Button 
          size="sm" 
          className={`${sizeConfig[size].button} ${
            isFollowingUser 
              ? "bg-dark-4 hover:bg-dark-3 text-light-1" 
              : "shad-button_primary"
          }`}
          onClick={isFollowingUser ? handleUnfollow : handleFollow}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              {isFollowingUser ? "..." : "..."}
            </span>
          ) : isFollowingUser ? (
            "Following"
          ) : (
            "Follow"
          )}
        </Button>
      )}
    </div>
  );
};

export default FollowUserCard;