import { useEffect, useState } from "react";
import { useUserContext } from "@/context/authContext";
import {
  useFollowUser,
  useUnfollowUser,
  useIsFollowing,
} from "@/lib/react-query/queriesAndMutations";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";

interface FollowButtonProps {
  userId: string;
  className?: string;
}

const FollowButton = ({ userId, className = "" }: FollowButtonProps) => {
  const { user: currentUser } = useUserContext();
  const [isFollowingState, setIsFollowingState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use your existing isFollowing hook
  const { 
    data: followStatus, 
    isLoading: isLoadingCheck,
    refetch 
  } = useIsFollowing(
    currentUser.id,
    userId
  );

  const { mutateAsync: followUser, isPending: isFollowingPending } = useFollowUser();
  const { mutateAsync: unfollowUser, isPending: isUnfollowingPending } = useUnfollowUser();

  useEffect(() => {
    if (followStatus) {
      setIsFollowingState(followStatus.isFollowing);
    }
  }, [followStatus]);

  const handleFollowToggle = async () => {
    if (!currentUser.id) return;

    setIsLoading(true);
    try {
      if (isFollowingState) {
        // Unfollow logic
        await unfollowUser({
          followerId: currentUser.id,
          followingId: userId,
        });
        setIsFollowingState(false);
      } else {
        // Follow logic
        await followUser({
          followerId: currentUser.id,
          followingId: userId,
        });
        setIsFollowingState(true);
      }
      // Refetch to get updated status
      refetch();
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show button if it's the current user's own profile or not logged in
  if (currentUser.id === userId || !currentUser.id) return null;

  // Show loader while checking follow status
  if (isLoadingCheck) {
    return (
      <Button
        disabled
        className={`bg-dark-4 text-light-2 hover:bg-dark-4 ${className}`}
      >
        <Loader />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleFollowToggle}
      disabled={isLoading || isFollowingPending || isUnfollowingPending}
      className={`${
        isFollowingState
          ? "bg-dark-4 text-light-2 hover:bg-dark-3 rounded-xl"
          : "bg-primary-500 hover:bg-primary-600 text-black rounded-xl"
      } ${className}`}
    >
      {isLoading || isFollowingPending || isUnfollowingPending ? (
        <Loader />
      ) : isFollowingState ? (
        "Following"
      ) : (
        "Follow"
      )}
    </Button>
  );
};

export default FollowButton;