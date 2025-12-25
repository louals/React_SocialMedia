// components/shared/FollowUserCard.tsx
import { Link } from "react-router-dom";
import { Models } from "appwrite";
import { Button } from "@/components/ui/button";

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
  
  // Size configuration
  const sizeConfig = {
    sm: {
      image: "h-8 w-8",
      name: "text-xs",
      username: "text-[10px]",
      button: "text-xs px-3 h-7"
    },
    md: {
      image: "h-10 w-10",
      name: "text-sm",
      username: "text-xs",
      button: "text-sm px-4 h-8"
    },
    lg: {
      image: "h-12 w-12",
      name: "text-base",
      username: "text-sm",
      button: "text-base px-5 h-9"
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
            {user.username}
          </p>
          <p className={`${sizeConfig[size].username} text-light-3 truncate`}>
            {user.name}
          </p>
          
          {showSuggestionText && (
            <p className="text-[10px] text-light-3 mt-0.5">
              Suggested for you
            </p>
          )}
        </div>
      </Link>
      
      {/* Right side: Follow button */}
      {showFollowButton && (
        <Button 
          size="sm" 
          className={`shad-button_primary ${sizeConfig[size].button}`}
        >
          Follow
        </Button>
      )}
    </div>
  );
};

export default FollowUserCard;