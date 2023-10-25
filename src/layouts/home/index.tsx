import { Outlet } from "react-router-dom";
import Appbar from "./Appbar";
import { useEffect } from "react";
import { useMatchesDispatch } from "../../context/matches/context";
import { fetchMatches } from "../../context/matches/actions";
import Matches from "../../matches";
import Articles from "../../atricles";
import { fetchArticles } from "../../context/articles/actions";
import { useArticlesDispatch } from "../../context/articles/context";
import { Toaster } from "react-hot-toast";

const HomeLayout = () => {
  const projectDispatch = useMatchesDispatch();
  const ArticleDispatch = useArticlesDispatch();
  useEffect(() => {
    fetchMatches(projectDispatch);
    fetchArticles(ArticleDispatch);
  }, [projectDispatch, ArticleDispatch]);

  return (
    <>
      <Appbar />
      <main>
        <div className="mx-auto max-w-10xl py-6 sm:px-2 ">
          <Matches />
          <Articles />
          <Toaster />
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default HomeLayout;
