import React, { Component } from "react";
import { CButton, CAlert, CSpinner } from "@coreui/react";
import { withRouter } from "react-router";
import SalariesService from "../../services/salaries.service";
class UpdateSalarie extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        this.updateSalarie = this.updateSalarie.bind(this);
        this.validationForm = this.validationForm.bind(this);
        this.state = {
            currentErrors: {
                lastname: null,
                lastnameBool: true,
                firstname: null,
                firstnameBool: true,
                email: null,
                emailBool: true,
                birthday: null,
                birthdayError: true,
                phonePerso: null,
                phonePersoBool: true,
                phoneMPerso: null,
                phoneMPersoBool: true,
                phonePro: null,
                phoneProBool: true,
                phoneMPro: null,
                phoneMProBool: true,
                adresse: null,
                adresseBool: true,
                domain: null,
                domainBool: true,
                company: null,
                companyBool: null,
                skills: null,
                skillsBool: true,
                role: null,
                roleBool: true,
            },
            currentSalarie: {
                nom: "",
                prenom: "",
                email: "",
                motDePasse: "",
                dateNaissance: "",
                telPersonnel: "",
                mobilPersonnel: "",
                telProfessionnel: "",
                mobileProfessionnel: "",
                adresse: {
                    id: 0,
                    version: null,
                },
                domaine: {
                    id: 0,
                    version: null,
                },
                entreprise: {
                    id: 0,
                    version: null,
                },
                roles: [],
                competences: [],
                siManager: false,
                version: null,
            },
            adresses: [],
            domains: [],
            companies: [],
            skills: [],
            roles: [],
            message: "",
            ifError: null,
            loading: false
        };
    }

    componentDidMount() {
        this.getSalarie(this.props.salarieId.id);
    }

    handleChange(e) {
        let regexEmail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        let regexTel = new RegExp("^0[1-9]([-. ]?[0-9]{2}){4}$");
        const target = e.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        if (name === "phonePerso") {
            if (regexTel.test(value)) {
                this.setState((prevState) => ({
                    currentErrors: {
                        ...prevState.currentErrors,
                        phonePerso: null,
                        phonePersoBool: false,
                    },
                    currentSalarie: {
                        ...prevState.currentSalarie,
                        telPersonnel: value,
                    },
                }));
            } else {
                this.setState((prevState) => ({
                    currentErrors: {
                        ...prevState.currentErrors,
                        phonePerso: "Veuillez saisir un bon numéro",
                        phonePersoBool: true,
                    },
                }));
            }
        }

        if (name === "phoneMPerso") {
            if (regexTel.test(value)) {
                this.setState((prevState) => ({
                    currentErrors: {
                        ...prevState.currentErrors,
                        phoneMPerso: null,
                        phoneMPersoBool: false,
                    },
                    currentSalarie: {
                        ...prevState.currentSalarie,
                        mobilPersonnel: value,
                    },
                }));
            } else {
                this.setState((prevState) => ({
                    currentErrors: {
                        ...prevState.currentErrors,
                        phoneMPerso: "Veuillez saisir un bon numéro",
                        phoneMPersoBool: true,
                    },
                }));
            }
        }

        if (name === "phonePro") {
            if (regexTel.test(value)) {
                this.setState((prevState) => ({
                    currentErrors: {
                        ...prevState.currentErrors,
                        phonePro: null,
                        phoneProBool: false,
                    },
                    currentSalarie: {
                        ...prevState.currentSalarie,
                        telProfessionnel: value,
                    },
                }));
            } else {
                this.setState((prevState) => ({
                    currentErrors: {
                        ...prevState.currentErrors,
                        phonePro: "Veuillez saisir un bon numéro",
                        phoneProBool: true,
                    },
                }));
            }
        }

        if (name === "phoneMPro") {
            if (regexTel.test(value)) {
                this.setState((prevState) => ({
                    currentErrors: {
                        ...prevState.currentErrors,
                        phoneMPro: null,
                        phoneMProBool: false,
                    },
                    currentSalarie: {
                        ...prevState.currentSalarie,
                        mobileProfessionnel: value,
                    },
                }));
            } else {
                this.setState((prevState) => ({
                    currentErrors: {
                        ...prevState.currentErrors,
                        phoneMPro: "Veuillez saisir un bon numéro",
                        phoneMProBool: true,
                    },
                }));
            }
        }

        if (name === "email") {
            if (!regexEmail.test(value)) {
                this.setState((prevState) => ({
                    currentErrors: {
                        ...prevState.currentErrors,
                        email: "Please enter valid email address.",
                        emailBool: true,
                    },
                }));
            } else {
                if (value === "" || value === null || value.length === 0) {
                    this.setState((prevState) => ({
                        currentErrors: {
                            ...prevState.currentErrors,
                            email: "Le champ email est requis.",
                            emailBool: true,
                        },
                    }));
                } else {
                    this.setState((prevState) => ({
                        currentErrors: {
                            ...prevState.currentErrors,
                            email: null,
                            emailBool: false,
                        },
                        currentSalarie: {
                            ...prevState.currentSalarie,
                            email: value,
                        },
                    }));
                }
            }
        }
    }

    getSalarie(id) {
        SalariesService.getSalarieById(typeof id === "object" ? id.id : id)
            .then((response) => {
                this.setState({
                    currentSalarie: response.data,
                });
            })
            .catch((e) => {
                console.log(e);
            });
    }

    validationForm() {
        const { currentErrors, currentSalarie } = this.state;
        if (currentSalarie.domaine.id === 0) {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    domain: "Le champ domaine est requis.",
                    domainBool: true,
                },
            }));
        }
        if (Object.entries(currentSalarie.competences).length === 0) {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    skill: "Veuillez séléctionner au moins une compétences",
                    skillBool: true,
                },
            }));
        }
        if (
            currentErrors.lastnameBool &&
            currentErrors.firstnameBool &&
            currentErrors.emailBool &&
            currentErrors.birthdayError &&
            currentErrors.phonePersoBool &&
            currentErrors.phoneMPersoBool &&
            currentErrors.phoneProBool &&
            currentErrors.phoneMProBool &&
            currentErrors.adresseBool &&
            currentErrors.domainBool &&
            currentErrors.companyBool &&
            currentErrors.skillsBool &&
            currentErrors.roleBool
        ) {
            return true;
        } else {
            return true;
        }
    }

    updateSalarie(e) {
        e.preventDefault();
        this.setState({ loading: true })
        const json = JSON.stringify(this.state.currentSalarie)
            .split('"value":')
            .join('"id":');
        const data = JSON.parse(json);
        delete data.postes;
        if (this.validationForm()) {
            SalariesService.updateWithoutPassword(data)
                .then((resp) => {
                    this.setState({
                        message:
                            "Modification bien prise en compte ! Redirection vers le profil du salarie.",
                        ifError: false,
                    });
                    window.setTimeout(() => {
                        this.props.history.push(`/salaries/profil/${resp.data.id}`);
                    }, 2500);
                })
                .catch((e) => {
                    this.setState({
                        message: e,
                        ifError: true,
                        loading: false
                    });
                });
        } else {
            this.setState({
                message: "Une erreur s'est produite ! veuillez ré-essayer.",
                ifError: true,
                loading: false
            });
        }
    }

    render() {
        const { currentSalarie, currentErrors, message, ifError, loading } = this.state;
        return (
            <div className="submit-form">
                <div>
                    <form name="updateEmployee" onSubmit={this.updateSalarie}>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        id="email"
                                        onChange={this.handleChange}
                                        value={
                                            currentSalarie.email === null ? "" : currentSalarie.email
                                        }
                                        required
                                    />
                                    <span className="text-danger">{currentErrors.email}</span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="phonePerso">Tél. perso</label>
                                    <input
                                        type="text"
                                        name="phonePerso"
                                        className="form-control"
                                        id="phonePerso"
                                        value={
                                            currentSalarie.telPersonnel === null
                                                ? ""
                                                : currentSalarie.telPersonnel
                                        }
                                        onChange={this.handleChange}
                                    />
                                    <span className="text-danger">
                                        {currentErrors.phonePerso}
                                    </span>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="phoneMPerso">Tél. Mobile perso</label>
                                    <input
                                        type="text"
                                        name="phoneMPerso"
                                        className="form-control"
                                        id="phoneMPerso"
                                        value={
                                            currentSalarie.mobilPersonnel === null
                                                ? ""
                                                : currentSalarie.mobilPersonnel
                                        }
                                        onChange={this.handleChange}
                                    />
                                    <span className="text-danger">
                                        {currentErrors.phoneMPerso}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="phonePro">Tél. pro</label>
                                    <input
                                        type="text"
                                        name="phonePro"
                                        className="form-control"
                                        id="phonePro"
                                        value={
                                            currentSalarie.telProfessionnel === null
                                                ? ""
                                                : currentSalarie.telProfessionnel
                                        }
                                        onChange={this.handleChange}
                                    />
                                    <span className="text-danger">{currentErrors.phonePro}</span>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="phoneMPro">Tél. Mobile prop</label>
                                    <input
                                        type="text"
                                        name="phoneMPro"
                                        className="form-control"
                                        id="phoneMPro"
                                        value={
                                            currentSalarie.mobileProfessionnel === null
                                                ? ""
                                                : currentSalarie.mobileProfessionnel
                                        }
                                        onChange={this.handleChange}
                                    />
                                    <span className="text-danger">{currentErrors.phoneMPro}</span>
                                </div>
                            </div>
                        </div>
                        <CButton type="submit" block color="info" disabled={loading} >
                            {loading && <CSpinner size="sm" variant="border" />} Sauvegarde les informations
                        </CButton>
                    </form>

                    {ifError != null && (
                        <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>
                    )}
                </div>
            </div>
        );
    }
}


export default withRouter(UpdateSalarie);
