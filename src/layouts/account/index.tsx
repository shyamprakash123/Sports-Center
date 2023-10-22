import { Outlet } from "react-router-dom";
import Appbar from "./Appbar";
import { useEffect } from "react";
import { useMatchesDispatch } from "../../context/matches/context";
import { fetchMatches } from "../../context/matches/actions";
import Matches from "../../matches";

const AccountLayout = () => {
  const projectDispatch = useMatchesDispatch();
  useEffect(() => {
    fetchMatches(projectDispatch);
  }, [projectDispatch]);

  return (
    <>
      <Appbar />
      <main>
        <div className="mx-auto max-w-10xl py-6 sm:px-2 ">
          <Matches />
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default AccountLayout;
