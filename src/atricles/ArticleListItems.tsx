/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useArticlesDispatch,
  useArticlesState,
} from "../context/articles/context";
import { Article } from "../context/articles/reducer";
// import { Link } from "react-router-dom";
import "../index.css";
import React, { useEffect } from "react";
// import { fetchArticle } from "../context/articles/actions";
import { API_ENDPOINT } from "../../src/config/constants";
import { Link } from "react-router-dom";

const fetchSports = async (setSportsList: (data: any) => void) => {
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
  } catch (error) {
    console.log("Error fetching sports:", error);
  }
};

export default function ArticleListItems() {
  let state: any = useArticlesState();
  const [sportsList, setSportsList] = React.useState<any>(null);
  const [currentSport, setSport] = React.useState<any>(null);
  // const ArticleDispatch = useArticlesDispatch();

  useEffect(() => {
    fetchSports(setSportsList);
  }, []);
  const { articles, isLoading, isError, errorMessage } = state;

  if (articles.length === 0 && isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>{errorMessage}</span>;
  }

  const articleList = () => {
    const arti = articles.filter(
      (article: any) =>
        currentSport === article.sport.name || currentSport === null
    );

    return arti;
  };

  return (
    <div className="w-3/4 p-4 shadow rounded-lg">
      <div className="mb-2">
        <h2 className="text-gray-700  dark:text-white text-2xl font-medium tracking-tight mb-2 mr-4">
          Trending News
        </h2>
        <button
          className={`${
            currentSport === null ? "bg-blue-600" : "bg-blue-400"
          } hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full mr-2`}
          onClick={() => setSport(null)}
        >
          {"Trending"}
        </button>
        {sportsList?.map((sport: any) => {
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

              // Get the day of the week (0-6)
              const dayOfWeek = date.getDay();

              // Get the day of the month (1-31)
              const dayOfMonth = date.getDate();

              // Get the month (0-11)
              const month = date.getMonth();

              // Get the year (4-digit year)
              const year = date.getFullYear();

              // Format the date as "day, date"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const formattedDate = `${
                daysOfWeek[dayOfWeek]
              }, ${dayOfMonth} ${getMonthName(month)} ${year}`;

              // Function to get the name of the month
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
                          <div className="flex items-center font-bold text-2xl mb-2 text-gray-700 dark:text-white justify-between">
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
                            {article.summary}
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