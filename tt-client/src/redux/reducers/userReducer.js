import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_UI,
  LOADING_USER,
  LIKE_STATUS,
  UNLIKE_STATUS,
} from "../types";

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  notifications: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return {
        ...state,
        authenticated: false,
      };
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case LIKE_STATUS:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.handle,
            statusId: action.payload.statusId,
          },
        ],
      };
    case UNLIKE_STATUS:
      return {
        ...state,
        likes: state.likes.filter(
          (like) => like.statusId !== action.payload.statusId
        ),
      };
    default:
      return state;
  }
}
