import { CButton, CCol, CFormGroup, CInputFile, CLabel, CSelect, CSpinner } from '@coreui/react';
import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import Select from 'react-select';
import { compareDateHighestOrEqualDateCurrent, compareDateStringWithDateCurrent, compareTwoDateString, ifNumberWithDecimal } from "src/utils/fonctions";
import CompetenceService from "../../services/competence.service";
import EntrepriseService from "../../services/entreprises.service";
import PosteService from "../../services/poste.service";
import SalariesService from "../../services/salaries.service";
/*import PDFViewer from "../PDF/PDFViewer";
import AllPagesPDFViewer from "../PDF/all-pages-pdf";
import samplePDF from "src/assets/contrat/contrat_Herduin_Corentin_1.pdf";*/

class UpdatePoste extends Component {
  constructor(props) {
    super(props);
    this.onChangeVolumeHoraire = this.onChangeVolumeHoraire.bind(this);
    this.onChangeTypeHoraire = this.onChangeTypeHoraire.bind(this);
    this.getAllLieuTravail = this.getAllLieuTravail.bind(this);
    this.onGetPoste = this.onGetPoste.bind(this);
    this.getAllCompetenceByDomaine = this.getAllCompetenceByDomaine.bind(this);
    this.onChangeFichierContrat = this.onChangeFichierContrat.bind(this);
    this.updatePoste = this.updatePoste.bind(this);
    this.handleChangeCompetence = this.handleChangeCompetence.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.validationForm = this.validationForm.bind(this);

    this.state = {
      posteId: null,
      nomfichier: "Modifier le contrat (PDF)",
      //samplePDF: "src/assets/contrat/contrat_Herduin_Corentin_3.pdf",
      errors: {
        dateFinInf: null, dateFinInfBool: true,
        volumeNeg: null, volumeNegBool: true,
        extensionFichier: null, extensionFichierBool: true,
        dateInfAujDHui: null, dateInfAujDHuiBool: true,
        contratObligatoire: null, contratObligatoireBool: true,
        remunerationBrut: null, remunerationBrutBool: true,
        coefficient: null, coefficientBool: true,
        position: null, positionBool: true,
        coefficientTravailler: null, coefficientTravaillerBool: true,
        lieuTravail: null, lieuTravailBool: true,
        manager: null, managerBool: true,
        maitreApprentissage: null, maitreApprentissageBool: true,
        debutFormation: null, debutFormationBool: true,
        finFormation: null, finFormationBool: true,
        dureePeriodeEssaie: null, dureePeriodeEssaieBool: true,
        erreur: null,
      },
      lieuxTravail: [],
      managers: [],
      maitresApprentissage: [],
      multiValue: [],
      typeHoraire: 0,
      competences: [],
      fichierContratBrut: null,
      currentPoste: {
        id: null,
        dateDebut: null,
        dateFin: null,
        volumeHoraire: 0,
        volumeJournalier: 0,
        fichierContrat: null,
        domaine: null,
        titrePoste: {
          id: null
        },
        salarie: {
          id: null
        },
        typeContrat: {
          id: null
        },
        manager: {
          id: null
        },
        lieuTravail: {
          id: null
        },
        competencesRequises: null,
        maitreApprentissage: {
          id: null
        },
        position: null,
        coefficientTravailler: 100,
        remunerationBrut: 0,
        coefficient: 1,
        dureePeriodeEssaie: 0,
        debutFormation: "",
        finFormation: "",
        version: 0,
      },
      currentPosteOld: {
        id: null,
        dateDebut: null,
        dateFin: null,
        volumeHoraire: 0,
        volumeJournalier: 0,
        fichierContrat: null,
        domaine: null,
        titrePoste: {
          id: null
        },
        salarie: {
          id: null
        },
        typeContrat: {
          id: null
        },
        manager: {
          id: null
        },
        lieuTravail: {
          id: null
        },
        competencesRequises: null,
        maitreApprentissage: {
          id: null
        },
        position: null,
        coefficientTravailler: 100,
        remunerationBrut: 0,
        coefficient: 1,
        dureePeriodeEssaie: 0,
        debutFormation: "",
        finFormation: "",
        version: 0,
      },
      loading: false,
    };

  }

  componentDidMount() {
    const { state } = this.props.location;
    this.setState({ currentPoste: state })
    if (state === undefined)
      this.props.history.push("/home");
    //this.onGetPoste(this.props.posteId.id);
    this.getAllCompetenceByDomaine(state.domaine.id);
    this.getAllLieuTravail();
    this.getAllManager(state.salarie.id);
    this.getAllMaitreApprentissage(state.salarie.id);
  }

  onGetPoste(id) {
    PosteService.getPosteById(id)
      .then(response => {
        this.setState({
          currentPoste: response.data,
          currentPosteOld: response.data
        })
        this.getAllCompetenceByDomaine(this.state.currentPoste.domaine.id);
      })
      .catch(e => {
        console.log(e);
      });
  }

  getAllCompetenceByDomaine(idDomaine) {
    if (idDomaine) {
      CompetenceService.getCompetenceByIdDomaine(parseInt(idDomaine)).then((response) => {
        this.setState({ competences: response.data });
      })
        .catch((e) => { console.log(e) })
    } else {
      CompetenceService.getCompetenceByIdDomaine(0).then((response) => {
        this.setState({ competences: response.data });
      })
        .catch((e) => { console.log(e) })
    }
  }

  getAllLieuTravail() {
    EntrepriseService.getAllEntreprises()
      .then(response => {
        this.setState({
          lieuxTravail: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  getAllManager(idSalarie) {
    SalariesService.getAllSalarieByRole("MANAGER")
      .then(response => {
        this.setState({
          managers: response.data.filter((manager) => manager.id !== parseInt(idSalarie))
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  getAllMaitreApprentissage(idSalarie) {
    SalariesService.getAll()
      .then(response => {
        this.setState({
          maitresApprentissage: response.data.filter((manager) => manager.id !== parseInt(idSalarie))
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  onChangeFichierContrat(e) {
    const nomfichier = e.target.files[0].name.split(' ').join('-');
    this.setState({ nomfichier: nomfichier });
    if (e.target.files[0].type.match("application/pdf")) {
      this.setState((prevState) => ({
        currentPoste: {
          ...prevState.currentPoste,
          fichierContrat: nomfichier
        }
      }));
      this.setState({ fichierContratBrut: e.target.files[0] });
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          extensionFichier: "Seul les PDF sont acceptés.",
        }
      }));
    }
  }

  onChangeVolumeHoraire(e) {
    let Volume = null;
    if (e.target === undefined) {
      Volume = parseInt(e);
    }
    else {
      Volume = parseInt(e.target.value);
    }

    if (ifNumberWithDecimal(Volume)) {
      if (Volume > 0) {
        if (this.state.typeHoraire === "H") {
          this.setState((prevState) => ({
            currentPoste: {
              ...prevState.currentPoste,
              volumeHoraire: Volume,
              volumeJournalier: 0.0,
            },
            errors: {
              ...prevState.errors,
              volumeNeg: null,
            }
          }));
        }
        else {
          this.setState((prevState) => ({
            currentPoste: {
              ...prevState.currentPoste,
              volumeHoraire: 0.0,
              volumeJournalier: Volume,
            },
            errors: {
              ...prevState.errors,
              volumeNeg: null,
            }
          }));
        }
      }
      else {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            volumeNeg: "Le volume horaire ne doit pas être négative.",
          }
        }));
      }
    }
    else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          volumeNeg: "Le volume horaire doit être un chiffre.",
        }
      }));
    }
  }

  onChangeTypeHoraire(e) {
    const typeHoraire = e.target.value;
    //h0 j1
    if (0 !== typeHoraire.length) {
      this.setState({ typeHoraire: typeHoraire }, () => {
        this.state.currentPoste.volumeHoraire === null ? this.onChangeVolumeHoraire(this.state.currentPoste.volumeJournalier) : this.onChangeVolumeHoraire(this.state.currentPoste.volumeHoraire);
      })
    }
  }

  onChangeDate(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "dateDebut") {
      if (0 !== value.length) {
        if (compareDateStringWithDateCurrent(value)) {
          this.setState((prevState) => ({
            currentPoste: {
              ...prevState.currentPoste,
              dateDebut: value,
            },
            errors: {
              ...prevState.errors,
              dateFinInf: null,
              dateInfAujDHui: null,
              dateFinInfBool: false,
              dateInfAujDHuiBool: false,
            }
          }));
          if (this.state.currentPoste.dateFin !== null && this.state.currentPoste.dateFin < value) {
            this.setState((prevState) => ({
              errors: {
                ...prevState.errors,
                dateFinInf: "La date de fin ne doit pas être inferieur à la date de début.",
                dateFinInfBool: true,
              },
              currentPoste: {
                ...prevState.currentPoste,
                dateDebut: null,
              },
            }));
          }
        }
        else {
          this.setState((prevState) => ({
            errors: {
              ...prevState.errors,
              dateInfAujDHui: "La date ne peut pas être inferieur à aujourd'hui.",
              dateInfAujDHuiBool: true
            },
            currentPoste: {
              ...prevState.currentPoste,
              dateDebut: null,
            },
          }));
        }
      }
    }

    if (name === "dateFin") {
      if (0 !== value.length) {
        if (compareDateStringWithDateCurrent(value)) {
          this.setState((prevState) => ({
            currentPoste: {
              ...prevState.currentPoste,
              dateFin: value,
            },
            errors: {
              ...prevState.errors,
              dateFinInf: null,
              dateInfAujDHui: null,
              dateFinInfBool: false,
              dateInfAujDHuiBool: false,
            }
          }));
        } else {
          this.setState((prevState) => ({
            errors: {
              ...prevState.errors,
              dateInfAujDHui: "La date ne peut pas être inferieur à aujourd'hui.",
              dateInfAujDHuiBool: true
            },
            currentPoste: {
              ...prevState.currentPoste,
              dateFin: null,
            }
          }));
        }
        if (this.state.currentPoste.dateDebut !== null && this.state.currentPoste.dateDebut > value) {
          this.setState((prevState) => ({
            errors: {
              ...prevState.errors,
              dateFinInf: "La date de fin ne doit pas être inferieur à la date de début.",
              dateFinInfBool: true
            },
            currentPoste: {
              ...prevState.currentPoste,
              dateFin: null,
            }
          }));
        }
      }
    }
  }

  handleChangeCompetence(e) {
    //console.log(e[0].id)
    this.setState((prevState) => ({
      currentPoste: {
        ...prevState.currentPoste,
        competencesRequises: e,
      },
    }));
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "description") {
      if (null !== value) {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            description: value
          }
        }));
      }
    }

    if (name === "position") {
      if (value === "NON_CADRE" || value === "CADRE") {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            position: value
          },
          errors: {
            ...prevState.errors,
            position: null,
            positionBool: false
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            position: null
          },
          errors: {
            ...prevState.errors,
            position: "Le salarié doit être cadre ou non cadre.",
            positionBool: false
          },
        }));
      }
    }

    if (name === "coefficientTravailler") {
      if (value > 0 || value <= 100) {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            coefficientTravailler: value
          },
          errors: {
            ...prevState.errors,
            coefficientTravailler: null,
            coefficientTravaillerBool: false
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            coefficientTravailler: 0
          },
          errors: {
            ...prevState.errors,
            coefficientTravailler: "Le Coefficient travailler doit être entre 1% et 100%.",
            coefficientTravaillerBool: true
          },
        }));
      }
    }

    if (name === "lieuTravail") {
      if (0 !== value) {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            lieuTravail: {
              id: value
            }
          },
          errors: {
            ...prevState.errors,
            lieuTravail: null,
            lieuTravailBool: false
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            lieuTravail: {
              id: 0
            }
          },
          errors: {
            ...prevState.errors,
            lieuTravail: "Le lieu de travaille est obligatoire.",
            lieuTravailBool: true
          },
        }));
      }
    }

    if (name === "manager") {
      if (0 !== value) {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            manager: {
              id: value
            }
          },
          errors: {
            ...prevState.errors,
            manager: null,
            managerBool: false
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            manager: {
              id: 0
            }
          },
          errors: {
            ...prevState.errors,
            manager: "Le manager est obligatoire.",
            managerBool: true
          },
        }));
      }
    }

    if (name === "maitreApprentissage") {
      if (0 !== value) {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            maitreApprentissage: {
              id: value
            }
          }
        }));
      } else {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            maitreApprentissage: {
              id: 0
            }
          }
        }));
      }
    }

    if (name === "remunerationBrut") {
      if (parseInt(value) > 0) {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            remunerationBrut: value
          },
          errors: {
            ...prevState.errors,
            remunerationBrut: null,
            remunerationBrutBool: false
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            remunerationBrut: 0
          },
          errors: {
            ...prevState.errors,
            remunerationBrut: "La rémunération brut en € est obligatoire.",
            remunerationBrutBool: true
          },
        }));
      }
    }

    if (name === "coefficient") {
      if (parseInt(value) > 0) {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            coefficient: value
          },
          errors: {
            ...prevState.errors,
            coefficient: null,
            coefficientBool: false
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            coefficient: 0
          },
          errors: {
            ...prevState.errors,
            coefficient: "Le coéfficient est obligatoire.",
            coefficientBool: true
          },
        }));
      }
    }

    if (name === "dureePeriodeEssaie") {
      if (value > 0) {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            dureePeriodeEssaie: value,
          }
        }));
      } else {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            dureePeriodeEssaie: 0
          },
          errors: {
            ...prevState.errors,
            dureePeriodeEssaie: "La période d'essai doit être au moins d'un jour.",
            dureePeriodeEssaieBool: true
          },
        }));
      }
    }

    if (name === "debutFormation") {
      this.setState((prevState) => ({
        currentPoste: {
          ...prevState.currentPoste,
          debutFormation: value,
        },
        errors: {
          ...prevState,
          debutFormation: null,
          debutFormationBool: false,
        }
      }));
      if (!compareDateHighestOrEqualDateCurrent(value)) {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            debutFormation: "La formation ne peut pas débuter avant aujourd'hui",
            debutFormationBool: true,
          }
        }));
      }
      else if (compareTwoDateString(value, this.state.currentPoste.finFormation) === "+") {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            debutFormation: "La date de début doit être inférieur à la date de fin",
            debutFormationBool: true,
          }
        }));
      }
    }

    if (name === "finFormation") {
      this.setState((prevState) => ({
        currentPoste: {
          ...prevState.currentPoste,
          finFormation: value,
        },
        errors: {
          ...prevState,
          finFormation: null,
          finFormationBool: false,
        }
      }));
      if (compareTwoDateString(value, this.state.currentPoste.debutFormation) !== "+") {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            finFormation: "La date de fin doit être supérieur à la date de début",
            finFormationBool: true,
          }
        }));
      }
    }


  }

  validationForm() {
    const errors = this.state.errors;
    if (errors.dateFinInfBool &&
      errors.volumeNegBool &&
      errors.extensionFichierBool &&
      errors.dateInfAujDHuiBool &&
      errors.contratObligatoireBool &&
      errors.remunerationBrutBool &&
      errors.coefficientBool &&
      errors.positionBool &&
      errors.coefficientTravaillerBool &&
      errors.lieuTravailBool &&
      errors.managerBool) {
      return true;
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          dateFinInf: errors.dateFinInfBool ? null : "La date de fin ne doit pas être inferieur à la date de début.",
          volumeNeg: errors.volumeNegBool ? null : "Le volume horaire ne doit pas être négative et être un chiffre.",
          extensionFichier: errors.extensionFichierBool ? null : "Le fichier doit avoir une extension .pdf.",
          dateInfAujDHui: errors.dateInfAujDHuiBool ? null : "La date de fin doit être superieur à aujourd'hui.",
          intitulePoste: errors.intitulePosteBool ? null : "L'intitulé du poste est obligatoire.",
          remunerationBrut: errors.remunerationBrutBool ? null : "La rémunération brut en € est obligatoire.",
          coefficient: errors.coefficientBool ? null : "Le coéfficient est obligatoire.",
          position: errors.positionBool ? null : "Le salarié doit être cadre ou non cadre.",
          coefficientTravailler: errors.coefficientTravaillerBool ? null : "Le Coefficient travailler doit être entre 1% et 100%.",
          lieuTravail: errors.lieuTravailBool ? null : "Le lieu de travaille est obligatoire.",
          manager: errors.managerBool ? null : "Le manager est obligatoire.",
        }
      }));
      return false;
    }
  }

  uploadFile(fichier, idSalarie, idPoste) {
    const formData = new FormData();
    let infosalarie = null;
    SalariesService.getSalarieById(idSalarie)
      .then(response => {
        infosalarie = response.data;
        const nomfichier = "contrat_" + infosalarie.nom + "_" + infosalarie.prenom + "_" + idPoste + ".pdf";

        formData.append('file', fichier);
        formData.append('name', nomfichier);
        formData.append('idPoste', idPoste);

        //formData.name = "contrat_"+infosalarie.nom+"_"+infosalarie.prenom+"_"+idPoste+".pdf";
        PosteService.uploadFile(formData)
          .catch((e) => {
            console.log("erreur file : ", e);
          });
      })
      .catch(e => {
        console.log(e);
      });
  }

  updatePoste(e) {
    e.preventDefault();
    const json = JSON.stringify(this.state.currentPoste).split('"value":').join('"id":');
    const data = JSON.parse(json);
    const formData = new FormData();
    formData.append('contrat', this.state.fichierContratBrut);
    if (this.validationForm()) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          erreur: null,
        },
        loading: true
      }));
      if (this.state.fichierContratBrut) {
        PosteService.updatePoste(data).then((resp) => {
          //titre : contrat_nom_prenom_idPoste.pdf
          this.uploadFile(this.state.fichierContratBrut, resp.data.salarie.id, resp.data.id);
          this.props.history.push("/salaries/dossiers-personnel/" + resp.data.salarie.id);
          this.setState({ loading: false })
        }).catch((e) => {
          console.log("erreur update avec contrat: ", e);
          this.setState({ loading: false });
        })
      } else {
        PosteService.updatePoste(data).then((resp) => {
          console.log("resp update : ", resp.data)
          this.props.history.push("/salaries/dossiers-personnel/" + this.state.currentPoste.salarie.id);
          this.setState({ loading: false })
        }).catch((e) => {
          console.log("erreur update sans contrat : ", e);
          this.setState({ loading: false })
        })
      }
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          erreur: "Erreur dans le formulaire.",
        }
      }));
    }
  }

  render() {
    const { lieuxTravail, managers, competences, maitresApprentissage, currentPoste, nomfichier, errors, loading } = this.state;
    return (
      <>
        <form name="updatePoste" onSubmit={this.updatePoste} >
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="salarie">Salarié : {currentPoste.salarie.nom + " " + currentPoste.salarie.prenom}</label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col mt-1">
              <label htmlFor="domainePoste">Service du poste *</label>
              <CSelect custom name="domainePoste" id="domainePoste" required disabled>
                {currentPoste.domaine !== null ?
                  <option value={currentPoste.domaine.id}>
                    {currentPoste.domaine.titre}
                  </option> : <option>Pas de Service pour ce poste</option>}
              </CSelect>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea className="form-control" id="description" rows="3" onChange={this.handleChange} value={currentPoste.description !== null ? currentPoste.description : ""} placeholder="Fiche du poste."></textarea>
          </div>
          <div className="row">
            <div className="col mt-1">
              <label htmlFor="competences">Compétences</label>
              <Select
                name="competences"
                id="competences"
                placeholder="Liste des compétences"
                value={
                  currentPoste.competencesRequises === null
                    ? ""
                    : currentPoste.competencesRequises
                }
                getOptionLabel={(option) => option.nom}
                getOptionValue={(option) => option.id}
                options={competences.map((e) => ({ nom: e.nom, id: e.id }))}
                onChange={this.handleChangeCompetence}
                isMulti
              />
            </div>
          </div>
          <div className="row">
            <div className="col mt-1">
              <label htmlFor="typeContrat">Type de contrat *</label>
              <CSelect custom name="typeContrat" id="typeContrat" disabled required>
                {currentPoste.typeContrat !== null ? <option value={currentPoste.typeContrat.id}>
                  {currentPoste.typeContrat.type}
                </option> : <option>Pas de type de contrat pour se poste</option>}
              </CSelect>
            </div>
            <div className="col mt-1">
              <label htmlFor="titrePoste">Intitulé de poste *</label>
              <CSelect custom name="titrePoste" id="titrePoste" disabled required>
                {currentPoste.titrePoste !== null ? <option value={currentPoste.titrePoste.id}>
                  {currentPoste.titrePoste.intitule}
                </option> : <option>Pas d'intitulé pour se poste</option>}
              </CSelect>
            </div>
          </div>
          <div className="row">
            <div className="col mt-1">
              <label htmlFor="remunerationBrut">Rémunération Brut (€) *</label>
              <input type="number" className="form-control" id="remunerationBrut" name="remunerationBrut" onChange={this.handleChange} min={0} value={currentPoste.remunerationBrut} pattern="[0-9]*" required />
              <span className="text-danger">{errors.remunerationBrut}</span>
            </div>
            <div className="col mt-1">
              <label htmlFor="coefficient">Coefficient *</label>
              <input type="number" className="form-control" id="coefficient" name="coefficient" onChange={this.handleChange} min={0} value={currentPoste.coefficient} pattern="[0-9]*" required />
              <span className="text-danger">{errors.coefficient}</span>
            </div>
          </div>
          <div className="row">
            <div className="col mt-1">
              <label htmlFor="position">Position *</label>
              <CSelect custom name="position" id="position" onChange={this.handleChange} required
                value={
                  currentPoste.position === null
                    ? 0
                    : currentPoste.position
                }>
                <option value="0">Veuillez sélectionner une position</option>
                <option value="CADRE">Cadre</option>
                <option value="NON_CADRE">Non cadre</option>
              </CSelect>
              <span className="text-danger">{errors.position}</span>
            </div>
            <div className="col mt-1">
              <label htmlFor="coefficientTravailler">Coefficient travailler (%) *</label>
              <input type="number" className="form-control" id="coefficientTravailler" name="coefficientTravailler" onChange={this.handleChange} min={0} max={100} value={currentPoste.coefficientTravailler} pattern="[0-9]*" step={10} required />
              <span className="text-danger">{errors.coefficientTravailler}</span>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label htmlFor="dateDebut">Période d'essaie (jours) *</label>
              <input type="number" className="form-control" id="dureePeriodeEssaie" name="dureePeriodeEssaie" onChange={this.handleChange} min={0} value={currentPoste.dureePeriodeEssaie} required />
              <span className="text-danger">{errors.dureePeriodeEssaie}</span>
            </div>
          </div>
          <div className="row">
            <div className="col mt-1">
              <label htmlFor="dateDebut">Date de début *</label>
              <input type="date" className="form-control" id="dateDebut" onChange={this.onChangeDate} required
                value={
                  currentPoste.dateDebut === null
                    ? ""
                    : currentPoste.dateDebut
                } />
            </div>
            <div className="col mt-1">
              <label htmlFor="dateFin">Date de fin</label>
              <input type="date" className="form-control" id="dateFin" onChange={this.onChangeDate}
                value={
                  currentPoste.dateFin === null
                    ? ""
                    : currentPoste.dateFin
                }
              />
            </div>
          </div>
          <div className="col">
            <span className="text-danger row">{errors.dateFinInf}</span>
            <span className="text-danger row">{errors.dateInfAujDHui}</span>
          </div>
          {currentPoste.typeContrat.id === 3 || currentPoste.typeContrat.id === 4 ? <div className="row" id="dateFormation" >
            <div className="col">
              <label htmlFor="debutFormation">Date de début de formation *</label>
              <input type="date" className="form-control" id="debutFormation" name="debutFormation" onChange={this.handleChange} value={currentPoste.debutFormation} />
              <span className="text-danger">{errors.debutFormation}</span>
            </div>
            <div className="col">
              <label htmlFor="finFormation">Date de fin de formation *</label>
              <input type="date" className="form-control" id="finFormation" name="finFormation" onChange={this.handleChange} value={currentPoste.finFormation} />
              <span className="text-danger">{errors.finFormation}</span>
            </div>
          </div> : null}
          <div className="row">
            <div className="col mt-1">
              <label htmlFor="dateDebut">Volume horaire *</label>
              <input type="number" className="form-control" id="volumeHoraire" onChange={this.onChangeVolumeHoraire} min={0} pattern="[0-9]*" required
                value={
                  currentPoste.volumeHoraire === null || currentPoste.volumeHoraire === 0
                    ? currentPoste.volumeJournalier === null || currentPoste.volumeJournalier === 0 ? "" : currentPoste.volumeJournalier
                    : currentPoste.volumeHoraire
                }
              />
              <div className="form-check form-check-inline">
                <input type="radio" value="J" name="typeHoraire" id="typeHoraireJ" className="form-check-input" required checked={currentPoste.volumeJournalier !== 0} onChange={this.onChangeTypeHoraire} />
                <label className="form-check-label" htmlFor="typeHoraireJ">
                  Jour
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input type="radio" value="H" name="typeHoraire" id="typeHoraireH" className="form-check-input" required checked={currentPoste.volumeHoraire !== 0} onChange={this.onChangeTypeHoraire} />
                <label className="form-check-label" htmlFor="typeHoraireH">
                  Heure
                </label>
              </div>
              <span className="text-danger">{errors.volumeNeg}</span>
            </div>
            <div className="col mt-1">
              <label htmlFor="lieuTravail">Lieu de travail *</label>
              <CSelect custom name="lieuTravail" id="lieuTravail" onChange={this.handleChange} required
                value={
                  currentPoste.lieuTravail.id === null
                    ? 0
                    : currentPoste.lieuTravail.id
                }
              >
                {lieuxTravail !== null ? lieuxTravail.map((lieuTravail, key) => (
                  <option key={key} value={lieuTravail.id}>
                    {lieuTravail.nom}
                  </option>
                )) : <option>Pas d'entreprise enregistrée</option>}
              </CSelect>
              <span className="text-danger">{errors.lieuTravail}</span>
            </div>
          </div>
          <div className="row">
            <div className="col mt-1">
              <label htmlFor="manager">Manager</label>
              <CSelect custom name="manager" id="manager" onChange={this.handleChange} required
                value={
                  currentPoste.manager !== null && (currentPoste.manager.id === null
                    ? 0
                    : currentPoste.manager.id)
                }
              >
                <option value="0">Veuillez sélectionner un Manageur</option>
                {managers !== null ? managers.map((manager, key) => (
                  <option key={key} value={manager.id}>
                    {manager.nom + " " + manager.prenom}
                  </option>
                )) : <option>Pas de manager enregistré</option>}
              </CSelect>
              <span className="text-danger">{errors.manager}</span>
            </div>
            <div className="col mt-1">
              {currentPoste.typeContrat.id === 3 || currentPoste.typeContrat.id === 4 ?
                <div>
                  <label htmlFor="maitreApprentissage">Maitre d'apprentissage</label>
                  <CSelect custom name="maitreApprentissage" id="maitreApprentissage" onChange={this.handleChange} required
                    value={
                      currentPoste.maitreApprentissage !== null && (currentPoste.maitreApprentissage.id === null
                        ? 0
                        : currentPoste.maitreApprentissage.id)
                    }
                  >
                    <option value="0">Veuillez sélectionner un maitre d'apprentissage</option>
                    {maitresApprentissage !== null ? maitresApprentissage.map((maitreApprentissage, key) => (
                      <option key={key} value={maitreApprentissage.id}>
                        {maitreApprentissage.nom + " " + maitreApprentissage.prenom}
                      </option>
                    )) : <option>Pas de maitre d'apprentissage</option>}
                  </CSelect>
                </div> : null
              }
            </div>
          </div>
          <div className="mt-2">
            <CFormGroup row>
              <CLabel col md={1}>Contrat (PDF) *</CLabel>
              <CCol xs="12" md={10}>
                <CInputFile custom id="custom-file-input" onChange={this.onChangeFichierContrat} accept="application/pdf" />
                <CLabel htmlFor="custom-file-input" id="contrat" name="contrat" variant="custom-file">
                  {nomfichier}
                </CLabel>
              </CCol>
            </CFormGroup>
          </div>
          <div className="col">
            <span className="text-danger row">{errors.extensionFichier}</span>
            <span className="text-danger row">{errors.contratObligatoire}</span>
          </div>
          <div className="mt-1">
            <CButton type="submit" block color="info" disabled={loading}>
              {loading && <CSpinner size="sm" variant="border" />} Modfier le poste
            </CButton>
            <Link to={"/salaries/dossiers-personnel/" + currentPoste.salarie.id} className="withoutUnderlane">
              <CButton className="mt-1" block color="danger" title="Vous voulez annuler ?">
                Annuler
              </CButton>
            </Link>
            <span className="text-danger">{errors.erreur}</span>
          </div>
        </form>
      </>
    )
  }
}
export default withRouter(UpdatePoste);
