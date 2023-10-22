import { useEffect } from "react";
import { useMatchesDispatch } from "../context/matches/context";
import { fetchMatches } from "../context/matches/actions";
import { Outlet } from "react-router-dom";

const MatchContainer = () => {
  const projectDispatch = useMatchesDispatch();
  useEffect(() => {
    fetchMatches(projectDispatch);
  }, [projectDispatch]);
  return <Outlet />;
};

export default MatchContainer;
