export interface Article {
  id: number;
  date: Date;
  sport: { id: number; name: string };
  summary: string;
  thumbnail: string;
  title: string;
  teams: { id: number; name: string }[];
}

export interface ArticlesState {
  articles: Article[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}

export type ArticlesActions =
  | { type: "FETCH_ARTICLES_REQUEST" }
  | { type: "FETCH_ARTICLES_SUCCESS"; payload: Article[] }
  | { type: "UPDATE_ARTICLES_SUCCESS"; payload: Article }
  | { type: "FETCH_ARTICLES_FAILURE"; payload: string };

export const initialState: ArticlesState = {
  articles: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
};

export const reducer = (
  state: ArticlesState = initialState,
  action: ArticlesActions
): ArticlesState => {
  switch (action.type) {
    case "FETCH_ARTICLES_REQUEST":
      return {
        ...state,
        isLoading: true,
      };
    case "FETCH_ARTICLES_SUCCESS":
      return {
        ...state,
        isLoading: false,
        articles: action.payload,
      };
    case "UPDATE_ARTICLES_SUCCESS":
      return {
        ...state,
        isLoading: false,
        articles: state.articles.map((match) =>
          match.id === action.payload.id ? action.payload : match
        ),
      };
    case "FETCH_ARTICLES_FAILURE":
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
