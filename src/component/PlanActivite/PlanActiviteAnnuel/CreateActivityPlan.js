import { CAlert, CButton, CCol, CForm, CFormGroup, CInput, CRow, CSelect, CTextarea } from '@coreui/react';
import React, { Component } from 'react'
import { withRouter } from 'react-router';
import ActivityDomainService from '../../../services/activityDomain.service'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import fr from 'date-fns/locale/fr';
import annualActivityService from 'src/services/annualActivity.service';
import swal from 'sweetalert';
import moment from 'moment';
import momentFR from 'moment/locale/fr';
import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';
import planActivityService from 'src/services/planActivity.service';
class CreateActivityPlan extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.getDomainActivity = this.getDomainActivity.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.createPlan = this.createPlan.bind(this);
    this.state = {
      existForYear: true,
      currentUser: jwt_decode(this.props.user),
      currentErrors: {
        domain: "",
        domainBool: true,
        title: "",
        titleBool: true,
        desiredDate: "",
        desiredDateBool: false,
        time: "",
        timeBool: true,
        report: "",
        reportBool: true
      },
      message: "",
      ifError: null,
      loading: false,
      activityDomain: [],
      listActivity: [],
      currentActivity: {
        title: "",
        domain: {
          id: 0
        },
        desiredDate: new Date(),
        duration: 0,
        commentaryEmployee: ""

      },
      dateDesiredtest: [],
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    };
    moment.updateLocale('fr', momentFR);
  }

  componentDidMount() {
    this.checkExist(this.state.currentUser.id)
    this.getDomainActivity();
  }

  /**
   * Vérifier si un plan annuel de cette année existe déjà
   * @param {id du salarie} id 
   */
  checkExist(id) {
    const currentYear = new Date().getFullYear();
    planActivityService.getByYearAndIdSalarie(currentYear, id).then(resp => {
      const data = resp.data;
      if (data === "") {
        this.setState({ existForYear: false })
      } else {
        this.setState({ existForYear: true })
      }
    }).catch(e => console.log(e))
  }
  getDomainActivity() {
    ActivityDomainService.getAll()
      .then((response) => {
        this.setState({
          activityDomain: response.data,
          loading: false
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }


  onChangeDate(e) {
    if (e !== null) {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          desiredDate: "",
          desiredDateBool: false,
        },
        currentActivity: {
          ...prevState.currentActivity,
          desiredDate: new Date(e)
        },
      }));
    } else {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          desiredDate: "La date est requis.",
          desiredDateBool: true,
        },
        currentActivity: {
          ...prevState.currentActivity,
          desiredDate: new Date(e)
        },
      }));
    }
  }

  validationForm() {
    const { currentErrors } = this.state;
    if (!currentErrors.domainBool &&
      !currentErrors.titleBool && !currentErrors.desiredDateBool && !currentErrors.timeBool && !currentErrors.reportBool) {
      return true;
    } else {
      return false;
    }
  }


  addActivity = (e) => {
    e.preventDefault();
    if (!this.validationForm()) {
      this.setState({
        message: "Une erreur est présente dans votre formulaire.",
        ifError: true
      });
    } else {
      let { listActivity, currentActivity } = this.state;
      let obj = {
        title: currentActivity.title,
        domain: {
          id: currentActivity.domain.id
        },
        desiredDate: currentActivity.desiredDate,
        duration: currentActivity.duration,
        commentaryEmployee: currentActivity.commentaryEmployee,
        version: 0
      };
      listActivity.push(obj);
      this.setState({
        message: "",
        ifError: null,
        listActivity: listActivity,
        currentActivity: {
          title: "",
          domain: {
            id: 0
          },
          desiredDate: new Date(),
          duration: 0,
          commentaryEmployee: ""

        },
      });
    }
  };

  delete = (object) => {
    swal({
      text: "Êtes-vous sûr de vouloir enlever cette activité ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let { listActivity } = this.state;
        let i = listActivity.findIndex((activity) => activity.id === object.id);
        listActivity.splice(i, 1);
        this.setState({
          listActivity: listActivity
        });
      }
    });

  };

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "domain") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            domain: "La catégorie est requis.",
            domainBool: true,
          },
          currentActivity: {
            ...prevState.currentActivity,
            domain: {
              id: value
            }
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            domain: "",
            domainBool: false
          },
          currentActivity: {
            ...prevState.currentActivity,
            domain: {
              id: value
            }
          },
        }));
      }
    }
    if (name === "title") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            title: "Le domaine est requis.",
            titleBool: true,
          },
          currentActivity: {
            ...prevState.currentActivity,
            title: value
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            title: "",
            titleBool: false
          },
          currentActivity: {
            ...prevState.currentActivity,
            title: value
          },
        }));
      }
    }
    if (name === "time") {
      if (parseInt(value) === 0 || parseInt(value) <= 0 || value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            time: "La durée est requis.",
            timeBool: true,
          },
          currentActivity: {
            ...prevState.currentActivity,
            duration: value
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            time: "",
            timeBool: false
          },
          currentActivity: {
            ...prevState.currentActivity,
            duration: value
          },
        }));
      }
    }
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
            commentaryEmployee: value
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
            commentaryEmployee: value
          },
        }));
      }
    }
  }

  createPlan() {
    swal({
      text: "Êtes-vous sûr de vouloir créer ce plan annuel ?",
      icon: "success",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        annualActivityService.save(this.state.listActivity, this.state.currentUser.id).then(response => {
          const data = response.data;
          window.setTimeout(() => { this.props.history.push(`/plan-annuel/voir/${data[0].paa.id}`) }, 2500);
        }).catch(e => { console.log(e) })
      }
    });


  }

  render() {
    const { currentErrors, activityDomain, currentActivity, loading, startDate, listActivity, ifError, message, existForYear } = this.state;
    const isWeekday = (date) => {
      const day = new Date(date).getDay();
      return day !== 0 && day !== 6;
    };
    const currentYear = new Date().getFullYear();
    if (existForYear) {
      return (
        <>
          <p>Vous avez déjà un plan annuel d'activité pour cette année {currentYear}. </p>
          <CButton onClick={() => this.props.history.goBack()} className="mt-1" block color="info" title="Revenir en arrière">Revenir en arrière</CButton>
        </>
      )
    } else {
      return (
        <>
          <CForm onSubmit={this.addActivity}>
            <h2>Activité</h2>
            <hr />
            <CRow>
              <CCol lg={6}>
                <CFormGroup>
                  <label htmlFor="domain" className={currentErrors.domain ? "font-weight-bold text-danger" : "text-center font-weight-bold"}>Catégorie *</label>
                  <CSelect
                    custom
                    className={currentErrors.domain ? "form-control is-invalid" : "form-control"}
                    name="domain"
                    id="domain"
                    onChange={this.handleChange}
                    required
                    value={currentActivity.domain.id}
                  >
                    <option value="0">Veuillez sélectionner une catégorie</option>
                    {activityDomain.map((domain, key) => (
                      <option key={key} value={domain.id}>
                        {domain.titre}
                      </option>
                    ))}
                  </CSelect>
                  <span className="text-danger">{currentErrors.domain}</span>
                </CFormGroup>
              </CCol>
              <CCol lg={6}>
                <CFormGroup>
                  <label htmlFor="title" className={currentErrors.title ? "font-weight-bold text-danger" : "text-center font-weight-bold"}>Domaine *</label>
                  <CInput
                    type="text"
                    id="title"
                    name="title"
                    onChange={this.handleChange}
                    value={currentActivity.title}
                    placeholder="Saisir votre domaine" />
                  <span className="text-danger">{currentErrors.title}</span>
                </CFormGroup>
              </CCol>
            </CRow>
            <CRow>
              <CCol lg={6}>
                <CFormGroup>
                  <label htmlFor="date" className={currentErrors.desiredDate ? "font-weight-bold text-danger" : "text-center font-weight-bold"}>Date désiré</label>
                  <CRow>
                    <CCol lg={12}>
                      <DatePicker
                        filterDate={isWeekday}
                        disabled={loading}
                        className="form-control"
                        name="date"
                        dateFormat="dd/MM/yyyy"
                        selected={currentActivity.desiredDate}
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
                      />
                      <span className="text-danger">{currentErrors.desiredDate}</span>
                    </CCol>
                  </CRow>
                </CFormGroup>
              </CCol>
              <CCol lg={6}>
                <CFormGroup>
                  <label htmlFor="time" className={currentErrors.time ? "font-weight-bold text-danger" : "text-center font-weight-bold"}>Durée en jours *</label>
                  <CInput
                    type="number"
                    id="time"
                    name="time"
                    value={currentActivity.duration}
                    onChange={this.handleChange}
                    placeholder="Saisir la durée en jours.." />
                  <span className="text-danger">{currentErrors.time}</span>
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
                    value={currentActivity.commentaryEmployee}
                    onChange={this.handleChange}
                    placeholder="Votre observations.." />
                  <span className="text-danger">{currentErrors.report}</span>
                </CFormGroup>
              </CCol>
            </CRow>
            <CRow>
              <CCol lg={6}>
                <CButton type="submit" block color="info" onClick={this.addActivity}>
                  Ajouter
                </CButton>

              </CCol>
              {ifError != null && <CAlert closeButton color={ifError ? "danger" : "success"}>{message}</CAlert>}
            </CRow>
          </CForm>
          <CRow>
            <CCol lg={12} className="table-responsive mt-4">
              <table className="table table-hover table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Activité</th>
                    <th>Date désire</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listActivity.length > 0 ? (
                    listActivity.map((object, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            {object.title}
                          </td>
                          <td>
                            {moment(object.desiredDate).format("LL")}
                          </td>
                          <td>
                            <CButton className="mt-1" color="danger" title="Vous voulez annuler ?" onClick={(e) => this.delete(object)}>
                              X
                            </CButton>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center font-weight-bold">Aucune activité</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CCol>
          </CRow>
          <CRow>
            <CCol lg={12}>
              <CButton block color="success" onClick={this.createPlan}>
                Créer votre plan annuel activités
              </CButton>
            </CCol>
            <CCol lg={12}>
              <CButton className="mt-1" to={"/plan-annuel/liste"} block color="danger" title="Vous voulez annuler ?">
                Annuler
              </CButton>
            </CCol>
          </CRow>
        </>
      )
    }

  }
}
function mapStateToProps(state) {
  const { isRole, user } = state.authen;
  return {
    isRole,
    user
  };
}

export default withRouter(connect(mapStateToProps)(CreateActivityPlan));