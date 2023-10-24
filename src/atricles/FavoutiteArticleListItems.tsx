/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useArticlesState } from "../context/articles/context";
import { Article } from "../context/articles/reducer";
// import { Link } from "react-router-dom";
import "../index.css";
import React, { useEffect } from "react";
// import { fetchArticle } from "../context/articles/actions";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINT } from "../../src/config/constants";
import { Link } from "react-router-dom";

const checkLogin = () => {
  return localStorage.getItem("authTokenSportsCenter") !== null;
};

const fetchTeams = async (
  setData: (data: any) => void,
  setSportsList: (data: any) => void
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
    console.log("Error fetching teams:", error);
  }
};

export default function FavouriteArticleListItems() {
  let state: any = useArticlesState();
  const [sportsList, setSportsList] = React.useState<any>(null);
  const [data, setData] = React.useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sport, setSport] = React.useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [team, setTeam] = React.useState<any>(null);
  const { articles, isLoading, isError, errorMessage, preferences } = state;

  useEffect(() => {
    fetchTeams(setData, setSportsList);
  }, []);

  if (articles.length === 0 && isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>{errorMessage}</span>;
  }

  const articleList = () => {
    const arti = articles.filter(
      (article: any) =>
        (article.teams.filter((item: any) => item.name === team).length > 0 ||
          team === null) &&
        (article.sport.name === sport || sport === null) &&
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
    );
    return arti;
  };

  return (
    <div className="w-1/4 p-4 shadow rounded-lg ml-3">
      <div className="flex flex-col r">
        <h2 className="text-gray-700  dark:text-white text-2xl font-medium tracking-tight mb-2 mr-4">
          Favourites
        </h2>
        <label
          htmlFor="sport"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Filter
        </label>
        <select
          id="sport"
          className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          defaultValue={"Choose a Sport"}
          onChange={(e) => {
            if (e.target.value === "Sport0") {
              setSport(null);
              setTeam(null);
            } else {
              setSport(e.target.value);
              setTeam(null);
            }
          }}
        >
          <option value={"Sport0"}>Choose a Sport</option>
          {sportsList
            ?.filter(
              (sport: any) =>
                (checkLogin() &&
                  (preferences.sports === undefined ||
                    preferences.sports.length === 0 ||
                    preferences.sports?.includes(sport.name) ||
                    preferences.sports?.length === 0)) ||
                checkLogin() === false
            )
            .map((item: any) => {
              return (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              );
            })}
        </select>
        <select
          id="team"
          className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          defaultValue={"Choose a Team"}
          onChange={(e) => {
            if (e.target.value === "Team0") {
              setTeam(null);
            } else {
              setTeam(e.target.value);
            }
          }}
        >
          <option value={"Team0"}>Choose a Team</option>
          {sport != null
            ? data
                ?.filter(
                  (item: any) =>
                    item.plays === sport &&
                    ((checkLogin() &&
                      (preferences.sports === undefined ||
                        preferences.sports.length === 0 ||
                        preferences.teams?.includes(item.name) ||
                        data.filter(
                          (item: any) =>
                            item.plays === sport &&
                            preferences.teams?.includes(item.name)
                        ).length === 0 ||
                        preferences.teams?.length === 0)) ||
                      checkLogin() === false)
                )
                ?.map((item: any) => {
                  return (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  );
                })
            : null}
        </select>
      </div>
      <div className="overflow-y-auto max-h-[510px] ">
        {articleList().length > 0 ? (
          articleList().map((article: Article) => {
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
                <div className="flex flex-col rounded overflow-hidden shadow-lg">
                  <img
                    className="h-48 object-cover"
                    src={article.thumbnail}
                    alt={article.sport.name}
                  />
                  <div className="flex flex-1">
                    <div className="flex flex-col flex-1 px-6 py-4 ">
                      <div className="flex flex-col">
                        <div className="flex items-center uppercase font-semibold text-md mb-2 text-orange-500 dark:text-white justify-between">
                          {article.sport.name}
                          <span>
                            <p className=" text-sm text-gray-500 dark:text-gray-300">
                              {formattedDate}
                            </p>
                          </span>
                        </div>
                        <div className="font-bold text-lg mb-2 text-gray-600 dark:text-white">
                          {article.title}
                        </div>
                        <p className="text-gray-700 text-base dark:text-white">
                          {article.summary}
                        </p>
                      </div>
                      <div className="flex  justify-end mt-2">
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
        ) : (
          <div>No Articles Found...</div>
        )}
      </div>
    </div>
  );
}
