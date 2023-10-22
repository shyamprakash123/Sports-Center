interface Match {
  id: number;
  name: string;
}

export interface Preferences {
  sports?: string[];
  teams?: string[];
}

export interface MatchesState {
  matches: Match[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  preferences: Preferences;
}

export type MatchesActions =
  | { type: "FETCH_MATCHES_REQUEST" }
  | {
      type: "FETCH_MATCHES_SUCCESS";
      payload: Match[];
      preferences: Preferences;
    }
  | { type: "UPDATE_MATCHES_SUCCESS"; payload: Match }
  | { type: "FETCH_MATCHES_FAILURE"; payload: string };

export const initialState: MatchesState = {
  matches: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
  preferences: {},
};

export const reducer = (
  state: MatchesState = initialState,
  action: MatchesActions
): MatchesState => {
  switch (action.type) {
    case "FETCH_MATCHES_REQUEST":
      return {
        ...state,
        isLoading: true,
      };
    case "FETCH_MATCHES_SUCCESS":
      return {
        ...state,
        isLoading: false,
        matches: action.payload,
        preferences: action.preferences,
      };
    case "UPDATE_MATCHES_SUCCESS":
      return {
        ...state,
        isLoading: false,
        matches: state.matches.map((match) =>
          match.id === action.payload.id ? action.payload : match
        ),
      };
    case "FETCH_MATCHES_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload,
      };

    default:
      return state;
  }
};
