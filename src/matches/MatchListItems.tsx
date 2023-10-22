/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMatchesDispatch,
  useMatchesState,
} from "../context/matches/context";
// import { Link } from "react-router-dom";
import "../index.css";
import React from "react";
import RefreshIcon from "../assets/images/refresh.svg";
import { fetchMatch } from "../context/matches/actions";

export default function MatchListItems(props: {
  liveScores: boolean;
  setLiveScores: (state: boolean) => void;
}) {
  const [Refresh, setRefresh] = React.useState<null | number>(null);
  let state: any = useMatchesState();
  const matchDispatch = useMatchesDispatch();
  const { matches, isLoading, isError, errorMessage } = state;

  if (matches.length === 0 && isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>{errorMessage}</span>;
  }

  return (
    <>
      <ul className="flex flex-row gap-4 overflow-y-auto">
        {matches
          .filter((match: any) => match.isRunning === props.liveScores)
          .map((match: any) => {
            const startDate = new Date(match.startsAt);
            const endDate = new Date(match.endsAt);

            let hours = endDate.getTime() - startDate.getTime();
            hours = Math.round(hours / 1000 / 60 / 60);

            const entries = Object.keys(match.score);
            const firstTeamName = entries[0];
            const firstTeamScore = match.score[firstTeamName];
            const secondTeamName = entries[1];
            const secondTeamScore = match.score[secondTeamName];
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
            const dayOfWeek = endDate.getDay();

            // Get the day of the month (1-31)
            const dayOfMonth = endDate.getDate();

            // Get the month (0-11)
            const month = endDate.getMonth();

            // Get the year (4-digit year)
            const year = endDate.getFullYear();

            // Format the date as "day, date"
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

            function backgroundImageUrl(sportName: string) {
              switch (sportName) {
                case "Basketball":
                  return "https://www.basketballworkouttips.com/wp-content/uploads/nate-robinson-dunk-2.jpg";
                case "American Football":
                  return "https://besthqwallpapers.com/Uploads/28-7-2020/138493/thumb2-ball-for-american-football-nfl-american-football-american-football-ball-football-field.jpg";
                case "Rugby":
                  return "https://e0.365dm.com/16/09/768x432/rugby-rugby-union-brisbane-israel-folau_3783108.jpg?20160910121451";
                case "Field Hockey":
                  return "https://olympic.ca/wp-content/uploads/2015/06/fieldhockey1.jpg?quality=100";
                case "Table Tennis":
                  return "https://www.theindianwire.com/wp-content/uploads/2018/08/table-tennis.jpeg";
                case "Cricket":
                  return "https://wallpapercave.com/wp/wp1809784.jpg";
              }
            }
            return (
              <div
                key={match.id}
                // to={`${match.id}`}
                className="block p-2  border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div className="text-gray-600 my-3 text-center">
                  <i className="fas fa-ellipsis-v"></i>
                </div>

                <div className="shadow-xl rounded-lg overflow-hidden h-max">
                  <div
                    className="bg-cover bg-center h-16 p-4 flex justify-end items-center"
                    style={{
                      backgroundImage: `url(${backgroundImageUrl(
                        match.sportName
                      )})`,
                    }}
                  ></div>
                  <div className="px-4 pb-3 pt-4 border-b border-gray-300  flex justify-between">
                    <div className="text-xs uppercase font-bold  tracking-wide">
                      Match Duration:{" "}
                      <span className="font-normal">{hours} hrs</span>
                    </div>
                  </div>
                  <div className="p-4  flex justify-between items-start">
                    <div>
                      <p className="text-3xl  leading-none my-1">
                        {match.sportName}
                      </p>
                      <p className="text-xs w-56">{match.location}</p>
                      <p className="text-sm w-56">{formattedDate}</p>
                    </div>
                    <div>
                      <div
                        className={`flex justify-center leading-loose  ${
                          props.liveScores === true
                            ? "bg-green-500"
                            : "bg-red-500"
                        }  text-white p-1 px-2 rounded-lg uppercase text-xs tracking-wider`}
                      >
                        Live Now
                      </div>
                      <button
                        type="button"
                        className={`justify-center inline-flex items-center px-2 py-1.5 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 mt-1 ${
                          Refresh != null && Refresh === match.id
                            ? "cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => {
                          setRefresh(match.id);
                          fetchMatch(matchDispatch, match.id, setRefresh);
                        }}
                      >
                        {Refresh != null && Refresh === match.id ? (
                          <svg
                            className="animate-spin -ml-1 mr-1 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <img src={RefreshIcon} className="h-5 w-5 mr-1" />
                        )}
                        {Refresh != null && Refresh === match.id
                          ? "Loading"
                          : "Refresh"}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 border-t border-gray-300 ">
                    <div className="text-sm pr-1 font-semibold">
                      {firstTeamName}
                    </div>
                    <div className="leading-loose bg-blue-500 text-white p-1 px-2 rounded-lg uppercase text-xs tracking-wider mr-2 ml-2">
                      {firstTeamScore}
                    </div>
                    <div className="leading-loose bg-green-500 text-white p-1 px-2 rounded-lg uppercase text-xs tracking-wider">
                      VS
                    </div>
                    <div className="leading-loose bg-blue-500 text-white p-1 px-2 rounded-lg uppercase text-xs tracking-wider mr-2 ml-2">
                      {secondTeamScore}
                    </div>
                    <span className="text-sm font-semibold">
                      {secondTeamName}
                    </span>
                  </div>
                </div>

                <div className="text-gray-600 my-3 text-center">
                  <i className="fas fa-ellipsis-v"></i>
                </div>
              </div>
            );
          })}
      </ul>
    </>
  );
}
