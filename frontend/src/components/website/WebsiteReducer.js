import {GET_websites, ADD_website, UPDATE_website, DELETE_website, SET_website} from "./WebsiteTypes";

const initialState = {
  websites: [],
  website: {}
};

export const websitesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_websites:
      return {
        ...state,
        websites: action.payload,
        website: action.payload
      };
      case SET_website:
      return {
        ...state,
        website: action.payload
      };
    case ADD_website:
      return {
        ...state,
        websites: [...state.websites, action.payload]
      };
    case DELETE_website:
      return {
        ...state,
        websites: state.websites.filter((item, index) => item.id !== action.payload)
      };
    case UPDATE_website:
      const updatedwebsites = state.websites.map(item => {
        if (item.id === action.payload.id) {
          return { ...item, ...action.payload };
        }
        return item;
      });
      return {
        ...state,
        websites: updatedwebsites
      };
    default:
      return state;
  }
};
