import React from "react";
import ArticleListItems from "./ArticleListItems";
import FavouriteArticleListItems from "./FavoutiteArticleListItems";

const ArticleList: React.FC = () => {
  return (
    <>
      <div className="flex">
        <ArticleListItems />
        <FavouriteArticleListItems />
      </div>
    </>
  );
};

export default ArticleList;
