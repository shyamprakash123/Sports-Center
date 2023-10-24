/* eslint-disable @typescript-eslint/no-unused-vars */
import { createBrowserRouter, Navigate } from "react-router-dom";
import Notfound from "../NotFound";
import Logout from "../logout";
import Signin from "../signin";
import Signup from "../signup";
import AccountLayout from "../layouts/account";
import ArticalDetails from "../atricles/ArticleDetails";
import Preferences from "../Preferences/Preferences";
import MatchDetails from "../matches/MatchDetails";

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
    path: "home",
    element: <AccountLayout />,
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
    ],
  },
  {
    path: "*",
    element: <Notfound />,
  },
]);

export default router;
