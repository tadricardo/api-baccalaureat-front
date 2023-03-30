import React, { Component } from "react";
import {
  CButton,
  CCol,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
  CLabel
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import authService from "src/services/auth.service";
import { withRouter } from "react-router-dom";
import queryString from 'query-string';
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import zxcvbn from "zxcvbn";

class FormForgotPassword extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      password: "",
      passwordC: "",
      message: "",
      errorBool: true,
      loading: false,
      currentErrors: {
        password: null,
        passwordBool: true,
        passwordMatch: null,
        passwordMatchBool: true
      }
    };

  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "password") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          password: value,
          currentErrors: {
            ...prevState.currentErrors,
            password: "Le mot de passe est requis",
            passwordMatch: null,
            passwordBool: true,
          }
        }));

      } else {
        const testResult = zxcvbn(value);
        if (testResult.score < 2) {
          this.setState((prevState) => ({
            password: value,
            currentErrors: {
              ...prevState.currentErrors,
              password: "Votre mot de passe est faible.",
              passwordMatch: null,
              passwordBool: true,
            }
          }));
        }else{
          if (this.state.passwordC !== value) {
            this.setState((prevState) => ({
              password: value,
              currentErrors: {
                ...prevState.currentErrors,
                password: null,
                passwordMatch: "Les mots de passe ne correspondent pas",
                passwordBool: true,
              }
            }));
          } else {
            if (value !== "" || value !== null || value.length !== 0) {
              this.setState((prevState) => ({
                password: value,
                currentErrors: {
                  ...prevState.currentErrors,
                  passwordMatch: null,
                  password: null,
                  passwordBool: false,
                }
              }));
            }
          }
        }
        

      }
    }

    if (name === "passwordC") {
      if (this.state.password !== value) {
        this.setState((prevState) => ({
          passwordC: value,
          currentErrors: {
            ...prevState.currentErrors,
            passwordMatch: "Les mots de passe ne correspondent pas",
            passwordMatchBool: true,
          }
        }));
      } else {
        if (value !== "" || value !== null || value.length !== 0) {
          this.setState((prevState) => ({
            passwordC: value,
            currentErrors: {
              ...prevState.currentErrors,
              passwordMatch: null,
              passwordMatchBool: false,
              password: null,
            }
          }));
        }
      }
    }
  }

  handleLogin(e) {
    e.preventDefault();
    this.setState({
      loading: true,
    });
    if (queryString.parse(this.props.location.search).token !== undefined) {
      const code = queryString.parse(this.props.location.search).token;
      authService.forgotPassword(code, this.state.passwordC).then(
        (data) => {
          const message = `Votre mot de passe a bien été change. Connectez-vous avec votre nouveau mot de passe.`;
          this.setState({
            errorBool: false,
            message: message
          })
          window.setTimeout(() => { this.props.history.push(`/login`) }, 2500);
        },
        (error) => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.setState({
            message: message,
            errorBool: true,
            loading: false
          });
        }
      ).catch(e => console.log(e));
    } else {
      this.setState({
        message: "Votre code est incorrect, veuillez redemander un email de changement. En cas d'un deuxiéme echec, contacter un administrateur.",
        errorBool: true,
        loading: false
      });
    }


  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { message, errorBool, loading, currentErrors } = this.state;
    return (
      <>
        <CForm onSubmit={this.handleLogin}>
          <h2>Réinitialiser le mot de passe</h2>
          {message && <CAlert color={errorBool ? "danger" : "success"}>{message}</CAlert>}
          <p className="text-muted">Veuillez entrer votre nouveau mot de passe</p>
          <CInputGroup>
          <CLabel htmlFor="password" hidden={true}>Nouveau mot de passe </CLabel>
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
              onChange={this.handleChange}
              placeholder="Saisir un nouveau mot de passe"
              className={currentErrors.password && "is-invalid"}
              disabled={loading}
            />
            
          </CInputGroup>
          <PasswordStrengthMeter password={this.state.password} />
          <span className="text-danger">{currentErrors.password}</span>
          <CInputGroup className="mt-4">
          <CLabel htmlFor="passwordC" hidden={true}>Confirmation du mot de passe </CLabel>
            <CInputGroupPrepend>
              <CInputGroupText>
                <CIcon name="cil-lock-locked" />
              </CInputGroupText>
            </CInputGroupPrepend>
            <CInput
              id="passwordC"
              name="passwordC"
              type="password"
              value={this.state.passwordC}
              onChange={this.handleChange}
              placeholder="Confirmation du mot de passe"
              className={currentErrors.passwordMatch && "is-invalid"}
              disabled={loading}
            />
          </CInputGroup>
          <span className="text-danger">{currentErrors.passwordMatch}</span>
          <CRow className="mt-4">
            <CCol xs="12">
              {errorBool && (
                <CButton type="submit" block lg color="primary" className={`px-4 ${loading && "disabled"}`} >
                  {loading && <CSpinner size="sm" variant="border" />} Sauvegarder
                </CButton>
              )}
            </CCol>
          </CRow>
        </CForm>
      </>
    );
  }
}


export default withRouter(FormForgotPassword);
