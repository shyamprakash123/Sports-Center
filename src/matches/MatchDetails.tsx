/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../config/constants";
import closeIcon from "../assets/images/close.svg";
import { useContext } from "react";
import { ThemeContext } from "../context/theme";
import {
  errorNotification,
  successNotification,
} from "../Notification/Notification";

const checkLogin = (setLogin: (isLogedin: boolean) => void) => {
  localStorage.getItem("authTokenSportsCenter") === null
    ? setLogin(false)
    : setLogin(true);
};

const fetchPreferences = async (setPreferences: (data: any) => void) => {
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
    Object.keys(preferences.preferences).length === 0
      ? null
      : setPreferences(preferences.preferences);
  } catch (error) {
    console.log("Error fetching preferences:", error);
  }
};

const updatePreferences = async (preferences: any, save: boolean) => {
  const token = localStorage.getItem("authTokenSportsCenter") ?? "";

  try {
    const response = await fetch(`${API_ENDPOINT}/user/preferences`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ preferences: preferences }),
    });
    if (response.ok) {
      if (save) {
        successNotification("Saved to favourite matches");
      } else {
        successNotification("Removed from favourite matches");
      }
    } else {
      errorNotification("Error in saving to favourite matches");
    }
  } catch (error) {
    console.log("Error while updating preferences:", error);
    errorNotification("Error in saving to favourite matches");
  }
};

const fetchMatch = async (
  matchID: number,
  setMatch: (data: any) => void,
  setloading: (isLoading: any) => void
) => {
  setloading(true);
  const token = localStorage.getItem("authTokenSportsCenter") ?? "";

  try {
    const response = await fetch(`${API_ENDPOINT}/matches/${matchID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const match = await response.json();
    setMatch(match);
    setloading(false);
  } catch (error) {
    console.log("Error fetching match:", error);
    setloading(false);
  }
};

const MatchDetails = () => {
  let [isOpen, setIsOpen] = useState(true);

  const [match, setMatch] = useState<any>(null);

  const [isLoading, setloading] = useState<boolean>(false);

  const [showMore, setShowMore] = useState<boolean>(false);

  const { theme } = useContext(ThemeContext);

  const [preferences, setPreferences] = useState<any>(null);

  const [isLogedin, setLogin] = useState(false);

  const updateCheck = (id: number) => {
    let save = false;
    const newMatches =
      preferences?.matches?.length > 0 ? [...preferences.matches] : [];
    const index = newMatches.indexOf(id);
    if (index > -1) {
      newMatches.splice(index, 1);
    } else {
      newMatches.push(id);
      save = true;
    }
    setPreferences({ ...preferences, matches: newMatches });
    updatePreferences({ ...preferences, matches: newMatches }, save);
  };

  let { matchID } = useParams();
  let navigate = useNavigate();

  function closeModal() {
    setIsOpen(false);
    navigate("../");
  }

  useEffect(() => {
    fetchMatch(Number(matchID!), setMatch, setloading);
    fetchPreferences(setPreferences);
    checkLogin(setLogin);
  }, [matchID]);

  const formateDate = (Rdate: Date) => {
    const date = new Date(Rdate);
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
    return formattedDate;
  };

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

  const startDate = formateDate(match?.startsAt);
  const endDate = formateDate(match?.endsAt);
  let entries;
  let firstTeamName;
  let firstTeamScore;
  let secondTeamName;
  let secondTeamScore;

  if (match?.score !== undefined) {
    entries = Object.keys(match.score);
    firstTeamName = entries[0];
    firstTeamScore = match.score[firstTeamName];
    secondTeamName = entries[1];
    secondTeamScore = match.score[secondTeamName];
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className={`relative z-100 ${theme ?? ""}`}
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {isLoading === true ? (
                    <span>Loading...</span>
                  ) : (
                    <>
                      <Dialog.Title
                        as="h3"
                        className="flex font-bold justify-between text-lg  leading-6 text-gray-900 items-center dark:text-white"
                      >
                        {match?.name}
                        <img
                          src={closeIcon}
                          alt="close"
                          className="w-8 h-8 cursor-pointer"
                          onClick={closeModal}
                        />
                      </Dialog.Title>
                      <div className="mt-2">
                        <div>
                          <img
                            src={backgroundImageUrl(match?.sportName)}
                            alt={`${match?.name}`}
                            className="w-full h-64 object-cover rounded-md"
                          />
                          <div className="flex mt-1">
                            <span className="flex-1 relative">
                              <div
                                className={`flex justify-center leading-loose text-bold  ${
                                  match?.isRunning === true
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
                            {isLogedin ? (
                              <button
                                className="flex-1 ml-3  p-1 px-2 rounded-lg uppercase text-xs tracking-wider bg-blue-500 hover:bg-blue-700 text-white font-bold py-2"
                                onClick={() => updateCheck(match?.id)}
                              >
                                {preferences?.matches?.includes(match?.id)
                                  ? "Remove"
                                  : "Save"}
                              </button>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <h2 className="text-gray-600 font-bold  dark:text-white text-md tracking-tight mb-2 mr-4">
                              {`Sport Name: ${
                                match?.sportName ?? "Not Available"
                              }`}
                            </h2>
                            <h2 className="text-gray-600 font-bold dark:text-white text-md tracking-tight mb-2 mr-4">
                              {`Start Date: ${startDate ?? "Not Available"}`}
                            </h2>
                            <h2 className="text-gray-600 font-bold dark:text-white text-md tracking-tight mb-2 mr-4">
                              {`End Date: ${endDate ?? "Not Available"}`}
                            </h2>
                            <h2 className="text-gray-600 font-bold dark:text-white text-md tracking-tight mb-2 mr-4">
                              {`Location: ${
                                match?.location ?? "Not Available"
                              }`}
                            </h2>
                          </div>
                          <div className="flex">
                            {match?.teams?.map((team: any) => {
                              return (
                                <div
                                  key={team.id}
                                  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-1"
                                >
                                  {team.name}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center p-4 border-t border-gray-300 ">
                            <div className="text-sm pr-1 font-semibold">
                              {firstTeamName ?? "Not Available"}
                            </div>
                            <div className="leading-loose bg-blue-500 text-white p-1 px-2 rounded-lg uppercase text-xs tracking-wider mr-2 ml-2">
                              {firstTeamScore ?? "Not Available"}
                            </div>
                            <div className="leading-loose bg-green-500 text-white p-1 px-2 rounded-lg uppercase text-xs tracking-wider">
                              VS
                            </div>
                            <div className="leading-loose bg-blue-500 text-white p-1 px-2 rounded-lg uppercase text-xs tracking-wider mr-2 ml-2">
                              {secondTeamScore ?? "Not Available"}
                            </div>
                            <span className="text-sm font-semibold">
                              {secondTeamName ?? "Not Available"}
                            </span>
                          </div>
                        </div>
                        <h2
                          className={`text-gray-800 ${
                            showMore ? "" : "truncate"
                          } dark:text-white text-md font-medium tracking-tight mb-2 mr-4`}
                        >
                          {`Story: ${match?.story}`}
                        </h2>
                        <div className="flex justify-center">
                          <button
                            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                            onClick={() => setShowMore(!showMore)}
                          >
                            {showMore ? "Read Less" : "Read More"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MatchDetails;
