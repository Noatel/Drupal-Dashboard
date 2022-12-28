import { GET_pages, ADD_page, UPDATE_page, DELETE_page } from "./PageTypes";

const initialState = {
  pages: []
};

export const pagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_pages:
      return {
        ...state,
        pages: action.payload
      };
    case ADD_page:
      return {
        ...state,
        pages: [...state.websites, action.payload]
      };
    case DELETE_page:
      return {
        ...state,
        pages: state.websites.filter((item, index) => item.id !== action.payload)
      };
    case UPDATE_page:
      const updatedpage = state.websites.map(item => {
        if (item.id === action.payload.id) {
          return { ...item, ...action.payload };
        }
        return item;
      });
      return {
        ...state,
        pages: updatedpage
      };
    default:
      return state;
  }
};
