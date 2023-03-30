import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";


export default function ProtectedRoute( { redirectTo, children, ...rest } ){
    const authen = useSelector(state => state.authen);
    if(!authen.isLoggedIn){
        return (
            <Redirect to={ { pathname: redirectTo }} />
        )
    }else{
        return (
            <Route {...rest}  />
    
        )
    }
;
}