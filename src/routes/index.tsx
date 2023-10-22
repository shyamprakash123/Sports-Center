/* eslint-disable @typescript-eslint/no-unused-vars */
import { createBrowserRouter, Navigate } from "react-router-dom";
import Notfound from "../NotFound";
import Logout from "../logout";
import Signin from "../signin";
import Signup from "../signup";
import ProtectedRoute from "./ProtectedRoute";
import AccountLayout from "../layouts/account";

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
  //Protected Routes
  {
    path: "home",
    element: (
      <ProtectedRoute>
        <AccountLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      {
        path: "projects",
        element: <Notfound />,
        children: [
          { index: true, element: <Notfound /> },
          {
            path: ":projectID",
            element: <Notfound />,
            children: [
              { index: true, element: <></> },
              {
                path: "tasks",
                children: [
                  { index: true, element: <Navigate to="../" /> },
                  {
                    path: "new",
                    element: <Notfound />,
                  },
                  {
                    path: ":taskID",
                    children: [{ index: true, element: <Notfound /> }],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "members",
        element: <Notfound />,
      },
    ],
  },
]);

export default router;
