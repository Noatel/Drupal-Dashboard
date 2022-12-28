import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import { loginReducer } from "./components/login/LoginReducer";
import { websitesReducer } from "./components/website/WebsiteReducer";
import { pagesReducer } from "./components/pages/PageReducer";

const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    auth: loginReducer,
    websites: websitesReducer,
    pages: pagesReducer,
  });

export default createRootReducer;
