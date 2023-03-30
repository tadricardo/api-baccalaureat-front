import { CButton, CAlert, CSpinner, CSelect } from "@coreui/react";
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
import { faTrash } from "@fortawesome/free-solid-svg-icons";


var yesterday = moment();
function valid(current) {
  return current.isAfter(yesterday);
}
class CreateEntretien extends Component {
  constructor(props) {
    super(props);
    this.saveInterview = this.saveInterview.bind(this);
    this.onChangeSalarie = this.onChangeSalarie.bind(this);
    this.handleAutreParticipant = this.handleAutreParticipant.bind(this);
    this.handleAutreParticipantFonction = this.handleAutreParticipantFonction.bind(this);
    this.handleAutreParticipantSignatureObligatoire = this.handleAutreParticipantSignatureObligatoire.bind(this);
    this.handleAutreParticipantDelete = this.handleAutreParticipantDelete.bind(this);
    this.addAutreParticipant = this.addAutreParticipant.bind(this);
    this.onChangeDateEntretien = this.onChangeDateEntretien.bind(this);
    this.getTypeEntretien = this.getTypeEntretien.bind(this);
    this.onChangeTypeEntretien = this.onChangeTypeEntretien.bind(this);
    this.onChangeQuestionnaire = this.onChangeQuestionnaire.bind(this);
    this.getQuestionnaireByIdEntretien = this.getQuestionnaireByIdEntretien.bind(this);
    this.saveParticipants = this.saveParticipants.bind(this);
    this.getAllSalarie = this.getAllSalarie.bind(this);
    this.getAllSalarieRH = this.getAllSalarieRH.bind(this);
    this.onChangeManagerEntretien = this.onChangeManagerEntretien.bind(this);
    this.state = {
      typeEntretien: [],
      questionnaires: [],
      disabledButtonParticipant: true,
      disabledSelectManagerSalarie: false,
      message: null,
      ifError: null,
      currentSalarie: {},
      currentManager: {},
      autreParticipant: [],
      autreParticipantFonction: [],
      autreParticipantSignatureObligatoire: [],
      ParticipantsError: [],
      ParticipantsErrorDoublon: [],
      currentErrors: {
        dateEntretien: null,
        dateEntretienBool: true,
        salarie: null,
        salarieBool: true,
        managerEntretien: null,
        managerEntretienBool: true,
        typeEntretien: null,
        typeEntretienBool: true
      },
      validateForm: false,
      salaries: [],
      salarieRH: [],
      salariesRH: [],
      listManager: [],
      listManagers: [],
      salarieManager: {},
      currentInterview: {
        dateEntretien: new Date(Date.now() + (3600 * 1000 * 24)),
        typeEntretien: {
          id: 0,
        },
      },
      participants: [],
      idQuestionnaire: null,
      loading: false
    };
  }

  componentDidMount() {
    this.getTypeEntretien();
    this.getAllSalarie();
    this.getAllSalarieRH();
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
        this.setState({
          salarieRH: response.data,
          salariesRH: response.data,
          listManager: response.data,
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

  onChangeQuestionnaire(e) {
    this.setState((prevState) => ({
      idQuestionnaire: parseInt(e.target.value)
    }))
  }

  onChangeTypeEntretien(e) {
    const idTypeEntretien = e.target.value;
    if ("0" !== idTypeEntretien) {
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
        currentErrors: {
          ...prevState.currentErrors,
          typeEntretien: "Veuillez séléctionner un type d'entretien.",
          typeEntretienBool: true
        }
      }));
    }
  }



  onChangeSalarie(e) {
    if (parseInt(e.target.value) !== 0) {
      let listM = [...this.state.listManagers]; // récuperer la liste des salaries RH
      let listRH = [...this.state.salarieRH]
      const manager = this.state.salaries.find(s => s.id === parseInt(e.target.value)).manager; // Récuperer le manager du salaries
      if (manager !== null) {
        listM.push(manager);
        listRH = listRH.filter(rh => rh.id !== manager.id);
      }
      listM = listM.filter(s => s.id !== parseInt(e.target.value));
      listRH = listRH.filter(rh => rh.id !== parseInt(e.target.value));
      this.setState((prevState) => ({
        currentSalarie: {
          id: parseInt(e.target.value),
        },
        currentManager: (manager !== null && parseInt(manager.id) !== parseInt(e.target.value)) ? manager : null,
        listManager: listM,
        salariesRH: listRH,
        currentErrors: {
          ...prevState.currentErrors,
          salarie: null,
          salarieBool: false,
          managerEntretien: (manager !== null && parseInt(manager.id) !== parseInt(e.target.value)) ? null : "Veuillez séléctionner un manager",
          managerEntretienBool: (manager !== null && parseInt(manager.id) !== parseInt(e.target.value)) ? false : true,
        },
      }), () => {
        if (manager) {
          for (let index = 0; index < document.getElementById('idManagerEntretien').getElementsByTagName('option').length; index++)
            if (parseInt(document.getElementById('idManagerEntretien').getElementsByTagName('option')[index].value) === parseInt(manager.id))
              document.getElementById('idManagerEntretien').getElementsByTagName('option')[index].selected = 'selected';
        }
        else
          document.getElementById('idManagerEntretien').getElementsByTagName('option')[0].selected = 'selected';
      });
      if ((manager && parseInt(manager.id) !== 0 | (this.state.currentManager && parseInt(this.state.currentManager.id) !== 0)) && parseInt(e.target.value) !== 0) {
        document.getElementById("buttonAjtParticipant").title = "Vous voulez ajouter un participant ?";
        this.setState({
          disabledButtonParticipant: false,
        });
      } else {
        document.getElementById("buttonAjtParticipant").title = "Sélectionner d'abord un salarié et un manager.";
        this.setState({
          disabledButtonParticipant: true,
        });
      }
    } else {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          salarie: "Veuillez séléctionner un salarie.",
          salarieBool: true
        },
      }));
      this.setState({
        disabledButtonParticipant: true,
      });
      document.getElementById("buttonAjtParticipant").title = "Sélectionner d'abord un salarié et un manager.";
    }
  }

  onChangeManagerEntretien(e) {
    if (parseInt(e.target.value) !== 0) {
      let listRH = [...this.state.salarieRH];
      listRH = listRH.filter(s => s.id !== parseInt(e.target.value));
      if (this.state.currentSalarie)
        listRH = listRH.filter(s => s.id !== parseInt(this.state.currentSalarie.id));
      if (this.state.currentSalarie && this.state.currentSalarie.id === parseInt(e.target.value)) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            managerEntretien: "Veuillez séléctionner un manager qui n'est pas le salarié.",
            managerEntretienBool: true
          },
        }));
      } else {
        this.setState((prevState) => ({
          salariesRH: listRH,
          currentManager: {
            id: parseInt(e.target.value),
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
      }
    } else {
      this.setState((prevState) => ({
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


  handleAutreParticipant = i => e => {
    let autreParticipant = [...this.state.autreParticipant]
    autreParticipant[i] = parseInt(e.target.value);

    let ParticipantsError = [...this.state.ParticipantsError]
    ParticipantsError[i] = autreParticipant[i] !== null && autreParticipant[i] !== 0 && this.state.autreParticipantFonction[i] !== undefined && this.state.autreParticipantFonction[i] !== "0" ? null : "Le participant doit avoir une fonction."
    let ParticipantsErrorDoublon = [...this.state.ParticipantsErrorDoublon]
    ParticipantsErrorDoublon[i] = this.state.autreParticipant.filter(p => p === parseInt(e.target.value)).length > 0 ? "Ce participant est déjà sélectionné(e)." : null

    this.setState({
      autreParticipant,
      ParticipantsError,
      ParticipantsErrorDoublon,
    })
  }

  handleAutreParticipantFonction = i => e => {
    let autreParticipantFonction = [...this.state.autreParticipantFonction]
    autreParticipantFonction[i] = e.target.value

    let ParticipantsError = [...this.state.ParticipantsError]
    ParticipantsError[i] = this.state.autreParticipant[i] !== null && this.state.autreParticipant[i] !== 0 && autreParticipantFonction[i] !== undefined && autreParticipantFonction[i] !== "0" ? null : "Le participant doit avoir une fonction."

    this.setState({
      autreParticipantFonction,
      ParticipantsError,
    })
  }

  handleAutreParticipantSignatureObligatoire = i => e => {
    let autreParticipantSignatureObligatoire = [...this.state.autreParticipantSignatureObligatoire]
    autreParticipantSignatureObligatoire[i] = e.target.checked
    this.setState({
      autreParticipantSignatureObligatoire
    })
  }

  handleAutreParticipantDelete = i => e => {
    e.preventDefault()
    let autreParticipant = [
      ...this.state.autreParticipant.slice(0, i),
      ...this.state.autreParticipant.slice(i + 1)
    ]
    let autreParticipantFonction = [
      ...this.state.autreParticipantFonction.slice(0, i),
      ...this.state.autreParticipantFonction.slice(i + 1)
    ]
    let autreParticipantSignatureObligatoire = [
      ...this.state.autreParticipantSignatureObligatoire.slice(0, i),
      ...this.state.autreParticipantSignatureObligatoire.slice(i + 1)
    ]
    let ParticipantsError = [
      ...this.state.autreParticipantSignatureObligatoire.slice(0, i),
      ...this.state.autreParticipantSignatureObligatoire.slice(i + 1)
    ]
    let ParticipantsErrorDoublon = [
      ...this.state.ParticipantsErrorDoublon.slice(0, i),
      ...this.state.ParticipantsErrorDoublon.slice(i + 1)
    ]
    this.setState({
      autreParticipant,
      autreParticipantFonction,
      autreParticipantSignatureObligatoire,
      disabledSelectManagerSalarie: this.state.autreParticipant.length - 1 > 0 ? true : false,
      ParticipantsError,
      ParticipantsErrorDoublon,
    })
  }

  addAutreParticipant = e => {
    e.preventDefault();
    let autreParticipant = this.state.autreParticipant.concat([0])
    let autreParticipantFonction = this.state.autreParticipantFonction.concat(['0'])
    let autreParticipantSignatureObligatoire = this.state.autreParticipantSignatureObligatoire.concat([true])
    let ParticipantsError = this.state.ParticipantsError.concat([''])
    let ParticipantsErrorDoublon = this.state.ParticipantsErrorDoublon.concat([''])
    this.setState({
      autreParticipant,
      autreParticipantFonction,
      autreParticipantSignatureObligatoire,
      ParticipantsError,
      ParticipantsErrorDoublon,
      disabledSelectManagerSalarie: autreParticipant.length > 0 ? true : false,
    })
  }

  onChangeDateEntretien(e) {
    if (e.length === 0) {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          dateEntretien: "Veuillez saisir une date / heure.",
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

  saveParticipants() {
    let participantArray = this.state.participants;
    let ParticipantsError = [...this.state.ParticipantsError];
    let ParticipantsErrorDoublon = [...this.state.ParticipantsErrorDoublon];
    let object = {};
    object = null;
    object = {
      salarie: {
        id: this.state.currentSalarie.id
      },
      fonction: "SALARIE",
      signatureObligatoire: true
    }
    participantArray.push(object);
    object = null;
    object = {
      salarie: {
        id: this.state.currentManager.id
      },
      fonction: "MANAGER",
      signatureObligatoire: true
    }
    participantArray.push(object);
    this.state.autreParticipant.map((part, index) => ((
      object = null,
      object = {
        salarie: {
          id: part
        },
        fonction: this.state.autreParticipantFonction[index],
        signatureObligatoire: this.state.autreParticipantSignatureObligatoire[index] === undefined ? true : this.state.autreParticipantSignatureObligatoire[index]
      },
      part && participantArray.push(object)
    )))
    this.setState(({
      participants: participantArray,
    }));

    if (ParticipantsError.filter(e => e !== null).length > 0 || ParticipantsErrorDoublon.filter(e => e !== null).length > 0) {
      //autres participants pas valide
      return false
    }
    else {
      //autres participants valide
      return true
    }
  }

  validationForm() {
    const { currentErrors } = this.state;

    if (!currentErrors.dateEntretienBool &&
      !currentErrors.salarieBool &&
      !currentErrors.managerEntretienBool &&
      !currentErrors.typeEntretienBool &&
      this.state.ParticipantsError.filter(e => e !== null).length === 0 &&
      this.state.ParticipantsErrorDoublon.filter(e => e !== null).length === 0) {
      //formulaire OK
      return true;
    } else {
      //formulaire PAS OK
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          dateEntretien: this.state.currentErrors.dateEntretienBool ? "Veuillez saisir une date / heure." : null,
          salarie: this.state.currentErrors.salarieBool ? "Veuillez sélectionner un salarié." : null,
          managerEntretien: this.state.currentErrors.managerEntretienBool ? "Veuillez sélectionner un manager." : null,
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
      if (this.saveParticipants()) {
        const requete = {
          entretien: this.state.currentInterview,
          participants: this.state.participants,
          idQuestionnaire: parseInt(this.state.idQuestionnaire)
        }
        entretienService.save(requete)
          .then((resp) => {
            this.setState({
              message: "Création de l'entretien bien prise en compte ! Redirection vers la liste des entretiens.",
              ifError: false
            });
            window.setTimeout(() => { this.props.history.push('/entretiens') }, 1500)
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
          message: "Une erreur s'est produite au niveau des participants ! veuillez ré-essayer.",
          ifError: true,
          loading: false,
          participants: null,
        });
      }
    } else {
      this.setState({
        message: "Une erreur s'est produite ! veuillez ré-essayer.",
        ifError: true,
        loading: false,
        participants: null,
      });
    }
  }

  render() {
    const { currentErrors, currentInterview, message, ifError, loading, typeEntretien, questionnaires, salaries, salariesRH, listManager, autreParticipant, autreParticipantFonction, autreParticipantSignatureObligatoire, ParticipantsError, ParticipantsErrorDoublon, disabledButtonParticipant, disabledSelectManagerSalarie } = this.state;
    const dateNow = new Date(Date.now() + (3600 * 1000 * 24));
    return (
      <div className="submit-form">
        <div>
          <form name="createInterview" onSubmit={this.saveInterview}>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="dateEntretien">Date/heure de l'entretien *</label>
                  <Datetime
                    name="dateEntretien"
                    locale="fr"
                    initialValue={dateNow}
                    value={currentInterview.dateEntretien}
                    isValidDate={valid}
                    onChange={this.onChangeDateEntretien}
                    onBlur={this.onChangeDateEntretien}
                    timeConstraints={{
                      hours: { min: 8, max: 20 },
                      minutes: { min: 0, max: 59 }
                    }}
                  />
                  <span className="text-danger">{currentErrors.dateEntretien}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="salarie">Salarie *</label>
                  <CSelect custom name="salarie" id="salarie" onChange={this.onChangeSalarie} required disabled={disabledSelectManagerSalarie}>
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
                  <CSelect custom name="manager" id="idManagerEntretien" onChange={this.onChangeManagerEntretien} required disabled={disabledSelectManagerSalarie}>
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
                  <label htmlFor="salarie">Autre participant</label>
                  {autreParticipant.map((salarie, index) => (
                    <div key={index}>
                      <div className="row mt-1" key={index}>
                        <div className="col">
                          <CSelect custom name="participant" id="participant" onChange={this.handleAutreParticipant(index)} required
                            value={
                              autreParticipant[index] === null ? 0 : autreParticipant[index]
                            }
                          >
                            <option value="0">Veuillez sélectionner un salarié</option>
                            {salariesRH.map((salarie, key) => (
                              <option key={key} value={salarie.id}>
                                {`${salarie.nom} ${salarie.prenom}`}
                              </option>
                            ))}
                          </CSelect>

                        </div>
                        <div className="col">
                          <CSelect className="custom-select" required
                            onChange={this.handleAutreParticipantFonction(index)}
                            value={
                              autreParticipantFonction[index] === null ? 0 : autreParticipantFonction[index]
                            }
                          >
                            <option value="0" defaultValue>Fonction du participant</option>
                            <option value="RH">Ressource Humaine</option>
                            <option value="DIRECTEUR">Directeur</option>
                          </CSelect>
                        </div>
                        <div className="col">
                          <input className="form-check-input" type="checkbox" value="true" id={`signatureObligatoire${index}`} onChange={this.handleAutreParticipantSignatureObligatoire(index)}
                            checked={autreParticipantSignatureObligatoire[index]}
                          />
                          <label className="form-check-label" htmlFor={`signatureObligatoire${index}`}>
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
                      <p className="mb-0"><span className="text-danger">{ParticipantsError[index]}</span></p>
                      <p className="mt-0"><span className="text-danger mt">{ParticipantsErrorDoublon[index]}</span></p>
                    </div>
                  ))}
                </div>
                <CButton className="mt-1" block color="info" title="Sélectionner d'abord un salarié et un manager." id="buttonAjtParticipant" disabled={disabledButtonParticipant} onClick={this.addAutreParticipant}>
                  Ajouter un participant
                </CButton>
                <div className="h6 mt-1">
                  {disabledButtonParticipant && "Sélectionner d'abord un salarié et un manager."}
                  {autreParticipant.length > 0 && "Pour changer le salarie ou le manager, supprimer les autres participants."}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="typeEntretien">Type entretien *</label>
              <CSelect custom name="typeEntretien" id="typeEntretien" onChange={this.onChangeTypeEntretien} required>
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
              <CSelect custom name="questionnaire" id="questionnaire" onChange={this.onChangeQuestionnaire} required>
                <option value="0">Veuillez sélectionner un questionnaire</option>
                {questionnaires.map((type, key) => (
                  <option key={key} value={type.id}>
                    {type.titre}
                  </option>
                ))}
              </CSelect>
              <span className="text-danger">{currentErrors.questionnaire}</span>
            </div>
            <CButton type="submit" block color="info" disabled={loading}>
              {loading && <CSpinner size="sm" variant="border" />} Programmer l'entretien
            </CButton>
            <Link to={"/entretiens/liste"} className="withoutUnderlane">
              <CButton className="mt-1" block color="danger" title="Vous voulez annuler ?">
                Annuler
              </CButton>
            </Link>
          </form>
          {ifError != null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
        </div>
      </div>
    );
  }
}

export default withRouter(CreateEntretien);
