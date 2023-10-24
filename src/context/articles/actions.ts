/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINT } from "../../config/constants";

const checkLogin = () => {
  return localStorage.getItem("authTokenSportsCenter") !== null;
};

export const fetchArticles = async (dispatch: any) => {
  const token = localStorage.getItem("authTokenSportsCenter") ?? "";
  let preferences = undefined;

  try {
    dispatch({ type: "FETCH_ARTICLES_REQUEST" });
    const response = await fetch(`${API_ENDPOINT}/articles`, {
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
      if (responsePreference.status === 401) {
        window.location.href = "/logout";
      }
    }

    const data = await response.json();
    dispatch({
      type: "FETCH_ARTICLES_SUCCESS",
      payload: data,
      preferences: preferences?.preferences,
    });
  } catch (error) {
    console.log("Error fetching articles:", error);
    dispatch({
      type: "FETCH_ARTICLES_FAILURE",
      payload: "Unable to load articles",
    });
  }
};

export const fetchArticle = async (
  dispatch: any,
  articlehId: number,
  setRefresh: (id: number | null) => void
) => {
  const token = localStorage.getItem("authTokenSportsCenter") ?? "";

  try {
    const response = await fetch(`${API_ENDPOINT}/articles/${articlehId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    dispatch({ type: "UPDATE_ARTICLES_SUCCESS", payload: data });
    setRefresh(null);
  } catch (error) {
    console.log("Error fetching articles:", error);
  }
};
