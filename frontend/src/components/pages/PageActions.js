import axios from "axios";
import { toastOnError } from "../../utils/Utils";
import {ADD_page, DELETE_page, GET_pages, UPDATE_page} from "./PageTypes";

export const getPages = id => dispatch => {
  axios
    .get(`/pages/${id}`)
    .then(response => {
      dispatch({
        type: GET_pages,
        payload: response.data,
      });
    })
    .catch(error => {
      toastOnError(error);
    });
};

export const getPagesByWebsiteId = id => dispatch => {
    axios
        .get(`/pages?website_id=${id}`)
        .then(response => {
            dispatch({
                type: GET_pages,
                payload: response.data,
            });
        })
        .catch(error => {
            toastOnError(error);
        });
};

export const addPages = website => dispatch => {
  axios
    .post("/pages/", website)
    .then(response => {
      dispatch({
        type: ADD_page,
        payload: response.data
      });
    })
    .catch(error => {
      toastOnError(error);
    });
};

export const deletePage = id => dispatch => {
  axios
    .delete(`/pages/${id}/`)
    .then(response => {
      dispatch({
        type: DELETE_page,
        payload: id
      });
    })
    .catch(error => {
      toastOnError(error);
    });
};

export const updatePage = (id, website) => dispatch => {
  axios
    .patch(`/pages/${id}/`, website)
    .then(response => {
      dispatch({
        type: UPDATE_page,
        payload: response.data
      });
    })
    .catch(error => {
      toastOnError(error);
    });
};
