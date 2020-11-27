import { SET_STATUS, LOADING_DATA, LIKE_STATUS, UNLIKE_STATUS } from "../types";
import axios from "axios";

// get all status
export const getStatus = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/status")
    .then((res) => {
      dispatch({
        type: SET_STATUS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_STATUS,
        payload: [],
      });
    });
};

// like status
export const likeStatus = (statusId) => (dispatch) => {
  axios
    .get(`/status/${statusId}/like`)
    .then((res) => {
      console.log(res);
      dispatch({
        type: LIKE_STATUS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// unlike status
export const unlikeStatus = (statusId) => (dispatch) => {
  axios
    .get(`/status/${statusId}/unlike`)
    .then((res) => {
      dispatch({
        type: UNLIKE_STATUS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};
