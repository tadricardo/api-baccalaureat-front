import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
  CButton,
  CCol,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CLabel,
  CRow,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { connect } from "react-redux";
import { login } from "../redux/actions/actionCreatorAuthentification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import ReCAPTCHA from "react-google-recaptcha";

class Authentification extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.captcha = this.captcha.bind(this);

    this.state = {
      email: "",
      password: "",
      loading: false,
      isCaptchaOk: false,
      TEST_SITE_KEY: "6LcofAMfAAAAAL25japw6qrBI9JxzZfvk844F1UO"
    };
    this._reCaptchaRef = React.createRef();
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  handleLogin(e) {
    e.preventDefault();
    this.setState({
      loading: true,
    });
    const { dispatch, history } = this.props;
    dispatch(login(this.state.email, this.state.password))
      .then(() => {
        if (this._isMounted) {
          history.push("/");
          window.location.reload();
        }
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  }

  captcha = (value) => {
    this.setState({ value });
    if (value !== null)
      this.setState({ isCaptchaOk: true });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { isLoggedIn, message } = this.props;
    const { messageError, loading, isCaptchaOk } = this.state;
    if (isLoggedIn) {
      return <Redirect to="/" />;
    }

    return (
      <>
        <CForm onSubmit={this.handleLogin}>
          <h1>S'identifier</h1>
          <p>{messageError}</p>
          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
          <p className="text-muted">Veuillez saisir vos identifiants</p>
          <CInputGroup className="mb-3">
            <CLabel htmlFor="email" hidden={true}>Adresse email</CLabel>
            <CInputGroupPrepend>
              <CInputGroupText>
                <CIcon name="cil-user" />
              </CInputGroupText>
            </CInputGroupPrepend>
            <CInput
              id="email"
              name="email"
              type="text"
              value={this.state.email}
              onChange={this.onChangeEmail}
              placeholder="Adresse email"
              disabled={loading}
            />
          </CInputGroup>
          <CInputGroup className="mb-4">
            <CLabel htmlFor="password" hidden={true}>Mot de passe </CLabel>
            <CInputGroupPrepend>
              <CInputGroupText>
                <CIcon name="cil-lock-locked" />
              </CInputGroupText>
            </CInputGroupPrepend>
            <CInput
              id="password"
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.onChangePassword}
              placeholder="Mot de passe"
              disabled={loading}
            />
          </CInputGroup>
          <CRow className="mb-3">
            <CCol xs="12">
              <ReCAPTCHA
                style={{ display: "inline-block" }}
                ref={this._reCaptchaRef}
                sitekey={this.state.TEST_SITE_KEY}
                onChange={this.captcha}
                asyncScriptOnLoad={this.asyncScriptOnLoad}
                onExpired={() => {
                  this.setState({ isCaptchaOk: false });
                }}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol xs="6">
              <CButton type="submit" color="primary" className="px-4" disabled={loading || !isCaptchaOk} title={!isCaptchaOk ? "Remplissez le Captcha" : "Connectez-vous"}>
                {loading && <CSpinner size="sm" variant="border" />} Connexion
              </CButton>
            </CCol>
            {/*<CCol xs="6" className="text-right">
              <CButton color="link" className="px-0" to={`/forgotPassword`} >
                Mot de passe oublié ?
              </CButton>
            </CCol>*/}
          </CRow>
          <hr></hr>
          <CRow>
            <CCol className="text-right">
              <CButton className="px-0" to={`/doc`} >
                <FontAwesomeIcon icon={faQuestionCircle} className="mfe-2" title="Documentation" /> FAQ
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.authen;
  const { message } = state.message;
  return {
    isLoggedIn,
    message,
  };
}

export default connect(mapStateToProps)(Authentification);
