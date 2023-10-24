/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useContext, Fragment, useEffect } from "react";
import { Disclosure, Menu, Switch, Transition } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Logo from "../../assets/images/logo.jpg";
import SettingIcon from "../../assets/images/setting.svg";
import { ThemeContext } from "../../context/theme";
import { Link } from "react-router-dom";

const getMenuOptions = () => {
  const userNavigation = [
    localStorage.getItem("authTokenSportsCenter") === null
      ? { name: "Sign in", href: "/signin" }
      : null,
    localStorage.getItem("authTokenSportsCenter") === null
      ? { name: "Sign up", href: "/signup" }
      : null,
    localStorage.getItem("authTokenSportsCenter") === null
      ? null
      : { name: "Sign out", href: "/logout" },
    localStorage.getItem("authTokenSportsCenter") === null
      ? null
      : { name: "Change Password", href: "/home/changepassword" },
  ];

  return userNavigation;
};

const checkLogin = (setLogin: (isLogedin: boolean) => void) => {
  localStorage.getItem("authTokenSportsCenter") === null
    ? setLogin(false)
    : setLogin(true);
};

const classNames = (...classes: string[]): string =>
  classes.filter(Boolean).join(" ");

const Appbar = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [enabled, setEnabled] = useState(false);
  const [isLogedin, setLogin] = useState(false);
  const [menu, setMenu] = useState(getMenuOptions());
  // const { pathname } = useLocation();

  // const navigation = [
  //   { name: "Projects", href: "/account/projects", current: false },
  //   { name: "Members", href: "/account/members", current: false },
  // ];

  useEffect(() => {
    setMenu(getMenuOptions());
    checkLogin(setLogin);
  }, []);

  const toggleTheme = () => {
    let newTheme = "";
    if (theme === "light") {
      newTheme = "dark";
    } else {
      newTheme = "light";
    }
    console.log(newTheme);
    setEnabled(!enabled);
    setTheme(newTheme);
  };

  return (
    <>
      <Disclosure
        as="nav"
        className="border-b border-slate-200 bg-green-300 dark:bg-gray-700"
      >
        <div className="mx-auto max-w-10xl px-4 sm:px-6 lg:px-0">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img className="h-16" src={Logo} alt="Sports Center" />
              </div>
              <h1 className="text-3xl font-semibold text-center pl-4 text-gray-700 dark:text-white">
                Sports Center
              </h1>
              {/* <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => {
                    const isCurrent = pathname.includes(item.href);

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          isCurrent
                            ? "bg-slate-50 text-blue-700"
                            : "text-slate-500 hover:text-blue-600",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>*/}
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <h1 className="text-md font-semibold pr-3">Dark Mode</h1>
                <Switch
                  checked={enabled}
                  onChange={toggleTheme}
                  className={`${enabled ? "bg-slate-400" : "bg-slate-700"}
              relative inline-flex h-[24px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                  <span
                    aria-hidden="true"
                    className={`${enabled ? "translate-x-8" : "translate-x-0"}
                pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
                {isLogedin ? (
                  <Link
                    to={"/home/preferences"}
                    className="h-6 w-6 ml-5 cursor-pointer"
                  >
                    <img src={SettingIcon} alt="settings" />
                  </Link>
                ) : null}
                {isLogedin ? (
                  <h2 className="text-xl font-medium text-gray-700 dark:text-white tracking-tight ml-5">
                    {
                      JSON.parse(localStorage.getItem("userDataSportsCenter")!)
                        .name
                    }
                  </h2>
                ) : null}
                <Menu as="div" className="relative ml-3 mr-5">
                  <div>
                    <Menu.Button className="rounded-full bg-white p-1 text-gray-400 hover:text-blue-600">
                      <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {menu
                        .filter((item) => item != null)
                        .map((item) => (
                          <Menu.Item key={item?.name}>
                            {({ active }) => (
                              <Link
                                to={`${item?.href}`}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                {item?.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </Disclosure>
    </>
  );
};

export default Appbar;
