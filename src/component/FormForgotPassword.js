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

class FormForgotPassword extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.state = {
            email: "",
            message: "",
            errorBool: true,
            loading: false,
        };
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value,
        });
    }

    handleLogin(e) {
        e.preventDefault();
        this.setState({
            loading: true,
        });
        authService.sendEmailForForgotPassword(this.state.email).then(
            (data) => {
                const message = `Un courriel a été envoie à l'adresse ${this.state.email}.`;
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

    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { message, errorBool, loading } = this.state;

        return (
            <>
                <CForm onSubmit={this.handleLogin}>
                    <h1>Retrouvez votre compte</h1>
                    {message && <CAlert color={errorBool ? "danger" : "success"}>{message}</CAlert>}
                    <CLabel htmlFor="emailForgotPassword">Veuillez entrer votre adresse e-mail</CLabel>
                    <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                            <CInputGroupText>
                                <CIcon name="cil-user" />
                            </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                            id="emailForgotPassword"
                            name="emailForgotPassword"
                            type="text"
                            value={this.state.email}
                            onChange={this.onChangeEmail}
                            placeholder="Adresse email"
                            disabled={loading}
                        />
                    </CInputGroup>
                    <CRow>
                        <CCol xs="12">
                            {errorBool && (
                                <CButton type="submit" color="primary" className={`px-4 ${loading && "disabled"}`} >
                                    {loading && <CSpinner size="sm" variant="border" />} Rechercher
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
