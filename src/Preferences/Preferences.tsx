/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../config/constants";
import closeIcon from "../assets/images/close.svg";
import { fetchMatches } from "../context/matches/actions";
import { useArticlesDispatch } from "../context/articles/context";
import { useMatchesDispatch } from "../context/matches/context";
import { fetchArticles } from "../context/articles/actions";

const fetchPreferences = async (
  setPreferences: (data: any) => void,
  setSports: (data: any) => void,
  setTeams: (data: any) => void,
  setloading: (isLoading: any) => void
) => {
  setloading(true);
  const token = localStorage.getItem("authTokenSportsCenter") ?? "";

  try {
    const response = await fetch(`${API_ENDPOINT}/user/preferences`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const responseSports = await fetch(`${API_ENDPOINT}/sports`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const sportsData = await responseSports.json();
    setSports(sportsData.sports);
    const responseData = await fetch(`${API_ENDPOINT}/teams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await responseData.json();
    setTeams(data);
    const preferences = await response.json();
    setPreferences(preferences.preferences);
    setloading(false);
  } catch (error) {
    console.log("Error fetching preferences:", error);
    setloading(false);
  }
};

const updatePreferences = async (preferences: any, closeModal: () => void) => {
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
    console.log(response.status);
    closeModal();
  } catch (error) {
    console.log("Error fetching preferences:", error);
    closeModal();
  }
};
const Preferences = () => {
  let [isOpen, setIsOpen] = useState(true);
  const matchDispatch = useMatchesDispatch();
  const articleDispatch = useArticlesDispatch();

  const [preferences, setPreferences] = useState<any>(null);
  const [sports, setSports] = useState<any>(null);
  const [teams, setTeams] = useState<any>(null);

  const [isLoading, setloading] = useState<boolean>(false);

  let navigate = useNavigate();

  function closeModal() {
    fetchMatches(matchDispatch);
    fetchArticles(articleDispatch);
    setIsOpen(false);
    navigate("../");
  }

  const onSelectSports = (name: string) => {
    const newSports = [...preferences.sports];
    const index = newSports.indexOf(name);
    if (index > -1) {
      newSports.splice(index, 1);
    } else {
      newSports.push(name);
    }
    console.log({ ...preferences, sports: newSports });
    setPreferences({ ...preferences, sports: newSports });
  };

  const onSelectTeams = (name: string) => {
    const newTeams = [...preferences.teams];
    const index = newTeams.indexOf(name);
    if (index > -1) {
      newTeams.splice(index, 1);
    } else {
      newTeams.push(name);
    }
    console.log({ ...preferences, teams: newTeams });
    setPreferences({ ...preferences, teams: newTeams });
  };

  useEffect(() => {
    fetchPreferences(setPreferences, setSports, setTeams, setloading);
  }, []);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {isLoading === true ? (
                    <span>Loading...</span>
                  ) : (
                    <>
                      <Dialog.Title
                        as="h3"
                        className="flex font-bold justify-between text-2xl  leading-6 text-gray-900 items-center"
                      >
                        Preferences
                        <img
                          src={closeIcon}
                          alt="close"
                          className="w-8 h-8 cursor-pointer"
                          onClick={closeModal}
                        />
                      </Dialog.Title>
                      <div className="mt-2">
                        <h2 className="text-gray-800 font-bold dark:text-white text-xl  tracking-tight mb-2 mr-4">
                          Favourite Sports
                        </h2>
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          {sports?.map((sport: any) => {
                            return (
                              <div
                                key={sport.id}
                                className="flex items-center  mb-2"
                              >
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-gray-600"
                                    checked={
                                      preferences?.sports?.includes(
                                        sport.name
                                      ) ?? false
                                    }
                                    onChange={() => {
                                      onSelectSports(sport.name);
                                    }}
                                  />
                                </div>
                                <span className="text-gray-700  dark:text-white text-lg font-medium tracking-tight">
                                  {sport.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="mt-2">
                        <h2 className="text-gray-800 font-bold  dark:text-white text-xl  tracking-tight mb-2 mr-4">
                          Favourite Teams
                        </h2>
                        <div className="flex items-center flex-wrap gap-3">
                          {teams?.map((team: any) => {
                            return (
                              <div
                                key={team.id}
                                className="flex items-center  mb-2"
                              >
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-gray-600"
                                    checked={
                                      preferences?.teams?.includes(team.name) ??
                                      false
                                    }
                                    onChange={() => {
                                      onSelectTeams(team.name);
                                    }}
                                  />
                                </div>
                                <span className="text-gray-700  dark:text-white text-lg font-medium tracking-tight">
                                  {team.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`justify-center inline-flex items-center px-4 py-1.5 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 mt-1`}
                        onClick={() => {
                          updatePreferences(preferences, closeModal);
                        }}
                      >
                        Update
                      </button>
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

export default Preferences;
