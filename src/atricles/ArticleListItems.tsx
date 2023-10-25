/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useArticlesState } from "../context/articles/context";
import { Article } from "../context/articles/reducer";
import "../index.css";
import React, { useEffect } from "react";
import { API_ENDPOINT } from "../../src/config/constants";
import { Link } from "react-router-dom";

const checkLogin = () => {
  return localStorage.getItem("authTokenSportsCenter") !== null;
};

const fetchSports = async (
  setSportsList: (data: any) => void,
  setData: (data: any) => void
) => {
  const token = localStorage.getItem("authTokenSportsCenter") ?? "";

  try {
    const responseSports = await fetch(`${API_ENDPOINT}/sports`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const sportsData = await responseSports.json();
    setSportsList(sportsData.sports);
    const responseData = await fetch(`${API_ENDPOINT}/teams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await responseData.json();
    setData(data);
  } catch (error) {
    console.log("Error fetching sports:", error);
  }
};

export default function ArticleListItems(props: {
  favouriteArticles?: number[];
}) {
  let state: any = useArticlesState();
  const [sportsList, setSportsList] = React.useState<any>(null);
  const [currentSport, setSport] = React.useState<any>(null);
  const [data, setData] = React.useState<any>(null);

  useEffect(() => {
    fetchSports(setSportsList, setData);
  }, []);
  const { articles, isLoading, isError, errorMessage, preferences } = state;

  if (articles.length === 0 && isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>{errorMessage}</span>;
  }

  const articleList = () => {
    const arti = articles.filter((article: any) =>
      props.favouriteArticles === undefined
        ? (currentSport === article.sport.name || currentSport === null) &&
          ((checkLogin() &&
            (preferences.sports === undefined ||
              preferences.sports.length === 0 ||
              ((preferences.sports?.includes(article.sport.name) ||
                preferences.sports?.length === 0) &&
                (preferences.sports?.includes(article.sport.name) ||
                  preferences.sports?.length === 0) &&
                (article.teams.filter((item: any) =>
                  preferences.teams?.includes(item.name)
                ).length > 0 ||
                  data?.filter(
                    (item: any) =>
                      item.plays === article.sport.name &&
                      preferences.teams?.includes(item.name)
                  ).length === 0 ||
                  preferences.teams?.length === 0)))) ||
            checkLogin() === false)
        : props?.favouriteArticles?.includes(article.id)
    );
    return arti;
  };

  return (
    <div className="w-3/4 p-4 shadow rounded-lg">
      <div className="mb-2">
        <h2 className="text-gray-700  dark:text-white text-2xl font-medium tracking-tight mb-2 mr-4">
          {props.favouriteArticles === undefined
            ? "Trending News"
            : "Favourite News"}
        </h2>
        <button
          className={`${
            currentSport === null ? "bg-blue-600" : "bg-blue-400"
          } hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full mr-2`}
          onClick={() => setSport(null)}
        >
          {"Your News"}
        </button>
        {sportsList
          ?.filter((sport: any) =>
            props.favouriteArticles === undefined
              ? (checkLogin() &&
                  (preferences.sports === undefined ||
                    preferences.sports.length === 0 ||
                    preferences.sports?.includes(sport.name) ||
                    preferences.sports?.length === 0)) ||
                checkLogin() === false
              : null
          )
          .map((sport: any) => {
            return (
              <button
                key={sport.id}
                className={`${
                  sport != null && sport.name === currentSport
                    ? "bg-blue-600"
                    : "bg-blue-400"
                } hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full mr-2`}
                onClick={() => setSport(sport.name)}
              >
                {sport.name}
              </button>
            );
          })}
      </div>
      <div className="overflow-y-auto max-h-[620px] ">
        {articleList().length > 0
          ? articleList().map((article: Article) => {
              const date = new Date(article.date);
              const daysOfWeek = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];

              const dayOfWeek = date.getDay();

              const dayOfMonth = date.getDate();

              const month = date.getMonth();

              const year = date.getFullYear();

              const formattedDate = `${
                daysOfWeek[dayOfWeek]
              }, ${dayOfMonth} ${getMonthName(month)} ${year}`;

              function getMonthName(month: number) {
                const monthNames = [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ];
                return monthNames[month];
              }
              return (
                <div
                  key={article.id}
                  className="block p-2  border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mb-2"
                >
                  <div className="flex flex-row rounded overflow-hidden shadow-lg">
                    <img
                      className="w-1/4 h-48 object-cover"
                      src={article.thumbnail}
                      alt={article.sport.name}
                    />
                    <div className="flex flex-1">
                      <div className="flex flex-col flex-1 px-6 py-4 ">
                        <div className="flex flex-col">
                          <div className="flex items-center uppercase font-semibold text-xl mb-2 text-orange-500 dark:text-white justify-between">
                            {article.sport.name}
                            <span>
                              <p className=" text-sm text-gray-500 dark:text-gray-300">
                                {formattedDate}
                              </p>
                            </span>
                          </div>
                          <div className="font-bold text-xl mb-2 text-gray-600 dark:text-white">
                            {article.title}
                          </div>
                          <p className="text-gray-700 text-base dark:text-white">
                            {article.summary}...
                          </p>
                        </div>
                        <div className="flex px-6 py-2 justify-end">
                          <Link
                            to={`article/${article.id}`}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          : "No articles found"}
      </div>
    </div>
  );
}
