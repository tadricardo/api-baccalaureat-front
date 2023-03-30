import { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { logout } from "../../redux/actions/actionCreatorUserAuth";

function Logout({ logout }) {
    const [redirect, setRedirect] = useState(false);

    logout();

    setTimeout(() => {
        setRedirect(true);
    }, 2000);

    return (
        <>
            {redirect && <Redirect to="/#/login"></Redirect>}
        </>
    )
}

const mapDispatchToProps = (dispatch) => {
    return { logout: () => dispatch(logout()) }
}

export default connect(null, mapDispatchToProps)(Logout)