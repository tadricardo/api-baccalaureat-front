import { CAlert, CButton, CSelect, CSpinner } from "@coreui/react";
import moment from "moment";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import competenceService from "src/services/competence.service";
import formationsService from "src/services/formations.service";
import serviceService from "src/services/service.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { compareDateStringWithDateCurrent, compareTwoDateString, ifNumber, ifNumberWithDecimal, isValidDate } from "src/utils/fonctions";

class UpdateFormation extends Component {
  constructor(props) {
    super(props);
    this.getAllDomaines = this.getAllDomaines.bind(this);
    this.getAllSkills = this.getAllSkills.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateTraining = this.updateTraining.bind(this);
    this.validationForm = this.validationForm.bind(this);
    this.getFormation = this.getFormation.bind(this);
    this.state = {
      message: null,
      ifError: null,
      currentErrors: {
        title: null,
        titleBool: false,
        duration: null,
        durationBool: false,
        price: null,
        priceBool: false,
        startDate: null,
        startDateBool: false,
        endDate: null,
        endDateBool: false,
        domain: null,
        domainBool: false,
        skill: null,
        skillBool: false
      },
      validateForm: false,
      domains: [],
      skills: [],
      currentFormation: {
        titre: '',
        dateDebut: '',
        dateFin: '',
        duree: 0,
        prix: 0,
        domaine: {
          id: 0,
          version: null,
        },
        competences: {},
      },
      loading: false,
      competences: [],
      competencesNote: [],
      competencesError: [],
      competencesErrorDoublon: [],
      competencesToUpdate: [],
    };
  }

  componentDidMount() {
    this.getFormation(this.props.formationid.id);
    this.getAllDomaines();
    this.getAllSkills();
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "title") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            title: "Le champ nom est requis.",
            titleBool: true,
          }
        }));
      } else {
        this.setState((prevState) => ({
          currentFormation: {
            ...prevState.currentFormation,
            titre: value
          },
          currentErrors: {
            ...prevState.currentErrors,
            title: null,
            titleBool: false
          }
        }));
      }
    }

    if (name === "duration") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            duration: "Le champ durée est requis.",
            durationBool: true,
          }
        }));
      } else {
        if (!ifNumber(value)) {
          this.setState((prevState) => ({
            currentErrors: {
              ...prevState.currentErrors,
              duration: "Veuillez saisir une durée correct. (en heure)",
              durationBool: true,
            }
          }));
        } else {
          if (value <= 0) {
            this.setState((prevState) => ({
              currentErrors: {
                ...prevState.currentErrors,
                duration: "Le durée ne peut être inférieure à zero.",
                durationBool: true,
              }
            }));
          } else {
            this.setState((prevState) => ({
              currentErrors: {
                ...prevState.currentErrors,
                duration: null,
                durationBool: false,
              },
              currentFormation: {
                ...prevState.currentFormation,
                duree: value,
              },
            }));
          }
        }
      }
    }

    if (name === "price") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            price: "Le champ prix est requis.",
            priceBool: true
          },
          prix: value
        }));
      } else {
        if (!ifNumberWithDecimal(value)) {
          this.setState((prevState) => ({
            currentErrors: {
              ...prevState.currentErrors,
              price: "Veuillez saisir un prix correct.",
              priceBool: true
            },
            prix: value
          }));
        } else {
          if (value <= 0) {
            this.setState((prevState) => ({
              currentErrors: {
                ...prevState.currentErrors,
                price: "Le prix ne peut être inférieur à zero.",
                priceBool: true
              },
              prix: value
            }));
          } else {
            this.setState((prevState) => ({
              currentErrors: {
                ...prevState.currentErrors,
                price: null,
                priceBool: false
              },
              currentFormation: {
                ...prevState.currentFormation,
                prix: value,
              },
            }));
          }
        }
      }
    }

    if (name === "startDate") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            startDate: "Le champ date début est requis.",
            startDateBool: true,
          }
        }));
      } else {
        if (!isValidDate(value)) {
          this.setState((prevState) => ({
            currentErrors: {
              ...prevState.currentErrors,
              startDate: "Veuillez saisir une date correct.",
              startDateBool: true,
            }
          }));
        } else {
          if (!compareDateStringWithDateCurrent(value)) {
            this.setState((prevState) => ({
              currentErrors: {
                ...prevState.currentErrors,
                startDate: "La date doit être ultérieure à la date du jour.",
                startDateBool: true,
              }
            }));
          } else {
            this.setState((prevState) => ({
              currentErrors: {
                ...prevState.currentErrors,
                startDate: null,
                startDateBool: false,
              },
              currentFormation: {
                ...prevState.currentFormation,
                dateDebut: value,
              },
            }));
          }
        }

      }
    }

    if (name === "endDate") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            endDate: "Le champ date de fin est requis.",
            endDateBool: true
          }
        }));
      } else {
        if (!isValidDate(value)) {
          this.setState((prevState) => ({
            currentErrors: {
              ...prevState.currentErrors,
              endDate: "Veuillez saisir une date correcte.",
              endDateBool: true
            }
          }));
        } else {
          if (compareTwoDateString(this.state.currentFormation.dateDebut, value) === "+") {
            this.setState((prevState) => ({
              currentErrors: {
                ...prevState.currentErrors,
                endDate: "Le date de fin ne peut être inférieure a la date de début.",
                endDateBool: true
              }
            }));
          } else {
            this.setState((prevState) => ({
              currentErrors: {
                ...prevState.currentErrors,
                endDate: null,
                endDateBool: false
              },
              currentFormation: {
                ...prevState.currentFormation,
                dateFin: value,
              },
            }));
          }
        }
      }
    }
    if (name === "domain") {
      if (value === "0" || value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            domain: "Le champ service est requis.",
            domainBool: true
          }
        }));
      } else {
        if (this.state.domains.find(e => e.id === parseInt(value)) === undefined) {
          this.setState((prevState) => ({
            currentErrors: {
              ...prevState.currentErrors,
              domain: "Veuillez sélectionner un service qui existe.",
              domainBool: true
            }
          }));
        } else {
          this.setState((prevState) => ({
            currentErrors: {
              ...prevState.currentErrors,
              domain: null,
              domainBool: false
            },
            currentFormation: {
              ...prevState.currentFormation,
              domaine: {
                id: value,
              },
            },
          }));
        }
      }
    }
  }

  getAllDomaines() {
    serviceService
      .getAllService()
      .then((response) => {
        this.setState({ domains: response.data });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getAllSkills() {
    competenceService
      .getAllCompetence()
      .then((response) => {
        this.setState({ skills: response.data });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getFormation(id) {
    formationsService.getFormationById(id)
      .then(response => {
        let comp = [];
        let compNote = [];
        let compError = [];
        let compErrorDoubl = [];
        let i = 0
        response.data.competences.forEach(e => {
          comp[i] = e.competence.id;
          compNote[i] = e.note;
          compError[i] = null;
          compErrorDoubl[i] = null;
          i++;
        })
        this.setState({
          currentFormation: response.data,
          competences: comp,
          competencesNote: compNote,
          competencesError: compError,
          competencesErrorDoublon: compErrorDoubl,
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleCompetence = i => e => {
    let competences = [...this.state.competences]
    competences[i] = parseInt(e.target.value);

    let competencesError = [...this.state.competencesError]
    competencesError[i] = competences[i] !== null && competences[i] !== 0 && this.state.competencesNote[i] !== undefined && this.state.competencesNote[i] !== "0" ? null : "Une compétence doit avoir une note."
    let competencesErrorDoublon = [...this.state.competencesErrorDoublon]
    competencesErrorDoublon[i] = this.state.competences.filter(c => c === parseInt(e.target.value)).length > 0 ? "Cette compétence est déjà sélectionnée." : null

    this.setState((prevState) => ({
      competences,
      competencesError,
      competencesErrorDoublon,
      currentErrors: {
        ...prevState.currentErrors,
        skill: competencesError.filter(error => error !== null).length === 0 && competencesErrorDoublon.filter(error => error !== null).length === 0 ? null : "Erreur dans les compétences.",
        skillBool: competencesError.filter(error => error !== null).length === 0 && competencesErrorDoublon.filter(error => error !== null).length === 0 ? false : true,
      }
    }))
  }

  handleCompetenceNote = i => e => {
    let competencesNote = [...this.state.competencesNote]
    competencesNote[i] = e.target.value

    let competencesError = [...this.state.competencesError]
    competencesError[i] = this.state.competences[i] !== null && this.state.competences[i] !== 0 && competencesNote[i] !== undefined && competencesNote[i] !== "0" ? null : "Une compétence doit avoir une note."

    this.setState((prevState) => ({
      competencesNote,
      competencesError,
      currentErrors: {
        ...prevState.currentErrors,
        skill: competencesError.filter(error => error !== null).length === 0 && this.state.competencesErrorDoublon.filter(error => error !== null).length === 0 ? null : "Erreur dans les compétences.",
        skillBool: competencesError.filter(error => error !== null).length === 0 && this.state.competencesErrorDoublon.filter(error => error !== null).length === 0 ? false : true,
      }
    }))
  }

  handleCompetenceDelete = i => e => {
    e.preventDefault()
    let competences = [
      ...this.state.competences.slice(0, i),
      ...this.state.competences.slice(i + 1)
    ]
    let competencesNote = [
      ...this.state.competencesNote.slice(0, i),
      ...this.state.competencesNote.slice(i + 1)
    ]
    let competencesError = [
      ...this.state.competencesError.slice(0, i),
      ...this.state.competencesError.slice(i + 1)
    ]

    let competencesErrorDoublon = [
      ...this.state.competencesErrorDoublon.slice(0, i),
      ...this.state.competencesErrorDoublon.slice(i + 1)
    ]
    this.setState((prevState) => ({
      competences,
      competencesNote,
      competencesError,
      competencesErrorDoublon,
      currentErrors: {
        ...prevState.currentErrors,
        skillBool: competences.length > 0 ? false : true,
        skill: competences.length > 0 ? null : "Veuillez séléctionner au moins une compétence",
      }
    }))
  }

  addAutreCompetence = e => {
    e.preventDefault();
    let competences = this.state.competences.concat([0])
    let competencesNote = this.state.competencesNote.concat(['0'])
    let competencesError = this.state.competencesError.concat(['Une compétence doit avoir une note.'])
    let competencesErrorDoublon = this.state.competencesErrorDoublon.concat([''])
    this.setState({
      competences,
      competencesNote,
      competencesError,
      competencesErrorDoublon
    })
  }

  validationForm() {
    const { currentErrors, currentFormation, competencesError, competencesErrorDoublon } = this.state;
    if (currentFormation.domaine.id === 0) {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          domain: "Le champ service est requis.",
          domainBool: true
        }
      }));
    }

    if (this.state.competences.length > 0) {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          skill: competencesError.filter(error => error !== null).length === 0 && competencesErrorDoublon.filter(error => error !== null).length === 0 ? null : "Erreur dans les compétences.",
          skillBool: competencesError.filter(error => error !== null).length === 0 && competencesErrorDoublon.filter(error => error !== null).length === 0 ? false : true,
        }
      }));
    } else {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          skill: "Veuillez séléctionner au moins une compétence",
          skillBool: true
        }
      }));
    }

    if (!currentErrors.durationBool &&
      !currentErrors.startDateBool &&
      !currentErrors.endDateBool &&
      !currentErrors.domainBool &&
      !currentErrors.titleBool &&
      !currentErrors.skillBool &&
      !currentErrors.priceBool) {
      return true;
    } else {
      return false;
    }
  }

  updateCompetence() {
    let competenceArray = this.state.competencesToUpdate;
    let object = {};
    this.state.competences.map((comp, index) => ((
      object = null,
      object = {
        competence: {
          id: this.state.competences[index],
        },
        note: this.state.competencesNote[index],
        formation: {
          id: 0,
        }
      },
      comp && competenceArray.push(object)
    )))
    return competenceArray;
  }

  updateTraining(e) {
    e.preventDefault();
    this.setState({ loading: true })
    if (this.validationForm()) {
      const json = JSON.stringify(this.state.currentFormation).split('"value":').join('"id":');
      const data = JSON.parse(json);
      const requete = {
        formation: data,
        competences: this.updateCompetence(),
      }
      console.log("requete : ",requete)
      formationsService.updateWithCompetence(requete)
        .then((resp) => {
          this.setState({
            message: "Modification bien prise en compte ! Redirection vers la formation.",
            ifError: false
          });
          window.setTimeout(() => { this.props.history.push(`/formations/voir/${this.state.currentFormation.id}`) }, 2500)
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
    const { domains, skills, currentFormation, currentErrors, message, ifError, loading, competences, competencesNote, competencesError, competencesErrorDoublon } = this.state;
    const dateNow = new Date();
    return (
      <div className="submit-form">
        <div>
          <form name="createTraining" onSubmit={this.updateTraining}>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="title">Titre *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    id="title"
                    value={currentFormation.titre}
                    onChange={this.handleChange}
                    required
                  />
                  <span className="text-danger">{currentErrors.title}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="duration">Durée * <span><small><i>(en heure)</i></small></span></label>
                  <input
                    type="number"
                    name="duration"
                    className="form-control"
                    id="duration"
                    value={currentFormation.duree}
                    onChange={this.handleChange}
                    required
                  />
                  <span className="text-danger">{currentErrors.duration}</span>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="price">Prix * <span><small><i>(TTC)</i></small></span></label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    id="price"
                    value={currentFormation.prix}
                    onChange={this.handleChange}
                    required
                  />
                  <span className="text-danger">{currentErrors.price}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="startDate">Date début *</label>
                  <input
                    type="date"
                    min={moment(dateNow.setDate(dateNow.getDate() + 1)).format(
                      "YYYY-MM-DD"
                    )}
                    name="startDate"
                    className="form-control"
                    id="startDate"
                    value={currentFormation.dateDebut}
                    onChange={this.handleChange}
                    required
                  />
                  <span className="text-danger">{currentErrors.startDate}</span>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="endDate">Date de fin *</label>
                  <input
                    type="date"
                    min={moment(dateNow.setDate(dateNow.getDate() + 2)).format(
                      "YYYY-MM-DD"
                    )}
                    name="endDate"
                    className="form-control"
                    id="endDate"
                    onChange={this.handleChange}
                    value={currentFormation.dateFin}
                    required
                  />
                  <span className="text-danger">{currentErrors.endDate}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="domain">Service *</label>
                  <CSelect
                    custom
                    name="domain"
                    id="domain"
                    onChange={this.handleChange}
                    value={currentFormation.domaine.id === null ? 0 : currentFormation.domaine.id}
                    required
                  >
                    <option value="0">Veuillez sélectionner un service</option>
                    {domains.map((domain, key) => (
                      <option key={key} value={domain.id}>
                        {domain.titre}
                      </option>
                    ))}
                  </CSelect>
                  <span className="text-danger">{currentErrors.domain}</span>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="competence">Compétences visées</label>
                  {competences.map((comp, index) => (
                    <div key={index}>
                      <div className="row mt-1" key={comp.id}>
                        <div className="col">
                          <CSelect custom name="competence" id="competence" onChange={this.handleCompetence(index)} required
                            value={
                              competences[index] === null
                                ? 0
                                : competences[index]
                            }>
                            <option value="0">Veuillez sélectionner une compétence</option>
                            {skills.map((e, key) => (
                              <option key={key} value={e.id} select={comp = e.id}>
                                {`${e.nom}`}
                              </option>
                            ))}
                          </CSelect>
                        </div>
                        <div className="col">
                          <select className="custom-select" required onChange={this.handleCompetenceNote(index)}
                            value={
                              competencesNote[index] === null
                                ? "0"
                                : competencesNote[index]
                            }>
                            <option value="0">Note de la compétence</option>
                            <option value="DEBUTANT">Débutant</option>
                            <option value="JUNIOR">Junior</option>
                            <option value="CONFIRME">Confirmé</option>
                            <option value="SENIOR">Sénior</option>
                            <option value="EXPERT">Expert</option>
                          </select>
                        </div>
                        <div className="col">
                          <CButton
                            className="btn btn-danger"
                            onClick={this.handleCompetenceDelete(index)}
                            title="Vous voulez supprimer cette compétence ?"
                          >
                            {" "} <FontAwesomeIcon icon={faTrash} />
                          </CButton>
                        </div>
                      </div>
                      <p className="mb-0"><span className="text-danger">{competencesError[index]}</span></p>
                      <p className="mt-0"><span className="text-danger mt">{competencesErrorDoublon[index]}</span></p>
                    </div>
                  ))}
                </div>
                <CButton className="mt-1" block color="info" onClick={this.addAutreCompetence}>
                  Ajouter une compétence
                </CButton>
                <span className="text-danger">{currentErrors.skill}</span>
              </div>
            </div>
            <CButton type="submit" className="mt-3" block color="info" disabled={loading}>
              {loading && <CSpinner size="sm" variant="border" />} Modifier la formation
            </CButton>
            <Link to={"/formations"} className="withoutUnderlane">
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

export default withRouter(UpdateFormation);
