import { CAlert, CButton, CSpinner, CTooltip } from "@coreui/react";
import fr from 'date-fns/locale/fr';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import { Component } from "react";
import DatePicker from 'react-datepicker';
import { withRouter } from "react-router-dom";
import { checkNumberAndDecimalIs0Or5, dateFerieOuVisisteMedicale, periodeCongeSalarie, substracHolydayInDuree, substracWEInDuree } from "src/utils/fonctions";
import salariesService from "../../../services/salaries.service";
import "./style.css";

// TODO : Interdire la création d'un congé dans un congé
class CreateConges extends Component {
    constructor(props) {
        super(props);
        this.saveConge = this.saveConge.bind(this);
        this.state = {
            currentErrors: {
                dateDebut: null, dateDebutBool: false,
                dateFin: null, dateFinBool: true,
                duree: null, dureeBool: true,
                typeConge: null, typeCongeBool: false,
                congeExistant: null, congeExistantBool: true,
                visiteMidicaleExistant: null, visiteMidicaleExistantBool: true,
                fichierNull: null, fichierNullBool: true,
            },
            currentUser: {
                id: null,
                roles: null,
                email: null,
                isComptable: false,
            },//jwt_decode(JSON.parse(localStorage.getItem('token'))),
            salarieId: null,//parseInt(this.props.salarieId.id),
            currentSalarie: {
                id: null,
                nom: null,
                prenom: null,
                email: null,
                conges: [{
                    id: 0,
                    dateDebut: null,
                    dateFin: null,
                    typeConge: null,
                }],
                visitesMedicales: [],
            },
            currentConge: {
                id: 0,
                salarie: {
                    id: 0
                },
                typeConge: "CONGE_PAYE",
                duree: 0.0,
                dateDebut: new Date(),
                dateFin: null,
                commenceApresMidi: false,
                finiApresMidi: false,
                commentaire: null,
                lienJustificatif: null,
                version: 0,
            },
            file: null,
            fileInputText: "Formats acceptés : png, jpeg et pdf",
            notWorkingDay: (date) => {
                const day = new Date(date).getDay();
                return day !== 0 && day !== 6;
            },
            message: null,
            ifError: null,
            loading: false,
        }
    }
    componentDidMount() {
        const currentUser = jwt_decode(JSON.parse(localStorage.getItem('token')));
        const salarieId = parseInt(this.props.salarieId.id);
        /*si seul le salarié peut poser ses congés
        if (currentUser.id !== salarieId)
            this.props.history.push("/salaries/profil/" + this.currentUser.id)*/

        this.setState((prevState) => ({
            currentUser: currentUser,
            salarieId: salarieId,
            currentConge: {
                ...prevState.currentConge,
                salarie: {
                    id: salarieId
                }
            },
        }));
        this.getSalarie(salarieId);
    }

    getSalarie(salarieId) {
        salariesService.getSalarieById(salarieId)
            .then((response) => {
                this.setState({
                    currentSalarie: response.data,
                });
            })
            .catch((e) => {
                console.log("getSalarie : ", e);
            });
    }

    onChangeTypeConge(e) {
        if (e.target.length === 0) {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    typeConge: "Veuillez sélectionner un type de congé.",
                    typeCongeBool: true
                },
                currentConge: {
                    ...prevState.currentConge,
                    typeConge: e.target.value,
                },
            }));
        } else {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    typeConge: null,
                    typeCongeBool: false
                },
                currentConge: {
                    ...prevState.currentConge,
                    typeConge: e.target.value,
                },
            }));
        }
    }

    onchangeDateDebut(e) {
        if (e.length === 0) {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    dateDebut: "Veuillez saisir une date de début.",
                    dateDebutBool: true
                },
                currentConge: {
                    ...prevState.currentConge,
                    dateDebut: e,
                },
            }));
        } else {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    dateDebut: null,
                    dateDebutBool: false
                },
                currentConge: {
                    ...prevState.currentConge,
                    dateDebut: e,
                },
            }), () => { this.calculDuree(); this.isCongeExist(); this.isVisiteMedicaleExist(); });
        }
    }

    onchangeDateFin(e) {
        if (e.length === 0) {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    dateFin: "Veuillez saisir une date de fin.",
                    dateFinBool: true
                },
                currentConge: {
                    ...prevState.currentConge,
                    dateFin: e,
                },
            }));
        } else {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    dateFin: null,
                    dateFinBool: false
                },
                currentConge: {
                    ...prevState.currentConge,
                    dateFin: e,
                },
            }), () => { this.calculDuree(); this.isCongeExist(); this.isVisiteMedicaleExist(); });
        }
    }

    onchangeDuree(e) {
        if (e.target.length === 0) {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    duree: "Veuillez sélectionner une durée valide.",
                    dureeBool: true
                },
                currentConge: {
                    ...prevState.currentConge,
                    duree: e.target.value,
                },
            }));
        } else {
            if (checkNumberAndDecimalIs0Or5(e.target.value)) {
                if (e.target.value > 0) {
                    this.setState((prevState) => ({
                        currentErrors: {
                            ...prevState.currentErrors,
                            duree: null,
                            dureeBool: false
                        },
                        currentConge: {
                            ...prevState.currentConge,
                            duree: e.target.value,
                        },
                    }));
                } else {
                    this.setState((prevState) => ({
                        currentErrors: {
                            ...prevState.currentErrors,
                            duree: "La durée doit être superieur à 0.",
                            dureeBool: true
                        },
                        currentConge: {
                            ...prevState.currentConge,
                            duree: e.target.value,
                        },
                    }));
                }
            } else {
                this.setState((prevState) => ({
                    currentErrors: {
                        ...prevState.currentErrors,
                        duree: "La durée doit être un chiffre entier ou avec une décimal de 0 ou 5.",
                        dureeBool: true
                    },
                    currentConge: {
                        ...prevState.currentConge,
                        duree: e.target.value,
                    },
                }));
            }
        }
    }

    onChangeCommenceAP(e) {
        this.setState((prevState) => ({
            currentConge: {
                ...prevState.currentConge,
                commenceApresMidi: e.target.checked,
            },
        }), () => { this.calculDuree(); this.isVisiteMedicaleExist(); });
    }

    onChangeFiniAP(e) {
        this.setState((prevState) => ({
            currentConge: {
                ...prevState.currentConge,
                finiApresMidi: e.target.checked,
            },
        }), () => { this.calculDuree(); this.isVisiteMedicaleExist(); });
    }

    calculDuree() {
        const currentConge = this.state.currentConge;
        if (currentConge.dateDebut !== null && currentConge.dateFin !== null) {
            const startDate = moment(currentConge.dateDebut);
            const timeEnd = moment(currentConge.dateFin);
            const diff = timeEnd.diff(startDate);
            const diffDuration = moment.duration(diff);
            let duree = diffDuration.days() + 2;

            if (currentConge.dateDebut.getDate() === currentConge.dateFin.getDate()
                && currentConge.dateDebut.getMonth() === currentConge.dateFin.getMonth()
                && currentConge.dateDebut.getFullYear() === currentConge.dateFin.getFullYear())
                duree = 1;

            if (currentConge.commenceApresMidi)
                duree = duree - 0.5;
            if (!currentConge.finiApresMidi)
                duree = duree - 0.5;
            duree = substracHolydayInDuree(currentConge.dateDebut, currentConge.dateFin, duree);
            duree = substracWEInDuree(currentConge.dateDebut, currentConge.dateFin, duree);
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    duree: null,
                    dureeBool: false
                },
                currentConge: {
                    ...prevState.currentConge,
                    duree: duree,
                },
            }));
        }
    }

    isCongeExist() {
        const { currentConge, currentSalarie } = this.state;
        let isError = 0;

        if (currentSalarie.conges.length > 0) {
            let dateDeb = new Date();
            let dateFin = new Date();
            currentSalarie.conges.forEach(conge => {
                dateDeb = new Date(conge.dateDebut);
                dateFin = new Date(conge.dateFin);
                if ((dateDeb.getTime() <= new Date(currentConge.dateFin).getTime() && dateDeb.getTime() >= new Date(currentConge.dateDebut).getTime())
                    && (dateFin.getTime() <= new Date(currentConge.dateFin).getTime() && dateFin.getTime() >= new Date(currentConge.dateDebut).getTime())) {
                    this.setState((prevState) => ({
                        currentErrors: {
                            ...prevState.currentErrors,
                            congeExistant: "Vous avez déjà des congés durant cette période.",
                            congeExistantBool: true
                        },
                    }));
                    isError++;
                }
            });
        }
        if (isError === 0) {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    congeExistant: null,
                    congeExistantBool: false
                },
            }));
        }
    }

    isVisiteMedicaleExist() {
        const { currentConge, currentSalarie } = this.state;
        let isError = 0;

        if (currentSalarie.conges.length > 0) {
            let dateVM = new Date();
            currentSalarie.visitesMedicales.forEach(vm => {
                dateVM = new Date(vm.dateVisite);
                //console.log("dateVM heure : ", dateVM.getHours() - 1)
                //if(!(dateVM.getHours()-1 >= 0 && dateVM.getHours()-1 <=12 && currentConge.commenceApresMidi && dateVM.getTime() === new Date(currentConge.dateDebut).getTime()))
                //if(!(dateVM.getHours()-1 >= 13 && dateVM.getHours()-1 <=23 && !currentConge.finiApresMidi && dateVM.getTime() === new Date(currentConge.dateFin).getTime()))
                if ((dateVM.getTime() <= new Date(currentConge.dateFin).getTime() && dateVM.getTime() >= new Date(currentConge.dateDebut).getTime())) {
                    this.setState((prevState) => ({
                        currentErrors: {
                            ...prevState.currentErrors,
                            visiteMidicaleExistant: "Vous avez une visite médicale durant cette période.",
                            visiteMidicaleExistantBool: true
                        },
                    }));
                    isError++;
                }
            });
        }
        if (isError === 0) {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    visiteMidicaleExistant: null,
                    visiteMidicaleExistantBool: false
                },
            }));
        }
    }

    onChangeCommentaire(e) {
        this.setState((prevState) => ({
            currentConge: {
                ...prevState.currentConge,
                commentaire: e.target.value,
            },
        }));
    }

    loadFile = (event) => {
        const file = event.target.files[0];
        if (file.type.match("image/png") || file.type.match("image/jpeg") || file.type.match("application/pdf")) {
            this.setState((prevState) => ({
                ...prevState,
                file: file,
                fileInputText: file.name,
                errors: {
                    ...prevState.errors,
                    fichierNull: null,
                    fichierNullBool: false,
                }
            }));
        } else {
            this.setState((prevState) => ({
                errors: {
                    ...prevState.errors,
                    fichierNull: "Le fichier doit être un PDF, JPEG ou PNG.",
                    fichierNullBool: true,
                }
            }));
        }
    }

    verifForm() {
        const currentErrors = this.state.currentErrors;
        if (currentErrors.congeExistantBool
            && currentErrors.visiteMidicaleExistantBool
            && currentErrors.dateDebutBool
            && currentErrors.dateFinBool
            && currentErrors.dureeBool
            && currentErrors.typeCongeBool
            && currentErrors.fichierNullBool) {
            //erreur dans le formulaire
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    congeExistant: currentErrors.congeExistantBool ? "Vous avez une visite médicale durant cette période." : null,
                    visiteMidicaleExistant: currentErrors.visiteMidicaleExistantBool ? "Vous avez déjà des congés durant cette période." : null,
                    dateDebut: currentErrors.dateDebutBool ? "Veuillez saisir une date de début." : null,
                    dateFin: currentErrors.dateFinBool ? "Veuillez saisir une date de fin." : null,
                    duree: currentErrors.dureeBool ? "La durée doit être superieur à 0 et être un chiffre entier ou avec une décimal de 0 ou 5." : null,
                    typeConge: currentErrors.typeCongeBool ? "Veuillez sélectionner un type de congé." : null,
                    fichierNull: currentErrors.fichierNullBool ? "Le fichier doit être un PDF, JPEG ou PNG." : null,
                },
                ifError: "danger",
                message: "Erreur dans le formulaire.",
                loading: false,
            }));
            return false;
        } else {
            //Formulaire OK
            return true;
        }
    }

    saveConge() {
        if (this.verifForm()) {
            this.setState({
                ifError: null,
                message: null,
                loading: true,
            });

            if (this.state.file !== null) {
                const formData = new FormData();
                formData.append("justificatif", this.state.file);
                formData.append('conge', new Blob([JSON.stringify(this.state.currentConge)], { type: "application/json" }));
                salariesService.saveConge(formData).then(() => {
                    this.setState({
                        loading: false,
                        message: "Congé enregistré, redirection vers votre profil.",
                        ifError: "success",
                    });
                    //window.setTimeout(() => { this.props.history.push(`/salaries/profil/${this.state.currentSalarie.id}`) }, 1500)
                    window.setTimeout(() => { this.props.history.push(`/salaries/vie-professionnelle/${this.state.salarieId}`) }, 1500)
                }).catch((e) => {
                    this.setState({
                        loading: false,
                        message: "Erreur " + e.message,
                        ifError: "danger",
                    });
                    console.log(e)
                });
            } else {
                salariesService.saveCongeWithoutFile(this.state.currentConge).then(() => {
                    this.setState({
                        loading: false,
                        message: "Congé enregistré, redirection vers votre profil.",
                        ifError: "success",
                    });
                    //window.setTimeout(() => { this.props.history.push(`/salaries/profil/${this.state.currentSalarie.id}`) }, 1500)
                    window.setTimeout(() => { this.props.history.push(`/salaries/vie-professionnelle/${this.state.salarieId}`) }, 1500)
                }).catch((e) => {
                    this.setState({
                        loading: false,
                        message: "Erreur " + e.message,
                        ifError: "danger",
                    });
                    console.log(e)
                });
            }
        }
    }

    render() {
        const { currentConge, currentErrors, notWorkingDay, currentSalarie, message, ifError, loading, fileInputText, salarieId } = this.state;
        const dateNow = new Date();
        //console.log("currentUser : ", this.state.currentUser)
        //console.log("salarieId : ", this.state.salarieId);
        //console.log("currentConge : ", currentConge)
        //console.log("currentErrors : ", currentErrors);
        //console.log("currentSalarie : ", currentSalarie);
        // https://reactdatepicker.com/
        return (
            <>
                <form onSubmit={this.saveConge}>
                    <div className="form-group">
                        <label htmlFor="typeConge">Type de congé *</label>
                        <select className="form-control" id="typeConge" required onChange={(e) => this.onChangeTypeConge(e)}
                            value={currentConge.typeConge === null ? "" : currentConge.typeConge}>
                            <option value="CONGE_PAYE">Congé payé</option>
                            <option value="CONGE_PAYE_MONETISE">Congé payé monétisé</option>
                            <option value="CONGE_EVENEMENT_FAMILIAL">Congé évènement familial</option>
                            <option value="CONGE_MATERNITE">Congé maternité</option>
                            <option value="CONGE_PATERNITE">Congé parternité</option>
                            <option value="CONGE_PARENTAL">Congé parental</option>
                            <option value="CONGE_DE_FORMATION_PROFESSIONNELLE">Congé de formation professionnelle</option>
                            <option value="CONGE_POUR_PREPARATION_EXAMEN">Congé pour préparation d'un éxamen</option>
                            <option value="ABSENCE_NON_REMUNEREE">Absence non rémunérée</option>
                            <option value="ARRET_MALADIE">Arrêt maladie</option>
                            <option value="ACCIDENT_DU_TRAVAIL">Accident du travail</option>
                            <option value="RTT_CHOISI">RTT choisi</option>
                            <option value="RTT_IMPOSE">RTT imposé</option>
                            <option value="RTT_MONETISE">RTT monétisé</option>
                            <option value="REPOS_CADRE">Repos cadre</option>
                            <option value="REGULARISATION_RTT">Régularisation RTT</option>
                            <option value="CONGE_RECUPERATION">Congé récupération</option>
                            <option value="CONGE_DE_SOLIDARITE">Congé de salidarité</option>
                            <option value="CONGE_SANS_SOLDE">Congé sans solde</option>
                            <option value="CONGE_SABBATIQUE">Congé sabbatique</option>
                            <option value="COMPTE_EPARGNE_TEMPS">Compte épargne temps</option>
                        </select>
                        <span className="text-danger">{currentErrors.typeConge}</span>
                    </div>
                    <div className="form-row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="dateDebut">Date de début *</label>
                            <DatePicker
                                filterDate={notWorkingDay}
                                showWeekNumbers
                                className="form-control picker"
                                excludeDates={dateFerieOuVisisteMedicale(currentConge.dateDebut, currentSalarie.visitesMedicales)}
                                excludeDateIntervals={periodeCongeSalarie(currentSalarie.conges)}
                                dateFormat="dd/MM/yyyy"
                                selected={currentConge.dateDebut}
                                minDate={dateNow - 2}
                                initialValue={dateNow}
                                onChange={(e) => this.onchangeDateDebut(e)}
                                selectsStart
                                startDate={currentConge.dateDebut}
                                showYearDropdown
                                dateFormatCalendar="MMMM"
                                yearDropdownItemNumber={5}
                                scrollableYearDropdown
                                todayButton="Aujourd'hui"
                                placeholderText="Sélectionner une date de début"
                                locale={fr}
                                min={moment(dateNow.setDate(dateNow.getDate() + 1)).format(
                                    "YYYY-MM-DD"
                                )}
                            />
                            <span className="text-danger">{currentErrors.dateDebut}</span>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="dateFin">Date de fin *</label>
                            <DatePicker
                                filterDate={notWorkingDay}
                                showWeekNumbers
                                className="form-control"
                                excludeDates={dateFerieOuVisisteMedicale(currentConge.dateDebut, currentSalarie.visitesMedicales)}
                                excludeDateIntervals={periodeCongeSalarie(currentSalarie.conges)}
                                dateFormat="dd/MM/yyyy"
                                selected={currentConge.dateFin}
                                onChange={(e) => this.onchangeDateFin(e)}
                                startDate={currentConge.dateDebut}
                                minDate={currentConge.dateDebut}
                                showYearDropdown
                                dateFormatCalendar="MMMM"
                                yearDropdownItemNumber={5}
                                scrollableYearDropdown
                                todayButton="Aujourd'hui"
                                placeholderText="Sélectionner une date de fin"
                                locale={fr}
                                min={moment(dateNow.setDate(dateNow.getDate() + 1)).format(
                                    "YYYY-MM-DD"
                                )}
                            />
                            <span className="text-danger">{currentErrors.dateFin}</span>
                        </div>
                        <span className="text-danger mb-3 ml-1">{currentErrors.congeExistant}</span>
                        <span className="text-danger mb-3 ml-1">{currentErrors.visiteMidicaleExistant}</span>
                    </div>
                    <div className="form-row ml-1">
                        <div className="form-check col-md-6 mb-3">
                            <input className="form-check-input" type="checkbox" id="commenceAP" onChange={(e) => this.onChangeCommenceAP(e)} checked={currentConge.commenceApresMidi} />
                            <label className="form-check-label" htmlFor="commenceAP">
                                Commence l'après-midi
                            </label>
                        </div>
                        <div className="form-check col-md-6 mb-3">
                            <input className="form-check-input" type="checkbox" id="finitAP" onChange={(e) => this.onChangeFiniAP(e)} checked={currentConge.finiApresMidi} />
                            <label className="form-check-label" htmlFor="finitAP">
                                Finit l'après-midi
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="duree">Durée <CTooltip content="Le calcule de la durée est automatique, elle ne compte pas les Week-End et jours fériés."><span>*</span></CTooltip></label>
                        <input type="number" id="duree" className="form-control" placeholder="Durée du congé (Précalculé avec les dates)" required min="0" step="0.5" onChange={(e) => this.onchangeDuree(e)} value={currentConge.duree} />
                        <span className="text-danger">{currentErrors.duree}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="commentaire">Commentaire</label>
                        <textarea className="form-control" id="commentaire" rows="3" onChange={(e) => this.onChangeCommentaire(e)}>{currentConge.commentaire}</textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="customFile">Justificatif</label>
                        <div className="custom-file">
                            <input type="file" className="custom-file-input" id="customFile" onChange={(e) => this.loadFile(e)} />
                            <label className="custom-file-label" htmlFor="customFile">{fileInputText}</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <CButton type="submit" className="mt-3" block color="info" disabled={loading}>
                                {loading && <CSpinner size="sm" variant="border" />} Ajouter le congé
                            </CButton>

                        </div>
                        <div className="col">

                            <CButton className="mt-3" to={`/salaries/vie-professionnelle/${salarieId}`} block color="danger" title="Vous voulez annuler ?">
                                Annuler
                            </CButton>
                        </div>
                    </div>
                    {ifError !== null && <CAlert className="mt-3" color={ifError === "danger" ? "danger" : "success"}>{message}</CAlert>}
                </form>
            </>
        );
    }
}

export default withRouter(CreateConges);