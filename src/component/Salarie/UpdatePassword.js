import React, { Component } from 'react';
import { withRouter } from "react-router";
import { CButton, CAlert, CSpinner } from "@coreui/react";
// eslint-disable-next-line no-unused-vars
import SalariesService from "../../services/salaries.service";
import PasswordStrengthMeter from "../PasswordStrengthMeter";
import zxcvbn from 'zxcvbn';

class UpdatePassword extends Component {
    constructor(props) {
        super(props)
        this.updatePassword = this.updatePassword.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validationForm = this.validationForm.bind(this);
        this.state = {
            currentErrors: {
                password: null,
                passwordMessage: null,
                passwordC: null,
                passwordMatchBool: null,
                passwordBool: null,
                passwordCBool: null,
            },
            password: "",
            passwordC: "",
            currentUser: {
                id: null
            },
            message: "",
            ifError: null,
            loading: false
        };
    }

    componentDidMount() {
        const { state } = this.props.location;
        this.setState({ currentUser: state })
        if (state === undefined) {
            this.props.history.push("/home");
        }
    }

    handleChange(e) {
        //let regexPassword = new RegExp(/^(?=.*[aA-zZ])(?=.*[0-9])(?=.{8,})/);

        const target = e.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        if (name === "password") {
            if (value === "" || value === null || value.length === 0) {
                this.setState((prevState) => ({
                    currentErrors: {
                        ...prevState.currentErrors,
                        password: "Ce champ est requis.",
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
                            passwordBool: true,
                            password : "Votre mot de passe est faible."
                        }
                    }));
                } else {
                    this.setState((prevState) => ({
                        password: value,
                        currentErrors: {
                            ...prevState.currentErrors,
                            password: null,
                            passwordBool: false,
                            passwordMessage : null
                        }
                    }));
                }

            }
        }
        if (name === "passwordC") {
            if (value === "" || value === null || value.length === 0) {
                this.setState((prevState) => ({
                    currentErrors: {
                        ...prevState.currentErrors,
                        passwordC: "Ce champ est requis.",
                        passwordCBool: true,
                    }
                }));
            } else {
                const testResult = zxcvbn(value);
                if (testResult.score < 2) {
                    this.setState((prevState) => ({
                        currentErrors: {
                            ...prevState.currentErrors,
                            passwordC: null,
                            passwordCBool: true,
                        },
                        passwordC: value
                    }));
                } else {
                    this.setState((prevState) => ({
                        currentErrors: {
                            ...prevState.currentErrors,
                            passwordC: null,
                            passwordCBool: false,
                        },
                        passwordC: value
                    }));
                }

            }
        }
    }
    
    validationForm() {
        const { password, passwordC,currentErrors } = this.state
        if(!currentErrors.passwordBool && !currentErrors.passwordCBool){
            if (password !== passwordC) {
                this.setState((prevState) => ({
                    ifError: true,
                    loading: false,
                    message: "Les mots de passe ne correspondent pas.",
                    currentErrors: {
                        ...prevState.currentErrors,
                        passwordMatchBool: true,
                    }
                }));
                return false
            } else {
                this.setState((prevState) => ({
                    ifError: false,
                    loading: true,
                    message: "",
                    currentErrors: {
                        ...prevState.currentErrors,
                        passwordMatch: null,
                        passwordMatchBool: false,
                    }
                }));
                return true
            }
        }else{
            this.setState((prevState) => ({
                ifError: true,
                loading: false,
                currentErrors: {
                    ...prevState.currentErrors,
                    passwordMatchBool: true,
                }
            }));
        }

    }

    updatePassword(e) {
        e.preventDefault();
        this.setState({ loading: true })
        if (this.validationForm()) {
            SalariesService.updatePassword(this.state.currentUser.id, this.state.password)
                .then((resp) => {
                    this.setState({
                        ifError: false,
                        loading: true,
                        message: "Modification du mot de passe bien prise en compte ! Redirection vers son profil."
                    });
                    window.setTimeout(() => { this.props.history.goBack() }, 2500)
                })
                .catch((error) => this.setState({ ifError: true, loading: false }))
        }
    }


    render() {
        const { currentUser, currentErrors, ifError, message, loading } = this.state;
        return (
            <div>
                {(currentUser !== undefined ? (
                    <>
                        <div className="submit-form">
                            <form name="updatePasswordForm" onSubmit={this.updatePassword}>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="password" className={currentErrors.passwordBool ? "font-weight-bold text-danger mr-2" : "font-weight-bold"}
                                            >Mot de passe *</label>
                                            <span className="text-danger">{currentErrors.password}</span>
                                            <input
                                                type="password"
                                                name="password"
                                                className={currentErrors.passwordBool ? "form-control is-invalid shadow-none" : "form-control shadow-none"}
                                                id="password"
                                                onChange={this.handleChange}
                                                required
                                            />
                                            <PasswordStrengthMeter password={this.state.password} />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="passwordC" className={currentErrors.passwordCBool ? "font-weight-bold text-danger mr-2" : "font-weight-bold"}>
                                                Confirmation du mot de passe *
                                            </label>
                                            <span className="text-danger">{currentErrors.passwordC}</span>
                                            <input
                                                type="password"
                                                name="passwordC"
                                                className={currentErrors.passwordCBool ? "form-control is-invalid shadow-none" : "form-control shadow-none"}
                                                id="passwordC"
                                                onChange={this.handleChange}
                                                required
                                            />
                                            
                                        </div>
                                    </div>
                                </div>
                                <p className="text-center text-danger">{currentErrors.passwordMessage}</p>
                                <CButton type="submit" block color="info" disabled={loading}>
                                    {loading && <CSpinner size="sm" variant="border" />} Modification du mot de passe
                                </CButton>
                            </form>
                            {ifError != null && (
                                <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <p>Il y a pas utilisateur</p>
                    </>
                ))}


            </div>
        )
    }
}
export default withRouter(UpdatePassword);