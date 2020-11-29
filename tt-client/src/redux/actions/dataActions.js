import {
  SET_STATUS,
  LOADING_DATA,
  LIKE_STATUS,
  UNLIKE_STATUS,
  DELETE_STATUS,
  SET_ERRORS,
  POST_STATUS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_A_STATUS,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
} from "../types";
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
      console.log("get all status, dataActions.js", err);
    });
};

// get a status
export const getAStatus = (statusId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/status/${statusId}`)
    .then((res) => {
      dispatch({
        type: SET_A_STATUS,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log("getAStatus, dataActions.js", err));
};

// post new status
export const postStatus = (newStatus) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/status", newStatus)
    .then((res) => {
      dispatch({
        type: POST_STATUS,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
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
    .catch((err) => console.log("like status, dataActions.js", err));
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
    .catch((err) => console.log("unlike status, dataActions.js", err));
};

// submit new coment
export const submitComment = (statusId, commentData) => (dispatch) => {
  axios
    .post(`/status/${statusId}/comment`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

// delete status
export const deleteStatus = (statusId) => (dispatch) => {
  axios
    .delete(`/status/${statusId}`)
    .then(() => {
      dispatch({ type: DELETE_STATUS, payload: statusId });
    })
    .catch((err) => console.log("Delete Status, dataActions.js", err));
};

// clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
