import { CButton, CAlert, CSpinner, CSelect, CTabs, CNav, CNavItem, CNavLink, CTabContent, CTabPane } from "@coreui/react";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";
import "react-datetime/css/react-datetime.css";
import Datetime from 'react-datetime';
import "moment/locale/fr";
import entretienService from "src/services/entretien.service";
import salariesService from "src/services/salaries.service";
import TypeEntretienService from "src/services/type-entretien.service";
import questionnaireService from "src/services/questionnaire.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faLink, faTrash } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";


var yesterday = moment();
function valid(current) {
  return current.isAfter(yesterday);
}
class UpdateEntretien extends Component {
  constructor(props) {
    super(props);
    this.getEntretien = this.getEntretien.bind(this);
    this.saveInterview = this.saveInterview.bind(this);
    this.onChangeSalarie = this.onChangeSalarie.bind(this);
    this.onChangeManagerEntretien = this.onChangeManagerEntretien.bind(this);
    this.handleAutreParticipantSalarie = this.handleAutreParticipantSalarie.bind(this);
    this.handleAutreParticipantFonction = this.handleAutreParticipantFonction.bind(this);
    this.handleAutreParticipantSignatureObligatoire = this.handleAutreParticipantSignatureObligatoire.bind(this);
    this.handleAutreParticipantDelete = this.handleAutreParticipantDelete.bind(this);
    this.addAutreParticipant = this.addAutreParticipant.bind(this);
    this.onChangeDateEntretien = this.onChangeDateEntretien.bind(this);
    this.validationForm = this.validationForm.bind(this);
    this.getTypeEntretien = this.getTypeEntretien.bind(this);
    this.onChangeTypeEntretien = this.onChangeTypeEntretien.bind(this);
    this.onChangeQuestionnaire = this.onChangeQuestionnaire.bind(this);
    this.updateParticipants = this.updateParticipants.bind(this);
    this.getAllSalarie = this.getAllSalarie.bind(this);
    this.getAllSalarieRH = this.getAllSalarieRH.bind(this);
    this.state = {
      disabledButtonParticipant: true,
      disabledSelectManagerSalarie: false,
      questionnaires: [],
      typeEntretien: [],
      optionsFonction: [{
        label: "Ressource Humaine",
        value: "RH",
      },
      {
        label: "Directeur",
        value: "DIRECTEUR",
      }],
      message: null,
      ifError: null,
      autreParticipant: [{
        id: null,
        salarie: {
          id: null,
          nom: null,
          prenom: null,
        },
        fonction: null,
        signatureObligatoire: true,
        entretien: {
          id: null
        },
        dateSignature: null,
        signature: null,
        dateNotificationSignature: null,
        dateNotificationParticipant: null,
        notificationParticipant: null,
        version: null,
      }],
      currentParticipants: [],
      participantError: [],
      participantErrorDoublon: [],
      currentManager: {},
      currentSalarie: {},
      currentErrors: {
        dateEntretien: null,
        dateEntretienBool: false,
        salarie: null,
        salarieBool: false,
        managerEntretien: null,
        managerEntretienBool: false,
        typeEntretien: null,
        typeEntretienBool: false
      },
      validateForm: false,
      salaries: [],
      salarieRH: [],
      salariesRH: [],
      listManager: [],
      listManagers: [],
      currentInterview: {
        dateEntretien: null,
        typeEntretien: {},
        compteRendu: {
          questionnaire: {
            id: null
          }
        },
        participants: [{
          salarie: {},
          fonction: null,
        }]
      },
      loading: false,
      idQuestionnaire: 0,

    };
  }

  componentDidMount() {
    this.getEntretien(this.props.entretienid.id);
    this.getTypeEntretien();
    this.getAllSalarie();
    this.getAllSalarieRH();
  }

  getQuestionnaireByIdEntretien(idEntretien) {
    questionnaireService.getQuestionByIdTypeEntretien(idEntretien)
      .then(response => {
        this.setState({
          questionnaires: response.data,
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  getEntretien(id) {
    entretienService.getEntretienById(id)
      .then(response => {
        let participantError = [];
        let participantErrorDoublon = [];
        let i = 0;
        response.data.participants.filter((p) => (
          p.fonction !== "SALARIE" && p.fonction !== "MANAGER" && (
            participantError[i] = null,
            participantErrorDoublon[i] = null,
            i++
          )));
        this.setState({
          currentInterview: response.data,
          currentManager: response.data.participants.find(p => (p.fonction === "MANAGER")),
          currentSalarie: response.data.participants.find(p => (p.fonction === "SALARIE")),
          autreParticipant: response.data.participants.filter(p => (p.fonction !== "SALARIE" && p.fonction !== "MANAGER")),
          idQuestionnaire: response.data.compteRendu.questionnaire === null ? 0 : response.data.compteRendu.questionnaire.id,
          participantError,
          participantErrorDoublon,
        }, () => {
          this.getQuestionnaireByIdEntretien(response.data.typeEntretien.id);
          this.setState({
            disabledButtonParticipant: this.state.currentSalarie && this.state.currentManager ? false : true,
            disabledSelectManagerSalarie: this.state.autreParticipant.length > 0 ? true : false,
          })
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  getTypeEntretien() {
    TypeEntretienService.getAllTypeEntretien()
      .then(response => {
        this.setState({
          typeEntretien: response.data,
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  getAllSalarieRH() {
    salariesService.getAllSalarieActifByRole('RH')
      .then(response => {
        let manager = response.data;
        manager.push(this.state.currentManager.salarie);
        manager = manager.filter((m) => m.id !== this.state.currentSalarie.salarie.id)
        let salarieRH = response.data.filter((d) => d.id !== this.state.currentSalarie.salarie.id);
        salarieRH = salarieRH.filter((d) => d.id !== this.state.currentManager.salarie.id);

        this.setState({
          salariesRH: response.data,
          listManager: manager,
          salarieRH: salarieRH,
          listManagers: response.data,
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  getAllSalarie() {
    salariesService.getAllActif()
      .then(response => {
        this.setState({
          salaries: response.data,
        });
      })
      .catch(e => {
        console.log(e);
      });
  }


  onChangeTypeEntretien(e) {
    const idTypeEntretien = parseInt(e.target.value);
    if (idTypeEntretien !== 0) {
      this.setState((prevState) => ({
        currentInterview: {
          ...prevState.currentInterview,
          typeEntretien: {
            id: idTypeEntretien
          }
        },
        currentErrors: {
          ...prevState.currentErrors,
          typeEntretien: null,
          typeEntretienBool: false
        }
      }), () => {
        this.getQuestionnaireByIdEntretien(idTypeEntretien);
      })
    } else {
      this.setState((prevState) => ({
        currentInterview: {
          ...prevState.currentInterview,
          typeEntretien: {
            id: idTypeEntretien
          }
        },
        currentErrors: {
          ...prevState.currentErrors,
          typeEntretien: "Le champ Service est requis.",
          typeEntretienBool: true
        }
      }));
    }
  }

  onChangeDateEntretien(e) {
    if (e.length === 0) {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          dateEntretien: "Veuillez saisir une date/heure.",
          dateEntretienBool: true
        },
        currentInterview: {
          ...prevState.currentInterview,
          dateEntretien: e,
        },
      }));
    } else {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          dateEntretien: null,
          dateEntretienBool: false
        },
        currentInterview: {
          ...prevState.currentInterview,
          dateEntretien: e,
        },
      }));
    }
  }

  onChangeQuestionnaire(e) {
    this.setState((prevState) => ({
      idQuestionnaire: parseInt(e.target.value)
    }))
  }

  validationForm() {
    const { currentErrors } = this.state;
    if (!currentErrors.dateEntretienBool &&
      !currentErrors.typeEntretienBool) {
      //formulaire OK
      return true;
    } else {
      //formulaire PAS OK
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          dateEntretien: this.state.currentErrors.dateEntretienBool ? "Veuillez saisir une date/heure." : null,
          typeEntretien: this.state.currentErrors.typeEntretienBool ? "Veuillez sélectionner un type d'entretien." : null
        },
      }));
      return false;
    }
  }

  saveInterview(e) {
    e.preventDefault();
    this.setState({ loading: true })
    if (this.validationForm()) {
      entretienService.update(this.state.currentInterview, this.state.idQuestionnaire)
        .then((resp) => {
          this.setState({
            message: "Modification de l'entretien bien prise en compte ! Redirection vers la liste des entretiens.",
            ifError: false
          });
          window.setTimeout(() => { this.props.history.push('/entretiens/liste') }, 2500)
        })
        .catch((e) => {
          this.setState({
            message: e.message,
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

  onChangeSalarie(e) {
    if (parseInt(e.target.value) !== 0) {
      const currentSalarie = this.state.salaries.find(f => f.id === parseInt(e.target.value));
      const currentManager = currentSalarie.manager ? currentSalarie.manager : { id: 0 };
      let salarieRH = this.state.salariesRH.filter(s => s.id !== parseInt(e.target.value));
      salarieRH = salarieRH.filter(s => s.id !== parseInt(currentManager.id));
      let listManagers = this.state.listManagers.filter(m => m.id !== parseInt(e.target.value));
      if (currentManager) {
        salarieRH = salarieRH.filter(p => p.id !== currentManager.id);
        listManagers.push(currentManager);
      }

      this.setState((prevState) => ({
        currentSalarie: {
          ...prevState.currentSalarie,
          salarie: currentSalarie
        },
        currentManager: {
          ...prevState.currentManager,
          salarie: currentManager !== null ? currentManager : { id: 0 },
        },
        salarieRH: salarieRH,
        listManager: listManagers,
        currentErrors: {
          ...prevState.currentErrors,
          salarie: null,
          salarieBool: false,
          managerEntretien: currentManager !== null ? null : "Veuillez séléctionner un manager.",
          managerEntretienBool: currentManager !== null ? false : true,
        },
      }));
    } else {
      this.setState((prevState) => ({
        currentSalarie: {
          ...prevState.currentSalarie,
          salarie: { id: 0 }
        },
        currentErrors: {
          ...prevState.currentErrors,
          salarie: "Veuillez séléctionner un salarie.",
          salarieBool: true
        },
      }));
    }
  }

  onChangeManagerEntretien(e) {
    if (parseInt(e.target.value) !== 0) {
      const participant = this.state.salariesRH.filter(s => s.id !== parseInt(e.target.value));
      const manager = this.state.listManager.find(m => m.id === parseInt(e.target.value))
      this.setState((prevState) => ({
        salarieRH: participant,
        currentManager: {
          ...prevState.currentManager,
          salarie: manager
        },
        currentErrors: {
          ...prevState.currentErrors,
          managerEntretien: null,
          managerEntretienBool: false
        },
      }));
      if (parseInt(e.target.value) !== 0 && parseInt(this.state.currentSalarie.id) !== 0) {
        this.setState({
          disabledButtonParticipant: false,
        });
        document.getElementById("buttonAjtParticipant").title = "Vous voulez ajouter un participant ?";
      } else {
        this.setState({
          disabledButtonParticipant: true,
        });
        document.getElementById("buttonAjtParticipant").title = "Sélectionner d'abord un salarié et un manager.";
      }
    } else {
      this.setState((prevState) => ({
        currentManager: {
          ...prevState.currentManager,
          salarie: { id: 0 }
        },
        currentErrors: {
          ...prevState.currentErrors,
          managerEntretien: "Veuillez séléctionner un manager.",
          managerEntretienBool: true
        },
      }));
      this.setState({
        disabledButtonParticipant: true,
      });
      document.getElementById("buttonAjtParticipant").title = "Sélectionner d'abord un salarié et un manager.";
    }
  }

  handleAutreParticipantSalarie = i => e => {
    let autreParticipant = [...this.state.autreParticipant]
    let participantErrorDoublon = [...this.state.participantErrorDoublon]
    participantErrorDoublon[i] = this.state.autreParticipant.filter(p => p.salarie.id === parseInt(e.target.value)).length > 0 ? "Ce participant est déjà sélectionné(e)." : null
    autreParticipant[i].salarie.id = parseInt(e.target.value);
    let participantError = [...this.state.participantError]
    participantError[i] = parseInt(e.target.value) !== 0 && autreParticipant[i].fonction !== "0" && autreParticipant[i].fonction !== undefined && autreParticipant[i].fonction !== null ? null : "Le participant doit avoir une fonction."

    this.setState({
      autreParticipant,
      participantErrorDoublon,
      participantError,
    })
  }

  handleAutreParticipantFonction = i => e => {
    let autreParticipant = [...this.state.autreParticipant]
    autreParticipant[i].fonction = e.target.value;
    let participantError = [...this.state.participantError];
    participantError[i] = autreParticipant[i].salarie.id !== 0 && e.target.value !== "0" && e.target.value !== undefined ? null : "Le participant doit avoir une fonction."
    this.setState({
      autreParticipant,
      participantError,
    })
  }

  handleAutreParticipantSignatureObligatoire = i => e => {
    let autreParticipant = [...this.state.autreParticipant]
    autreParticipant[i].signatureObligatoire = document.getElementById("participantSigntureObligatoire_" + i).checked;
    this.setState({
      autreParticipant
    })
  }

  handleAutreParticipantDelete = i => e => {
    if (this.state.autreParticipant[i].salarie.id !== 0) {
      swal({
        title: "Êtes-vous sûrs ?",
        text: "Voulez-vous supprimer ce participant : " + this.state.autreParticipant[i].salarie.prenom + " " + this.state.autreParticipant[i].salarie.nom + " ?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          entretienService.deleteParticipantByIdEntretien(this.state.autreParticipant[i].salarie.id, this.state.currentInterview.id)
            .then(resp => {
              e.preventDefault()
              let autreParticipant = [
                ...this.state.autreParticipant.slice(0, i),
                ...this.state.autreParticipant.slice(i + 1)
              ]
              this.setState({
                autreParticipant,
                disabledSelectManagerSalarie: this.state.autreParticipant.length - 1 > 0 ? true : false
              })
              swal("Validé !", "Participant supprimé.", "success");
            }).catch(e => {
              swal("Erreur !", "Erreur lors de la suppression du participant : " + e.message, "error");
            })
        }
      });
    } else {
      let autreParticipant = [
        ...this.state.autreParticipant.slice(0, i),
        ...this.state.autreParticipant.slice(i + 1)
      ]
      this.setState({
        autreParticipant,
      })
    }
  }

  addAutreParticipant = e => {
    e.preventDefault();
    let participantError = this.state.participantError.concat([''])
    let participantErrorDoublon = this.state.participantErrorDoublon.concat([''])
    let autreParticipant = this.state.autreParticipant.concat([{
      id: null,
      salarie: {
        id: 0,
        nom: "",
        prenom: "",
      },
      fonction: null,
      signatureObligatoire: true,
      entretien: {
        id: this.state.currentInterview.id
      },
      dateSignature: null,
      signature: null,
      dateNotificationParticipant: null,
      notificationParticipant: null,
      version: null,
    }])
    this.setState({
      autreParticipant,
      participantError,
      participantErrorDoublon,
      disabledSelectManagerSalarie: autreParticipant.length > 0 ? true : false,
    })
  }

  validateFormParticipants() {
    const { currentErrors } = this.state;
    if (!currentErrors.salarieBool &&
      !currentErrors.managerEntretienBool &&
      this.state.participantErrorDoublon.filter(p => p !== null).length > 0 &&
      this.state.participantError.filter(p => p !== null).length > 0) {
      //formulaire OK
      return true;
    } else {
      //formulaire PAS OK
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          dateEntretien: this.state.currentErrors.salarieBool ? "Veuillez saisir un salarié." : null,
          typeEntretien: this.state.currentErrors.managerEntretienBool ? "Veuillez saisir un manager." : null
        },
      }));
      return false;
    }
  }

  updateParticipants(e) {
    e.preventDefault();
    if (this.validateFormParticipants()) {
      let array = [];
      array.push(this.state.currentSalarie);
      array.push(this.state.currentManager);
      this.state.autreParticipant.map(part => array.push(part))
      for (let index = 0; index < array.length; index++) {
        array[index].salarie = {
          id: array[index].salarie.id,
        };
      }
      entretienService.updateParticipants(this.state.currentInterview.id, array)
        .then((resp) => {
          this.setState({
            /*currentManager: resp.data.find(p => (p.fonction === "MANAGER")),
            currentSalarie: resp.data.find(p => (p.fonction === "SALARIE")),
            autreParticipant: resp.data.filter(p => (p.fonction !== "SALARIE" && p.fonction !== "MANAGER")),*/
            message: "Modification de l'entretien bien prise en compte ! Redirection vers la liste des entretiens.",
            ifError: false
          });
          swal("OK", "Participants mis à jours", "success");
          window.setTimeout(() => { this.props.history.push(`/entretiens/liste`) }, 1500)
        })
        .catch((e) => {
          swal("Erreur !", "Erreur lors de la mis à jours des participants : " + e.message, "error");
          this.setState({
            message: "Une erreur s'est produite ! veuillez ré-essayer.",
            ifError: true,
            loading: false
          });
        })
    } else {
      this.setState({
        message: "Une erreur s'est produite ! veuillez ré-essayer.",
        ifError: true,
        loading: false
      });
    }
  }

  render() {
    const { salaries, listManager, idQuestionnaire, currentErrors, currentInterview, message, ifError, loading, typeEntretien, questionnaires, currentSalarie, currentManager, salarieRH, autreParticipant, participantErrorDoublon, participantError, disabledButtonParticipant, disabledSelectManagerSalarie } = this.state;
    const dateNow = new Date(Date.now() + (3600 * 1000 * 24));
    return (
      <div className="submit-form">
        <div>
          <CTabs>
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink>
                  <FontAwesomeIcon icon={faEdit} /> Modification de l'entretien
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink>
                  <FontAwesomeIcon icon={faLink} /> Modification des participants
                </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane>
                <form name="updateInterview" onSubmit={this.saveInterview} className="mt-3">
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="dateEntretien">Date/heure de l'entretien *</label>
                        <Datetime
                          name="dateEntretien"
                          locale="fr"
                          initialValue={dateNow}
                          value={new Date(currentInterview.dateEntretien)}
                          isValidDate={valid}
                          onChange={this.onChangeDateEntretien} />
                        <span className="text-danger">{currentErrors.dateEntretien}</span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="typeEntretien">Type entretien *</label>
                    <CSelect value={currentInterview.typeEntretien === null ? 0 : currentInterview.typeEntretien.id} custom name="typeEntretien" id="typeEntretien" onChange={this.onChangeTypeEntretien} required>
                      <option value="0">Veuillez sélectionner un type d'entretien</option>
                      {typeEntretien.map((type, key) => (
                        <option key={key} value={type.id}>
                          {type.titre}
                        </option>
                      ))}
                    </CSelect>
                    <span className="text-danger">{currentErrors.typeEntretien}</span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="questionnaire">Choix du questionnaire </label>
                    <CSelect value={idQuestionnaire} custom name="questionnaire" id="questionnaire" onChange={this.onChangeQuestionnaire} required>
                      <option value="0">Sélectionner un questionnaire</option>
                      {questionnaires && questionnaires.map((type, key) => (
                        <option key={key} value={type.id}>
                          {type.titre}
                        </option>
                      ))}
                    </CSelect>
                    <span className="text-danger">{currentErrors.questionnaire}</span>
                  </div>
                  <CButton type="submit" block color="success" disabled={loading}>
                    {loading && <CSpinner size="sm" variant="border" />} Modifier l'entretien
                  </CButton>
                  <Link to={"/entretiens/liste"} className="withoutUnderlane">
                    <CButton className="mt-1" block color="danger" title="Vous voulez annuler ?">
                      Annuler
                    </CButton>
                  </Link>
                </form>
                {ifError != null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
              </CTabPane>
              <CTabPane>
                <form name="updateParticipantsInterview" onSubmit={this.updateParticipants} className="mt-3">
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="salarie">Salarie *</label>
                        <CSelect value={currentSalarie && currentSalarie.salarie ? currentSalarie.salarie.id : ""} custom name="salarie" id="salarie" onChange={this.onChangeSalarie} required disabled={disabledSelectManagerSalarie}>
                          <option value="0">Veuillez sélectionner un salarié</option>
                          {salaries.map((salarie, key) => (
                            <option key={key} value={salarie.id}>
                              {`${salarie.nom} ${salarie.prenom}`}
                            </option>
                          ))}
                        </CSelect>
                        <span className="text-danger">{currentErrors.salarie}</span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="managerEntretien">Manager entretien *</label>
                        <CSelect custom value={currentManager && currentManager.salarie ? currentManager.salarie.id : ""} name="manager" id="idManagerEntretien" onChange={this.onChangeManagerEntretien} required disabled={disabledSelectManagerSalarie}>
                          <option value="0">Veuillez sélectionner un manager</option>
                          {listManager.map((salarie, key) => (
                            <option key={key} value={salarie.id}>
                              {`${salarie.nom} ${salarie.prenom}`}
                            </option>
                          ))}
                        </CSelect>
                        <span className="text-danger">{currentErrors.managerEntretien}</span>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="salarie">Liste des participants</label>
                        <div className="h6">
                          {autreParticipant.length > 0 && "Pour changer le salarie ou le manager, supprimer les autres participants."}
                        </div>
                        {autreParticipant.length > 0 ? autreParticipant.map((part, index) => (
                          <div key={index}>
                            <div className="row mt-1" key={index}>
                              <div className="col">
                                <CSelect custom name="participant" id="participant" onChange={this.handleAutreParticipantSalarie(index)} required
                                  value={part.salarie.id !== null ? part.salarie.id : ""}>
                                  <option value="0">Veuillez sélectionner un salarié</option>
                                  {salarieRH.map((salarie, key) => (
                                    <option key={key} value={salarie.id}>
                                      {`${salarie.nom} ${salarie.prenom}`}
                                    </option>
                                  ))}
                                </CSelect>
                              </div>
                              <div className="col">
                                <CSelect
                                  custom
                                  name="fonction"
                                  value={part.fonction === null ? 0 : part.fonction}
                                  required
                                  id={`participantFonction_${index}`}
                                  onChange={this.handleAutreParticipantFonction(index)}
                                >
                                  <option value="0">Fonction du participant</option>
                                  {this.state.optionsFonction.map((fonc, key) => (
                                    <option key={key} value={fonc.value}>
                                      {fonc.label}
                                    </option>
                                  ))}
                                </CSelect>
                              </div>
                              <div className="col">
                                <input className="form-check-input" type="checkbox"
                                  value="true"
                                  id={"participantSigntureObligatoire_" + index}
                                  checked={part.signatureObligatoire}
                                  onChange={this.handleAutreParticipantSignatureObligatoire(index)} />
                                <label className="form-check-label" htmlFor={"participantSigntureObligatoire_" + index}>
                                  Signature Obligatoire
                                </label>
                              </div>
                              <div className="col">
                                <CButton
                                  className="btn btn-danger"
                                  onClick={this.handleAutreParticipantDelete(index)}
                                  title="Vous voulez supprimer ce participant ?"
                                >
                                  {" "} <FontAwesomeIcon icon={faTrash} />
                                </CButton>
                              </div>
                            </div>
                            <p className="mb-0"><span className="text-danger">{participantError[index]}</span></p>
                            <p className="mt-0"><span className="text-danger mt">{participantErrorDoublon[index]}</span></p>
                          </div>
                        )) :
                          <div className="row mt-1"><div className="col">Aucuns participants</div></div>}
                      </div>
                      <CButton className="mt-1" block color="info" title="Sélectionner d'abord un salarié et un manager." id="buttonAjtParticipant" disabled={disabledButtonParticipant} onClick={this.addAutreParticipant}>
                        Ajout d'un participant
                      </CButton>
                      <div className="h6 mt-1">
                        {disabledButtonParticipant && "Sélectionner d'abord un salarié et un manager."}
                        {autreParticipant.length > 0 && "Pour changer le salarie ou le manager, supprimer les autres participants."}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <CButton type="submit" block color="success" disabled={loading}>
                      {loading && <CSpinner size="sm" variant="border" />} Modifier les participants
                    </CButton>
                    <Link to={"/entretiens/liste"} className="withoutUnderlane">
                      <CButton className="mt-1" block color="danger" title="Vous voulez annuler ?">
                        Annuler
                      </CButton>
                    </Link>
                  </div>
                </form>
                {ifError != null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
              </CTabPane>
            </CTabContent>
          </CTabs>
        </div>
      </div>
    );
  }
}

export default withRouter(UpdateEntretien);