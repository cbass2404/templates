import {
  SET_STATUS,
  SET_A_STATUS,
  LIKE_STATUS,
  UNLIKE_STATUS,
  LOADING_DATA,
  DELETE_STATUS,
  POST_STATUS,
  SUBMIT_COMMENT,
} from "../types";

const initialState = {
  status: [],
  aStatus: {},
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_STATUS:
      return {
        ...state,
        status: action.payload,
        loading: false,
      };
    case SET_A_STATUS:
      return {
        ...state,
        aStatus: action.payload,
      };
    case LIKE_STATUS:
    case UNLIKE_STATUS:
      let index = state.status.findIndex(
        (status) => status.statusId === action.payload.statusId
      );
      state.status[index] = action.payload;
      if (state.aStatus.statusId === action.payload.statusId) {
        state.aStatus = action.payload;
      }
      if (state.status.statusId === action.payload.statusId) {
        state.status = action.payload;
      }
      return {
        ...state,
      };
    case DELETE_STATUS:
      let deleteIndex = state.status.findIndex(
        (status) => status.statusId === action.payload
      );
      state.status.splice(deleteIndex, 1);
      return {
        ...state,
      };
    case POST_STATUS:
      return {
        ...state,
        status: [action.payload, ...state.status],
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        aStatus: {
          ...state.aStatus,
          comments: [action.payload, ...state.aStatus.comments],
        },
      };
    default:
      return state;
  }
}
