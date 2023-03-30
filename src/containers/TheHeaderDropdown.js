import React, { Component } from "react";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { withRouter } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";

class TheHeaderDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }

  componentDidMount() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token !== null) {
      this.setState({ user: jwt_decode(token) });
    }
  }

  logOutClick() {
    localStorage.removeItem("token");
    this.props.history.push("/login");
    window.location.reload();
  }

  render() {
    const { user } = this.state;
    return (
      <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
        <CDropdownToggle className="c-header-nav-link" caret={false}>
          <div>
            <p>{user.fullName} <FontAwesomeIcon className="ml-1" icon={faAngleDown} /></p>
          </div>
        </CDropdownToggle>
        <CDropdownMenu className="m-0 pt-0"  placement="bottom-end">
          <CDropdownItem header tag="div" color="light" className="text-center">
            <strong>{user.email}</strong>
          </CDropdownItem>
          <CDropdownItem to={{ pathname: `/salaries/profil/${user.id}`, state: user.id }}>
            <CIcon name="cil-user" className="mfe-2" /> 
            Profile
          </CDropdownItem>
          <CDropdownItem to={`/doc`}>
            <FontAwesomeIcon  icon={faQuestionCircle} className="mfe-2" /> Documentation
          </CDropdownItem>
          <CDropdownItem divider />
          <CDropdownItem onClick={() => this.logOutClick()} to="/login">
            <CIcon name="cil-lock-locked" className="mfe-2" />
            Deconnexion
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    );
  }
}

export default withRouter(TheHeaderDropdown);
