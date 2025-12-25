import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchedResultsProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.Document[]; 
};

const SearchResults = ({
  isSearchFetching,
  searchedPosts,
}: SearchedResultsProps) => {
  if (isSearchFetching) return <Loader />;

  if (searchedPosts && searchedPosts.length > 0)
    return <GridPostList posts={searchedPosts} />; 

  return <div>No results found</div>;
};

export default SearchResults;
