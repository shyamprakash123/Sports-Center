/* eslint-disable @typescript-eslint/no-unused-vars */
import { createBrowserRouter, Navigate } from "react-router-dom";
import Notfound from "../NotFound";
import Logout from "../logout";
import Signin from "../signin";
import Signup from "../signup";
import HomeLayout from "../layouts/home";
import ArticalDetails from "../atricles/ArticleDetails";
import Preferences from "../Preferences/Preferences";
import MatchDetails from "../matches/MatchDetails";
import UpdatePassword from "../changepassword/ChangePassword";
import { FavouriteMatches } from "../matches/FavouriteMatches";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/home" replace /> },
  {
    path: "/",
    element: <Signin />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/notfound",
    element: <Notfound />,
  },
  {
    path: "home/favourites",
    element: <FavouriteMatches />,
    children: [
      {
        path: "matches/:matchID",
        element: <MatchDetails />,
      },
      {
        path: "article/:articleID",
        element: <ArticalDetails />,
      },
    ],
  },
  {
    path: "home",
    element: <HomeLayout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      {
        path: "article/:articleID",
        element: <ArticalDetails />,
      },
      {
        path: "matches/:matchID",
        element: <MatchDetails />,
      },
      {
        path: "preferences",
        element: <Preferences />,
      },
      {
        path: "changepassword",
        element: <UpdatePassword />,
      },
    ],
  },
  {
    path: "*",
    element: <Notfound />,
  },
]);

export default router;
