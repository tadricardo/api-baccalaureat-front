import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CForm, CFormGroup, CRow, CTextarea } from '@coreui/react';
import { faEdit, faFileAlt, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { Component } from 'react'
import { withRouter } from 'react-router';
import activityDomainService from 'src/services/activityDomain.service';
import fr from 'date-fns/locale/fr';
import momentFR from 'moment/locale/fr';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import annualActivityService from 'src/services/annualActivity.service';
import { connect } from 'react-redux';
import swal from 'sweetalert';
class AddComment extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.editActivity = this.editActivity.bind(this);
        this.cancelActivity = this.cancelActivity.bind(this);
        this.getDomain = this.getDomain.bind(this);
        this.edit = this.edit.bind(this);
        this.state = {
            currentErrors: {
                domain: "",
                domainBool: true,
                title: "",
                titleBool: true,
                scheduledDate: "",
                scheduledDateBool: false,
                time: "",
                timeBool: true,
                report: "",
                reportBool: true
            },
            currentPlan: {
                id: 0,
                lstActivity: [],
                salarie: {},
                year: 0
            },
            currentActivity: {
                title: "",
                domain: {
                    id: 0,
                    titre: ""
                },
                scheduledDate: new Date(),
                commentaryManager: undefined,
                version: 0
            },
            startDate: new Date(),
            lstDomain: [],
            idUser: this.props.idUser
        }
        moment.updateLocale('fr', momentFR);
    }

    componentDidMount() {
        if (this.props.location.state === undefined) {
            this.props.history.goBack();
        } else {
            this.setState({ currentPlan: this.props.location.state })
            if (this.props.location.state.salarie.manager.id !== this.state.idUser) {
                this.props.history.goBack();
            }
        }
        this.getDomain();
    }

    getDomain() {
        activityDomainService.getAll().then(response => { this.setState({ lstDomain: response.data }) })
            .catch(e => console.log(e))
    }

    toggle(e) {
        let stateCardBody = document.getElementById(`domain${e.target.name}`);
        if (stateCardBody.hidden === false) {
            e.target.className = "btn btn-success";
            e.target.innerText = "+";
            stateCardBody.hidden = true
        }
        else {
            e.target.className = "btn btn-danger";
            e.target.innerText = "-";
            stateCardBody.hidden = false
        }
    }
    //footerdomain
    edit(activity) {
        let stateCardBody = document.getElementById(`footerdomain${activity.domain.id}`);
        if (stateCardBody.hidden === false) {
            stateCardBody.hidden = true
        }
        else {
            stateCardBody.hidden = false
        }
        this.setState({ currentActivity: activity })
    }

    onChangeDate(e) {
        if (e !== null) {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    scheduledDate: "",
                    scheduledDateBool: false,
                },
                currentActivity: {
                    ...prevState.currentActivity,
                    scheduledDate: new Date(e)
                },
            }));
        } else {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    scheduledDate: "La date est requis.",
                    scheduledDateBool: true,
                },
                currentActivity: {
                    ...prevState.currentActivity,
                    scheduledDate: new Date(e)
                },
            }));
        }
    }

    handleChange(e) {
        const target = e.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        if (name === "report") {
            if (value === "" || value === null || value.length === 0) {
                this.setState((prevState) => ({
                    currentErrors: {
                        ...prevState.currentErrors,
                        report: "L'observation est requis.",
                        reportBool: true,
                    },
                    currentActivity: {
                        ...prevState.currentActivity,
                        commentaryManager: value
                    },
                }));
            } else {
                this.setState((prevState) => ({
                    currentErrors: {
                        ...prevState.currentErrors,
                        report: "",
                        reportBool: false
                    },
                    currentActivity: {
                        ...prevState.currentActivity,
                        commentaryManager: value
                    },
                }));
            }
        }
    }

    editActivity(e) {
        e.preventDefault();
        const { currentActivity, currentPlan } = this.state;
        //Récuperer la liste des activites
        let listActivity = currentPlan.lstActivity;
        // Supprimer l'anciennement activite
        listActivity = listActivity.filter(activity => activity.id !== currentActivity.id);
        // Push la nouvelle activite
        listActivity.push(currentActivity);
        //Refait le plan
        const plan = {
            id: currentPlan.id,
            lstActivity: listActivity,
            salarie: currentPlan.salarie,
            year: currentPlan.year
        }
        this.setState({ currentPlan: plan })
        let stateCardBody = document.getElementById(`footerdomain${currentActivity.domain.id}`);
        if (stateCardBody.hidden === false) {
            stateCardBody.hidden = true
        }
        else {
            stateCardBody.hidden = false
        }
        annualActivityService.update(currentActivity).then(swal("Modification bien prise en compte !", {icon: "success"})).catch(e => console.log(e));
    }

    cancelActivity(e) {
        e.preventDefault();
        const { currentActivity } = this.state;
        let stateCardBody = document.getElementById(`footerdomain${currentActivity.domain.id}`);
        if (stateCardBody.hidden === false) {
            stateCardBody.hidden = true
        }
        else {
            stateCardBody.hidden = false
        }
    }

    render() {
        const { currentPlan, lstDomain, currentActivity, currentErrors, startDate } = this.state;
        const dateNow = new Date();
        const isWeekday = (date) => {
            const day = new Date(date).getDay();
            return day !== 0 && day !== 6;
        };
        return (
            <>
                <h3>Plan d'activité annuel {currentPlan.year} de {currentPlan.salarie.nom} {currentPlan.salarie.prenom}</h3>
                <CRow className="mt-4">
                    <CCol lg={12}>
                        <CCard>
                            <CCardHeader>
                                <h4><FontAwesomeIcon icon={faFolderOpen} /> Liste des activités</h4>
                            </CCardHeader>
                            <CCardBody>
                                {lstDomain.map((domain, key) =>
                                    <CRow key={key} >
                                        <CCol lg={12}>
                                            <CCard>
                                                <CCardHeader className="d-flex justify-content-between">
                                                    <h4><FontAwesomeIcon icon={faFileAlt} /> {domain.titre} ({currentPlan.lstActivity.filter((activity, key) => activity.domain.id === domain.id).length}) </h4>
                                                    <CButton className="btn btn-success" name={domain.id} onClick={this.toggle}> + </CButton>
                                                </CCardHeader>
                                                <CCardBody id={`domain${domain.id}`} hidden={true}>
                                                    <div className="col-lg-12 table-responsive">
                                                        <table className="table table-hover table-striped ">
                                                            <thead>
                                                                <tr>
                                                                    <th>Titre</th>
                                                                    <th>Durée en jours</th>
                                                                    <th>Date désire</th>
                                                                    <th>Date programmé</th>
                                                                    <th>Observations collaborateur</th>
                                                                    <th>Observations manager</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {currentPlan.lstActivity.filter((activity) => activity.domain.id === domain.id).map((activity, key) => {
                                                                    return (
                                                                        <tr key={key}>
                                                                            <td>{activity.title}</td>
                                                                            <td>{activity.duration}</td>
                                                                            <td>{moment(activity.desiredDate).format("LL")}</td>
                                                                            <td>{activity.scheduledDate && moment(activity.scheduledDate).format("LL")}</td>
                                                                            <td>{activity.commentaryEmployee}</td>
                                                                            <td>{activity.commentaryManager}</td>
                                                                            <td><CButton className="mr-2" color="info" title="Vous voulez modifier cette ligne ?" onClick={() => this.edit(activity)}><FontAwesomeIcon icon={faEdit} /></CButton></td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </CCardBody>
                                                <CCardFooter id={`footerdomain${domain.id}`} hidden={true}>
                                                    <CForm >
                                                        <CRow>
                                                            <CCol lg={12}>
                                                                <CFormGroup>
                                                                    <label htmlFor="date" className={currentErrors.scheduledDate ? "font-weight-bold text-danger" : "text-center font-weight-bold"}>Date programmé</label>
                                                                    <CRow>
                                                                        <CCol lg={12}>
                                                                            <DatePicker
                                                                                filterDate={isWeekday}
                                                                                className="form-control"
                                                                                name="date"
                                                                                dateFormat="dd/MM/yyyy"
                                                                                selected={currentActivity.scheduledDate && new Date(currentActivity.scheduledDate)}
                                                                                selectsStart
                                                                                startDate={startDate}
                                                                                onChange={this.onChangeDate}
                                                                                showYearDropdown
                                                                                dateFormatCalendar="MMMM"
                                                                                yearDropdownItemNumber={5}
                                                                                scrollableYearDropdown
                                                                                todayButton="Aujourd'hui"
                                                                                placeholderText="Sélectionner une date"
                                                                                locale={fr}
                                                                                min={moment(dateNow.setDate(dateNow.getDate() + 1)).format(
                                                                                    "YYYY-MM-DD"
                                                                                )}
                                                                            />
                                                                            <span className="text-danger">{currentErrors.scheduledDate}</span>
                                                                        </CCol>
                                                                    </CRow>
                                                                </CFormGroup>
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CCol lg={12}>
                                                                <CFormGroup>
                                                                    <label htmlFor="report" className={currentErrors.report ? "font-weight-bold text-danger" : "text-center font-weight-bold"}>Observations</label>
                                                                    <CTextarea
                                                                        type="text"
                                                                        id="report"
                                                                        name="report"
                                                                        value={currentActivity.commentaryManager ? currentActivity.commentaryManager : ""}
                                                                        onChange={this.handleChange}
                                                                        placeholder="Votre observations.." />
                                                                    <span className="text-danger">{currentErrors.report}</span>
                                                                </CFormGroup>
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CCol lg={6}>
                                                                <CButton type="submit" block color="info" onClick={this.editActivity}>
                                                                    Modifier cette activité
                                                                </CButton>
                                                            </CCol>
                                                            <CCol lg={6}>
                                                                <CButton type="submit" block color="danger" onClick={this.cancelActivity}>
                                                                    Annuler
                                                                </CButton>
                                                            </CCol>

                                                        </CRow>
                                                    </CForm>
                                                </CCardFooter>
                                            </CCard>
                                        </CCol>
                                    </CRow>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </>
        )
    }
}
function mapStateToProps(state) {
    const { isRole, idUser } = state.authen;
    return {
        isRole,
        idUser
    };
}

export default withRouter(connect(mapStateToProps)(AddComment));
