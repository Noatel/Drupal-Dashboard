import axios from "axios";
import {toastOnError} from "../../utils/Utils";
import {GET_websites, ADD_website, DELETE_website, UPDATE_website, SET_website} from "./WebsiteTypes";

export const getWebsites = () => dispatch => {
    axios
        .get("/websites/")
        .then(response => {
            dispatch({
                type: GET_websites,
                payload: response.data,
            });
        })
        .catch(error => {
            toastOnError(error);
        });
};

export const setWebsite = website => dispatch => {
    dispatch({
        type: SET_website,
        payload: website,
    });
};


export const addWebsite = website => dispatch => {
    axios
        .post("/websites/", website)
        .then(response => {
            dispatch({
                type: ADD_website,
                payload: response.data
            });
        })
        .catch(error => {
            toastOnError(error);
        });
};

export const scheduleWebsite = id => dispatch => {
    axios
        .post(`/websites/${id}/schedule/`)
        .then(response => {
            dispatch({
                type: ADD_website,
                payload: response.data
            });
        })
        .catch(error => {
            toastOnError(error);
        });
};


export const scheduleChecklist = id => dispatch => {
    axios
        .post(`/websites/${id}/checklist/`)
        .then(response => {
            dispatch({
                type: ADD_website,
                payload: response.data
            });
        })
        .catch(error => {
            toastOnError(error);
        });
};

export const deleteWebsite = id => dispatch => {
    axios
        .delete(`/websites/${id}/`)
        .then(response => {
            dispatch({
                type: DELETE_website,
                payload: id
            });
        })
        .catch(error => {
            toastOnError(error);
        });
};

export const updateWebsite = (id, website) => dispatch => {
    axios
        .patch(`/websites/${id}/`, website)
        .then(response => {
            dispatch({
                type: UPDATE_website,
                payload: response.data
            });
        })
        .catch(error => {
            toastOnError(error);
        });
};
