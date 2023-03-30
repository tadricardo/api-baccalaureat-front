import { createStore, applyMiddleware } from "redux";
import reducers from "./reducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';
const middleware = [thunk];

  const store = createStore(reducers,composeWithDevTools(applyMiddleware(...middleware)));
export default store;