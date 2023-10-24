/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMatchesDispatch,
  useMatchesState,
} from "../context/matches/context";
// import { Link } from "react-router-dom";
import "../index.css";
import { useState } from "react";
import RefreshIcon from "../assets/images/refresh.svg";
import { fetchMatch } from "../context/matches/actions";
import { Link } from "react-router-dom";

const checkLogin = () => {
  return localStorage.getItem("authTokenSportsCenter") !== null;
};

export default function MatchListItems(props: {
  liveScores: boolean;
  setLiveScores: (state: boolean) => void;
}) {
  const [Refresh, setRefresh] = useState<null | number>(null);
  let state: any = useMatchesState();
  const matchDispatch = useMatchesDispatch();
  const { matches, isLoading, isError, errorMessage, preferences } = state;

  if (matches.length === 0 && isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>{errorMessage}</span>;
  }

  const filterMatches = () => {
    return matches.filter(
      (match: any) =>
        match.isRunning === props.liveScores &&
        ((checkLogin() &&
          (preferences.sports === undefined ||
            preferences.sports.length === 0 ||
            preferences.sports?.includes(match.sportName) ||
            preferences.sports?.length === 0)) ||
          checkLogin() === false)
    );
  };

  return (
    <>
      <ul className="flex flex-row gap-4 overflow-y-auto">
        {filterMatches().length > 0 ? (
          filterMatches()
            .slice(0, 6)
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
                    <div className="px-4 pb-3 pt-4 border-b border-gray-300  flex justify-between items-center">
                      <div className="text-xs uppercase font-bold  tracking-wide  text-gray-700 dark:text-white">
                        Match Duration:{" "}
                        <span className="font-normal">{hours} hrs</span>
                      </div>
                      <Link
                        to={`/home/matches/${match.id}`}
                        className="inline-block border  rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-1 px-3"
                      >
                        View Match
                      </Link>
                    </div>
                    <div className="p-4  flex justify-between items-start">
                      <div>
                        <p className="text-3xl uppercase leading-none my-1  text-sky-700 dark:text-white text-bold">
                          {match.sportName}
                        </p>
                        <p className="flex text-xs w-56 items-center text-gray-700 dark:text-white text-bold">
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              id="location-pin-alt"
                              className="h-6 w-6"
                            >
                              <path
                                fill="#5460AB"
                                d="M12,10.8a2,2,0,1,0-2-2A2,2,0,0,0,12,10.8Zm-.71,6.91a1,1,0,0,0,1.42,0l4.09-4.1a6.79,6.79,0,1,0-9.6,0ZM7.23,8.34A4.81,4.81,0,0,1,9.36,4.79a4.81,4.81,0,0,1,5.28,0,4.82,4.82,0,0,1,.75,7.41L12,15.59,8.61,12.2A4.77,4.77,0,0,1,7.23,8.34ZM19,20H5a1,1,0,0,0,0,2H19a1,1,0,0,0,0-2Z"
                              ></path>
                            </svg>
                          </span>
                          {match.location}
                        </p>
                        <p className="flex text-xs w-56 items-center text-gray-700 dark:text-white text-bold">
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              enableBackground="new 0 0 24 24"
                              viewBox="0 0 24 24"
                              id="schedule"
                              className="h-6 w-6"
                            >
                              <path
                                fill="#5460AB"
                                d="M19,4h-1V3c0-0.6-0.4-1-1-1s-1,0.4-1,1v1H8V3c0-0.6-0.4-1-1-1S6,2.4,6,3v1H5C3.3,4,2,5.3,2,7v1h20V7C22,5.3,20.7,4,19,4z M2,19c0,1.7,1.3,3,3,3h14c1.7,0,3-1.3,3-3v-9H2V19z M17,12c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S16.4,12,17,12z M17,16c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S16.4,16,17,16z M12,12c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S11.4,12,12,12z M12,16c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S11.4,16,12,16z M7,12c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S6.4,12,7,12z M7,16c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S6.4,16,7,16z"
                              ></path>
                            </svg>
                          </span>
                          {formattedDate}
                        </p>
                      </div>
                      <div>
                        <div>
                          <span className="relative">
                            <div
                              className={`flex justify-center leading-loose text-bold  ${
                                props.liveScores === true
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }  text-white p-1 px-2 rounded-lg uppercase text-xs tracking-wider`}
                            >
                              Live Now
                            </div>
                            <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                          </span>
                        </div>
                        <button
                          type="button"
                          className={`justify-center inline-flex items-center px-1.5 py-1 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 mt-1 ${
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
                      <div className="text-sm pr-1 font-semibold text-gray-700 dark:text-white text-bold">
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
                      <span className="text-sm font-semibold text-gray-700 dark:text-white text-bold">
                        {secondTeamName}
                      </span>
                    </div>
                  </div>

                  <div className="text-gray-600 my-3 text-center">
                    <i className="fas fa-ellipsis-v"></i>
                  </div>
                </div>
              );
            })
        ) : (
          <div>No Live Matches Found</div>
        )}
      </ul>
    </>
  );
}
