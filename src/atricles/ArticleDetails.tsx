/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../../src/config/constants";
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
        successNotification("Saved to favourite articles");
      } else {
        successNotification("Removed from favourite articles");
      }
    } else {
      errorNotification("Error in saving to favourite articles");
    }
  } catch (error) {
    console.log("Error while updating preferences:", error);
    errorNotification("Error in saving to favourite articles");
  }
};

const fetchArticle = async (
  articleID: number,
  setArticle: (data: any) => void,
  setloading: (isLoading: any) => void
) => {
  setloading(true);
  const token = localStorage.getItem("authTokenSportsCenter") ?? "";

  try {
    const response = await fetch(`${API_ENDPOINT}/articles/${articleID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const article = await response.json();
    setArticle(article);
    setloading(false);
  } catch (error) {
    console.log("Error fetching article:", error);
    setloading(false);
  }
};
const ArticalDetails = () => {
  let [isOpen, setIsOpen] = useState(true);

  const [article, setArticle] = useState<any>(null);

  const [isLoading, setloading] = useState<boolean>(false);

  const { theme } = useContext(ThemeContext);
  const [preferences, setPreferences] = useState<any>(null);

  const [isLogedin, setLogin] = useState(false);

  const updateCheck = (id: number) => {
    let save = false;
    const newArticles =
      preferences?.articles?.length > 0 ? [...preferences.articles] : [];
    const index = newArticles.indexOf(id);
    if (index > -1) {
      newArticles.splice(index, 1);
    } else {
      newArticles.push(id);
      save = true;
    }
    setPreferences({ ...preferences, articles: newArticles });
    updatePreferences({ ...preferences, articles: newArticles }, save);
  };

  let { articleID } = useParams();
  let navigate = useNavigate();

  function closeModal() {
    setIsOpen(false);
    navigate("../");
  }

  useEffect(() => {
    fetchArticle(Number(articleID!), setArticle, setloading);
    fetchPreferences(setPreferences);
    checkLogin(setLogin);
  }, [articleID]);

  const date = new Date(article?.date);
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

  const formattedDate = `${daysOfWeek[dayOfWeek]}, ${dayOfMonth} ${getMonthName(
    month
  )} ${year}`;

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
                        {article?.title}
                        <img
                          src={closeIcon}
                          alt="close"
                          className="w-8 h-8 cursor-pointer"
                          onClick={closeModal}
                        />
                      </Dialog.Title>
                      <div className="mt-2">
                        <img
                          src={`${article?.thumbnail}`}
                          alt={`${article?.title}`}
                          className="w-full h-64 object-cover rounded-md"
                        />
                        <div className="flex justify-between items-center">
                          <div>
                            <h2 className="text-gray-600 font-bold  dark:text-white text-md tracking-tight mb-2 mr-4">
                              {`Sport Name: ${article?.sport.name}`}
                            </h2>
                            <h2 className="text-gray-600 font-bold dark:text-white text-md tracking-tight mb-2 mr-4">
                              {`Date: ${formattedDate}`}
                            </h2>
                          </div>
                          <div className="flex">
                            {article?.teams.map((team: any) => {
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
                        <div className="flex">
                          {isLogedin ? (
                            <button
                              className="flex-1   p-1 px-2 rounded-lg uppercase text-xs tracking-wider bg-blue-500 hover:bg-blue-700 text-white font-bold py-2"
                              onClick={() => updateCheck(article?.id)}
                            >
                              {preferences?.articles?.includes(article?.id)
                                ? "Remove"
                                : "Save"}
                            </button>
                          ) : null}
                        </div>
                        <h2 className="text-gray-800  dark:text-white text-md font-medium tracking-tight mb-2 mr-4">
                          {`Summary: ${article?.content}`}
                        </h2>
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

export default ArticalDetails;
