/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINT } from "../../config/constants";

export const fetchMatches = async (dispatch: any) => {
  const token = localStorage.getItem("authTokenSportsCenter") ?? "";

  try {
    dispatch({ type: "FETCH_MATCHES_REQUEST" });
    const response = await fetch(`${API_ENDPOINT}/matches`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
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
    dispatch({ type: "FETCH_MATCHES_SUCCESS", payload: finalData });
  } catch (error) {
    console.log("Error fetching matches:", error);
    dispatch({
      type: "FETCH_MATCHES_FAILURE",
      payload: "Unable to load matches",
    });
  }
};
