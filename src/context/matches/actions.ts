/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINT } from "../../config/constants";

const checkLogin = () => {
  return localStorage.getItem("authTokenSportsCenter") !== null;
};

export const fetchMatches = async (dispatch: any) => {
  const token = localStorage.getItem("authTokenSportsCenter") ?? "";
  let preferences = undefined;

  try {
    dispatch({ type: "FETCH_MATCHES_REQUEST" });
    const response = await fetch(`${API_ENDPOINT}/matches`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (checkLogin()) {
      const responsePreference = await fetch(
        `${API_ENDPOINT}/user/preferences`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      preferences = await responsePreference.json();
    }

    const data = await response.json();
    const finalData = await Promise.all(
      data.matches.map(async (match: any) => {
        const response = await fetch(`${API_ENDPOINT}/matches/${match.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        return await response.json();
      })
    );
    dispatch({
      type: "FETCH_MATCHES_SUCCESS",
      payload: finalData,
      preferences: preferences?.preferences,
    });
  } catch (error) {
    console.log("Error fetching matches:", error);
    dispatch({
      type: "FETCH_MATCHES_FAILURE",
      payload: "Unable to load matches",
    });
  }
};

export const fetchMatch = async (
  dispatch: any,
  matchId: number,
  setRefresh: (id: number | null) => void
) => {
  const token = localStorage.getItem("authTokenSportsCenter") ?? "";

  try {
    const response = await fetch(`${API_ENDPOINT}/matches/${matchId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    dispatch({ type: "UPDATE_MATCHES_SUCCESS", payload: data });
    setRefresh(null);
  } catch (error) {
    console.log("Error fetching matches:", error);
  }
};
