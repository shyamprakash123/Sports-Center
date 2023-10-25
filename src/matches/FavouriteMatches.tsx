/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import MatchListItems from "./MatchListItems";
import { API_ENDPOINT } from "../config/constants";
import ArticalListItems from "../atricles/ArticleListItems";
import { Link, Outlet } from "react-router-dom";
import { useMatchesDispatch } from "../context/matches/context";
import { useArticlesDispatch } from "../context/articles/context";
import { fetchMatches } from "../context/matches/actions";
import { fetchArticles } from "../context/articles/actions";
import { Toaster } from "react-hot-toast";

export const FavouriteMatches = () => {
  const [favouriteMatches, setFavouriteMatches] = useState<number[]>([]);
  const [favouriteArticles, setfavouriteArticles] = useState<number[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const projectDispatch = useMatchesDispatch();
  const ArticleDispatch = useArticlesDispatch();
  useEffect(() => {
    fetchMatches(projectDispatch);
    fetchArticles(ArticleDispatch);
  }, [projectDispatch, ArticleDispatch]);

  const fetchFavouriteMatches = async () => {
    setLoading(true);
    const token = localStorage.getItem("authTokenSportsCenter") ?? "";

    try {
      const response = await fetch(`${API_ENDPOINT}/user/preferences`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const preferences = await response.json();
      preferences.preferences.matches.length === 0
        ? null
        : setFavouriteMatches(preferences.preferences.matches);
      preferences.preferences.articles.length === 0
        ? null
        : setfavouriteArticles(preferences.preferences.articles);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching preferences:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavouriteMatches();
    const title = document.title;
    document.title = "Favourites";
    return () => {
      document.title = title;
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <main>
      <div className="mx-auto h-full max-w-10xl py-6 sm:px-2 ">
        <Link
          to={"/home"}
          className="p-2 px-4 rounded-lg uppercase text-xs tracking-wider bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mb-4"
        >
          GO Back
        </Link>
        <h2 className="text-2xl font-medium tracking-tight mb-2 mr-4  text-gray-700 dark:text-white">
          Favourite Games
        </h2>
        <MatchListItems favouriteMatches={favouriteMatches} />
        <ArticalListItems favouriteArticles={favouriteArticles} />
        <Outlet />
        <Toaster />
      </div>
    </main>
  );
};
