import { CAlert, CButton, CCol, CForm, CFormGroup, CInput, CRow, CSelect, CSpinner, CTextarea } from '@coreui/react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import moment from 'moment';
import React, { Component } from 'react'
import { withRouter } from 'react-router';
import activityDomainService from 'src/services/activityDomain.service';
import annualActivityService from 'src/services/annualActivity.service';
import swal from 'sweetalert';
import fr from 'date-fns/locale/fr';
import momentFR from 'moment/locale/fr';
import planActivityService from 'src/services/planActivity.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';


class UpdateActivityPlan extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.getDomainActivity = this.getDomainActivity.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.createPlan = this.createPlan.bind(this);
    this.getPlanAnnuel = this.getPlanAnnuel.bind(this);
    this.editActivity = this.editActivity.bind(this);
    this.addNewActivity = this.addNewActivity.bind(this);
    this.cancelActivity = this.cancelActivity.bind(this);
    this.state = {
      idPlan: this.props.activityPlan.id,
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
          id: 0,
          titre: ""
        },
        desiredDate: new Date(),
        duration: 0,
        commentaryEmployee: "",
        version: 0
      },
      dateDesiredtest: [],
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      editActivity: false,
      createNewActivity: false,
      hiddenActivity: false
    };
    moment.updateLocale('fr', momentFR);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getDomainActivity();
    this.getPlanAnnuel(this.state.idPlan);
  }

  getDomainActivity() {
    activityDomainService.getAll()
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

  getPlanAnnuel(id) {
    planActivityService.getById(id).then(response => {
      const data = response.data;
      this.setState({
        listActivity: data.lstActivity
      });
    }).catch(e => { console.log(e) })
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
          id: currentActivity.domain.id,
          titre: currentActivity.domain.titre
        },
        desiredDate: currentActivity.desiredDate,
        duration: currentActivity.duration,
        commentaryEmployee: currentActivity.commentaryEmployee,
        paa: {
          id: this.state.idPlan,
        },
        version: 0
      };
      listActivity.push(obj);
      this.setState({
        hiddenActivity: false,
        editActivity: false,
        createNewActivity: false,
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

  editActivity(e) {
    e.preventDefault();
    let { listActivity, currentActivity } = this.state;
    let i = listActivity.findIndex(task => task.id === currentActivity.id);
    listActivity[i].title = currentActivity.title;
    listActivity[i].domain.id = currentActivity.domain.id;
    listActivity[i].desiredDate = currentActivity.desiredDate;
    listActivity[i].duration = currentActivity.duration;
    listActivity[i].commentaryEmployee = currentActivity.commentaryEmployee;
    listActivity[i].version = currentActivity.version++;
    this.setState((prevState) => ({
      ...prevState.listActivity,
      listActivity: listActivity,
      editActivity: false,
      hiddenActivity: false
    }));
  }

  edit = (object) => {
    let currentActivity =
    {
      id: object.id,
      title: object.title,
      domain: {
        id: object.domain.id
      },
      duration: object.duration,
      desiredDate: new Date(object.desiredDate),
      commentaryEmployee: object.commentaryEmployee,
      paa: {
        id: this.state.idPlan,
      },
      version: object.version
    }

    this.setState({
      currentActivity: currentActivity,
      editActivity: true,
      createNewActivity: false,
      hiddenActivity: true
    })
  };

  delete = (object) => {
    swal({
      text: "Êtes-vous sûr de vouloir supprimer cette activité ? (irréversible)",
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
        annualActivityService.delete(object.id).then().catch(e => { console.log(e) })
      }
    });

  };
  componentWillUnmount() {
    this._isMounted = false;
}

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
              id: value,
              titre: target[value].text
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
              id: value,
              titre: target[value].text
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
      text: "Êtes-vous sûr de vouloir modifier ce plan annuel ?",
      icon: "success",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.setState({loading: true})
        annualActivityService.updateLst(this.state.listActivity).then(response => {
          const data = response.data;
          
          window.setTimeout(() => { this.setState({loading: false},this.props.history.push(`/plan-annuel/voir/${data[0].paa.id}`)) }, 2500);
        }).catch(e => { console.log(e);
          this.setState({loading: false}) })
      }
    });


  }

  addNewActivity() {
    this.setState({
      editActivity: false,
      createNewActivity: true,
      hiddenActivity: true
    });
  }

  cancelActivity(e) {
    e.preventDefault();
    this.setState({
      hiddenActivity: false,
      editActivity: false,
      createNewActivity: false,
      currentActivity: {
        title: "",
        domain: {
          id: 0
        },
        desiredDate: new Date(),
        duration: 0,
        commentaryEmployee: "",
        version: 0
      },
    });
  }

  render() {
    const { currentErrors, activityDomain, currentActivity, loading, startDate, listActivity, ifError, message, createNewActivity, hiddenActivity } = this.state;
    const isWeekday = (date) => {
      const day = new Date(date).getDay();
      return day !== 0 && day !== 6;
    };
    return (
      <>

        <CForm hidden={!hiddenActivity}>
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
              <CButton type="submit" block color="info" onClick={createNewActivity ? this.addActivity : this.editActivity}>
                {createNewActivity ? "Créer une activité" : "Modifier cette activité"}
              </CButton>
            </CCol>
            <CCol lg={6}>
              <CButton type="submit" block color="danger" onClick={this.cancelActivity}>
                Annuler
              </CButton>
            </CCol>

          </CRow>
          <CRow>
            <CCol lg={12}>
              {ifError != null && <CAlert closeButton color={ifError ? "danger" : "success"}>{message}</CAlert>}
            </CCol>
          </CRow>
        </CForm>
        <CRow>
          <CCol md={{ span: 2, offset: 10 }}>
            <CButton className="ml-5" color="success" title="Vous voulez créer une nouvelle activité ?" onClick={this.addNewActivity} hidden={hiddenActivity}><FontAwesomeIcon icon={faPlus} /> Ajouter</CButton>
          </CCol>
        </CRow>
        <CRow>
          <CCol lg={12} className="table-responsive mt-4">
            <table className="table table-hover table-striped table-bordered">
              <thead>
                <tr>
                  <th>Catégorie</th>
                  <th>Activité</th>
                  <th>Durée (jours)</th>
                  <th>Date désire</th>
                  <th>Observations</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {listActivity.length > 0 ? (
                  listActivity.map((object, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          {object.domain.titre}
                        </td>
                        <td>
                          {object.title}
                        </td>
                        <td>
                          {object.duration}
                        </td>
                        <td>
                          {moment(object.desiredDate).format("LL")}
                        </td>
                        <td>
                          {object.commentaryEmployee}
                        </td>
                        <td>
                          <CButton className="mt-1 mr-2" color="info" title="Vous voulez éditer cette activité ?" onClick={(e) => this.edit(object)}>
                            <FontAwesomeIcon icon={faEdit} />
                          </CButton>
                          <CButton className="mt-1" color="danger" title="Vous voulez annuler ?" onClick={(e) => this.delete(object)}>
                            <FontAwesomeIcon icon={faTrash} />
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
            <CButton block color="success" onClick={this.createPlan} disabled={loading}>
            {loading && <CSpinner size="sm" variant="border" />} Modifier votre PAA
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

export default withRouter(UpdateActivityPlan);