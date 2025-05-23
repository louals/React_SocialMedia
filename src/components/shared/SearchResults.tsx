import { Models } from "appwrite";
import React from "react";
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
  if (searchedPosts && searchedPosts.documents.length > 0)
    return <GridPostList posts={searchedPosts.documents} />;
    return <div>
      No results found
  </div>;
};

export default SearchResults;
