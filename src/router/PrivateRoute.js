import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";
import jwt_decode from 'jwt-decode';


export default function PrivateRoute({ redirectTo, children, ...rest }) {
    const authen = useSelector(state => state.authen);
    let acces = false;
    if (authen.acces !== null) {
        const user = jwt_decode(authen.acces);
        acces = user.acces.some(acces => acces.frontRoute === rest.path);
    }
    return (
        { ...acces ? <Route {...rest} /> : <Redirect to={{ pathname: redirectTo }} /> }
    );
}