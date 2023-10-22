import { useEffect } from "react";
import { useArticlesDispatch } from "../context/articles/context";
import { fetchArticles } from "../context/articles/actions";
import { Outlet } from "react-router-dom";

const ArticleContainer = () => {
  const ArticleDispatch = useArticlesDispatch();
  useEffect(() => {
    fetchArticles(ArticleDispatch);
  }, [ArticleDispatch]);
  return <Outlet />;
};

export default ArticleContainer;
