import { useEffect } from "react";
import { useMatchesDispatch } from "../context/matches/context";
import { fetchMatches } from "../context/matches/actions";
import { Outlet } from "react-router-dom";

const MatchContainer = () => {
  const matchDispatch = useMatchesDispatch();
  useEffect(() => {
    fetchMatches(matchDispatch);
  }, [matchDispatch]);
  return <Outlet />;
};

export default MatchContainer;
