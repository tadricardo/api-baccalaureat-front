import { combineReducers} from "redux";
import authen from "./reducerAuthentification";
import message from "./reducerMessage";
import changeStateReducer from './reducerResponsive';

export default combineReducers({authen,message,changeStateReducer});