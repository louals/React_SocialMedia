import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/components/ui/use-toast";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/authContext";

const AllUsers = () => {
  const { toast } = useToast();
  const { user: currentUser } = useUserContext();
  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    return null;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <div className="flex items-center justify-between w-full mb-8">
          <div>
            <h2 className="h3-bold md:h2-bold text-left">All Users</h2>
            <p className="text-light-3 mt-2">
              Connect with other creators and explore their content
            </p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex-center h-64">
            <Loader />
          </div>
        ) : creators?.documents.length === 0 ? (
          <div className="text-center py-16 bg-dark-2 rounded-xl">
            <img 
              src="/assets/icons/people.svg" 
              alt="No users" 
              className="w-16 h-16 mx-auto mb-4 opacity-50"
            />
            <p className="text-light-3 text-lg">No users found</p>
            <p className="text-light-4 mt-2">Be the first to join!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {creators?.documents.map((creator: any) => {
              // Don't show current user in the list
              if (creator.$id === currentUser.id) return null;
              
              return (
                <UserCard 
                  key={creator.$id} 
                  user={creator}
                  showFollowButton={true}
                  size="md"
                  variant="default"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;