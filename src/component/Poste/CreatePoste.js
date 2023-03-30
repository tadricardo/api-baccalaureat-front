import { CButton, CSelect, CFormGroup, CLabel, CCol, CInputFile, CSpinner } from '@coreui/react';
import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import SalariesService from "../../services/salaries.service";
import TitrePosteService from "../../services/titre-poste.service";
import PosteService from "../../services/poste.service";
import CompetenceService from "../../services/competence.service";
import TypeContratService from "../../services/type-contrat.service";
import EntrepriseService from "../../services/entreprises.service";
import DomainesService from "../../services/service.service";
import Select from 'react-select';
import swal from 'sweetalert';
import { compareDateHighestOrEqualDateCurrent, compareDateStringWithDateCurrent, compareTwoDateString, ifNumberWithDecimal } from "src/utils/fonctions";

class CreatePoste extends Component {
  constructor(props) {
    super(props);


    this.getTitrePosteByDomaine = this.getTitrePosteByDomaine.bind(this);
    this.getAllTypeContrat = this.getAllTypeContrat.bind(this);
    this.onChangeVolumeHoraire = this.onChangeVolumeHoraire.bind(this);
    this.onChangeTypeHoraire = this.onChangeTypeHoraire.bind(this);
    this.getAllLieuTravail = this.getAllLieuTravail.bind(this);
    this.getAllCompetenceByDomaine = this.getAllCompetenceByDomaine.bind(this);
    this.onChangeFichierContrat = this.onChangeFichierContrat.bind(this);
    this.ifSAlariePoste = this.ifSAlariePoste.bind(this);
    this.savePoste = this.savePoste.bind(this);
    this.getAllDomaine = this.getAllDomaine.bind(this);
    this.handleChangeCompetence = this.handleChangeCompetence.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);

    this.state = {
      errors: {
        dateFinInf: null, dateFinInfBool: false,
        volumeNeg: null, volumeNegBool: false,
        extensionFichier: null, extensionFichierBool: false,
        dateInfAujDHui: null, dateInfAujDHuiBool: false,
        salarieAcPoste: null,
        contratObligatoire: null, contratObligatoireBool: false,
        typeContrat: null, typeContratBool: false,
        intitulePoste: null, intitulePosteBool: false,
        remunerationBrut: null, remunerationBrutBool: false,
        coefficient: null, coefficientBool: false,
        position: null, positionBool: false,
        coefficientTravailler: null, coefficientTravaillerBool: false,
        lieuTravail: null, lieuTravailBool: false,
        manager: null, managerBool: false,
        maitreApprentissage: null, maitreApprentissageBool: false,
        debutFormation: null, debutFormationBool: false,
        finFormation: null, finFormationBool: false,
        dureePeriodeEssaie: null, dureePeriodeEssaieBool: false,
        erreur: null,
      },
      loading: false,
      currentSalarie: {
        id: null,
        nom: null,
        prenom: null,
      },
      nomfichier: "Inserer le contrat (PDF)",
      domaines: [],
      domainePoste: null,
      titresPoste: [],
      typesContrat: [],
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
        competencesRequises: null,
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
      }
    };
  }

  componentDidMount() {
    this.setState({ currentSalarie: this.props.location.component })
    this.setState((prevState) => ({ currentPoste: { ...prevState.currentPoste, salarie: { id: this.props.location.component.id, } } }));
    if (this.props.location.component === undefined)
      this.props.history.push("/home");
    this.getAllDomaine();
    this.getAllTypeContrat();
    this.getAllLieuTravail();
    this.getAllManager(this.props.location.component.id);
    this.getAllMaitreApprentissage(this.props.location.component.id);
  }

  getTitrePosteByDomaine(idDomaines) {
    TitrePosteService.getTitrePosteByIdDomaine(idDomaines)
      .then(response => {
        this.setState({
          titresPoste: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  getAllDomaine() {
    DomainesService.getAllService()
      .then(response => {
        this.setState({
          domaines: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }


  getAllTypeContrat() {
    TypeContratService.getAllTypeContrat()
      .then(response => {
        this.setState({
          typesContrat: response.data
        });
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

    if (name === "domainePoste") {
      if ("0" !== value) {
        document.getElementById('bodyFormPoste').className = "";
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            domaine: {
              id: value
            },
            titrePoste: {
              id: null
            },
          }
        }), () => {
          this.getAllCompetenceByDomaine(value);
          this.getTitrePosteByDomaine(value);
          document.getElementById('titrePoste').getElementsByTagName('option')[0].selected = 'selected';
        })
      } else {
        document.getElementById('bodyFormPoste').className = "d-none";
        this.setState({
          currentPoste: {
            competences: null,
            salarie: null,
            domaine: null,
          }
        });
      }
    }

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

    if (name === "typeContrat") {
      if (0 !== value) {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            typeContrat: {
              id: value
            }
          },
          errors: {
            ...prevState.errors,
            typeContrat: null,
            typeContratBool: false
          },
        }));
        //CDI 
        if (parseInt(value) === 1) {
          document.getElementById("dateFin").className = "col invisible d-none";
          this.setState((prevState) => ({
            currentPoste: {
              ...prevState.currentPoste,
              dateFin: null,
            },
            errors: {
              ...prevState.errors,
              typeContrat: null,
              typeContratBool: false
            },
          }));
        }
        else {
          document.getElementById("dateFin").className = "col visible d-block";
        }
        //SI PAS APPRENTISSAGE || CONTRAT_PRO 
        if (parseInt(value) === 1 || parseInt(value) === 2) {
          document.getElementById("maitreApprentissage").className = "col invisible d-none";
          document.getElementById("dateFormation").className = "row invisible d-none";
          this.setState((prevState) => ({
            currentPoste: {
              ...prevState.currentPoste,
              maitreApprentissage: {
                id: null
              }
            }
          }));
        } else {
          document.getElementById("maitreApprentissage").className = "col visible d-block";
          document.getElementById("dateFormation").className = "row visible d-flex";
        }
      } else {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            typeContrat: {
              id: 0
            }
          },
          errors: {
            ...prevState.errors,
            typeContrat: "Le type de contrat est obligatoire.",
            typeContratBool: true
          },
        }));
      }
    }

    if (name === "titrePoste") {
      if (0 !== value) {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            titrePoste: {
              id: value
            }
          },
          errors: {
            ...prevState.errors,
            intitulePoste: null,
            intitulePosteBool: false
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            titrePoste: {
              id: null
            },
            errors: {
              ...prevState.errors,
              intitulePoste: "L'intitulé du poste est obligatoire.",
              intitulePosteBool: true
            },
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
          },
          errors: {
            ...prevState.errors,
            dureePeriodeEssaie: null,
            dureePeriodeEssaieBool: false
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentPoste: {
            ...prevState.currentPoste,
            dureePeriodeEssaie: 0
          },
          errors: {
            ...prevState.errors,
            dureePeriodeEssaie: "La période d'essai doit être au moins d'un mois.",
            dureePeriodeEssaieBool: true
          },
        }));
      }
    }

    if (name === "debutFormation") {
      if (null !== value) {
        if (compareDateHighestOrEqualDateCurrent(value)) {
          if (compareTwoDateString(this.state.debutFormation, this.state.finFormation) !== "+") {
            this.setState((prevState) => ({
              currentPoste: {
                ...prevState.currentPoste,
                debutFormation: value
              },
              errors: {
                ...prevState.errors,
                debutFormation: null,
                debutFormationBool: false
              },
            }));
          } else {
            this.setState((prevState) => ({
              currentPoste: {
                ...prevState.currentPoste,
                debutFormation: null
              },
              errors: {
                ...prevState.errors,
                debutFormation: "La date de début doit être inferieur ou égale à la date de fin.",
                debutFormationBool: true
              },
            }));
          }
        } else {
          this.setState((prevState) => ({
            currentPoste: {
              ...prevState.currentPoste,
              debutFormation: null
            },
            errors: {
              ...prevState.errors,
              debutFormation: "La date doit être superieur ou egal à aujourd'hui.",
              debutFormationBool: true
            },
          }));
        }
      }
    }

    if (name === "finFormation") {
      if (null !== value) {
        if (compareDateHighestOrEqualDateCurrent(value)) {
          if (compareTwoDateString(this.state.debutFormation, this.state.finFormation) !== "+") {
            this.setState((prevState) => ({
              currentPoste: {
                ...prevState.currentPoste,
                finFormation: value
              },
              errors: {
                ...prevState.errors,
                finFormation: null,
                finFormationBool: false
              },
            }));
          } else {
            this.setState((prevState) => ({
              currentPoste: {
                ...prevState.currentPoste,
                debutFormation: null
              },
              errors: {
                ...prevState.errors,
                debutFormation: "La date de fin doit être superieur ou égale à la date de début.",
                debutFormationBool: true
              },
            }));
          }
        } else {
          this.setState((prevState) => ({
            currentPoste: {
              ...prevState.currentPoste,
              debutFormation: null
            },
            errors: {
              ...prevState.errors,
              debutFormation: "La date doit être superieur ou egal à aujourd'hui.",
              debutFormationBool: true
            },
          }));
        }
      }
    }
  }

  onChangeVolumeHoraire(e) {
    let Volume = null;

    if (e.target === undefined)
      Volume = parseInt(e);
    else
      Volume = parseInt(e.target.value);

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
              volumeNegBool: false,
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
              volumeNegBool: false,
            }
          }));
        }
      } else {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            volumeNeg: "Le volume horaire ne doit pas être négative.",
            volumeNegBool: true,
          }
        }));
      }
    }
    else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          volumeNeg: "Le volume horaire doit être un chiffre.",
          volumeNegBool: true,
        }
      }));
    }
  }

  onChangeTypeHoraire(e) {
    const typeHoraire = e.target.value;
    //h0 j1
    if (0 !== typeHoraire.length) {
      this.setState({ typeHoraire: typeHoraire }, () => {
        this.state.currentPoste.volumeHoraire === 0 ? this.onChangeVolumeHoraire(this.state.currentPoste.volumeJournalier) : this.onChangeVolumeHoraire(this.state.currentPoste.volumeHoraire);
      })
    }
  }

  onChangeFichierContrat(e) {
    const nomfichier = e.target.files[0].name.split(' ').join('-');
    this.setState({ nomfichier: nomfichier });
    if (e.target.files[0].type.match("application/pdf")) {
      this.setState((prevState) => ({
        currentPoste: {
          ...prevState.currentPoste,
          fichierContrat: nomfichier
        },
        errors: {
          ...prevState.errors,
          extensionFichier: null,
          extensionFichierBool: false,
        }
      }));
      this.setState({ fichierContratBrut: e.target.files[0] });
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          extensionFichier: "Seul les PDF sont acceptés.",
          extensionFichierBool: true,
        }
      }));
    }
  }

  validationForm() {
    const errors = this.state.errors;
    if (!errors.dateFinInfBool &&
      !errors.volumeNegBool &&
      !errors.extensionFichierBool &&
      !errors.dateInfAujDHuiBool &&
      !errors.contratObligatoireBool &&
      !errors.typeContratBool &&
      !errors.intitulePosteBool &&
      !errors.remunerationBrutBool &&
      !errors.coefficientBool &&
      !errors.positionBool &&
      !errors.coefficientTravaillerBool &&
      !errors.lieuTravailBool &&
      !errors.managerBool &&
      !errors.dureePeriodeEssaieBool &&
      !(errors.debutFormationBool && (this.state.currentPoste.typeContrat.id === "3" || this.state.currentPoste.typeContrat.id === "4")) &&
      !(errors.finFormationBool && (this.state.currentPoste.typeContrat.id === "3" || this.state.currentPoste.typeContrat.id === "4")) &&
      !(errors.maitreApprentissageBool && (this.state.currentPoste.typeContrat.id === "3" || this.state.currentPoste.typeContrat.id === "4"))) {
      return true;
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          dateFinInf: errors.dateFinInfBool ? "La date de fin ne doit pas être inferieur à la date de début." : null,
          volumeNeg: errors.volumeNegBool ? "Le volume horaire ne doit pas être négative et être un chiffre." : null,
          extensionFichier: errors.extensionFichierBool ? "Le fichier doit avoir une extension .pdf." : null,
          dateInfAujDHui: errors.dateInfAujDHuiBool ? "La date de fin doit être superieur à aujourd'hui." : null,
          contratObligatoire: errors.contratObligatoireBool ? "Le contrat est olbigatoire." : null,
          typeContrat: errors.typeContratBool ? "Le type de contrat est obligatoire." : null,
          intitulePoste: errors.intitulePosteBool ? "L'intitulé du poste est obligatoire." : null,
          remunerationBrut: errors.remunerationBrutBool ? "La rémunération brut en € est obligatoire." : null,
          coefficient: errors.coefficientBool ? "Le coéfficient est obligatoire." : null,
          position: errors.positionBool ? "Le salarié doit être cadre ou non cadre." : null,
          coefficientTravailler: errors.coefficientTravaillerBool ? "Le Coefficient travailler doit être entre 1% et 100%." : null,
          lieuTravail: errors.lieuTravailBool ? "Le lieu de travaille est obligatoire." : null,
          manager: errors.managerBool ? "Le manager est obligatoire." : null,
          dureePeriodeEssaie: errors.dureePeriodeEssaieBool ? "La période d'essai est obligatoire." : null,
          maitreApprentissage: errors.maitreApprentissageBool ? "Le maitre d'apprentissage est obligatoire." : null,
        }
      }));
      return false;
    }
  }

  uploadFile(fichier, idPoste) {
    const formData = new FormData();
    let nomfichier = "contrat_" + this.state.currentSalarie.nom + "_" + this.state.currentSalarie.prenom + "_" + idPoste + ".pdf";
    nomfichier = nomfichier.replace(" ", "-");

    formData.append('file', fichier);
    formData.append('name', nomfichier);
    formData.append('idPoste', idPoste);
    PosteService.uploadFile(formData)
      .then((response) => {
        this.props.history.push("/salaries/profil/" + this.state.currentSalarie.id);
      })
      .catch((e) => {
        console.log("erreur file : ", e);
      });
  }

  ifSAlariePoste(idsalarie) {
    if (idsalarie !== "0") {
      if (this.state.currentSalarie.postes.length === 0) {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            salarieAcPoste: null,
          }
        }));
        return false; //n'a pas de poste
      }
      else {
        if (compareDateStringWithDateCurrent(this.state.currentSalarie.postes[0].dateFin) || this.state.currentSalarie.postes[0].dateFin === null) {
          this.setState((prevState) => ({
            errors: {
              ...prevState.errors,
              salarieAcPoste: "Le salarié à un poste en cours",
            }
          }));
          return true; //a un poste
        } else {
          this.setState((prevState) => ({
            errors: {
              ...prevState.errors,
              salarieAcPoste: null,
            }
          }));
        }
      }
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          salarieAcPoste: null,
        }
      }));
      return false; //n'a pas de poste
    }
  }

  savePoste(e) {
    e.preventDefault();
    if (this.state.fichierContratBrut !== null) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          contratObligatoire: null,
          contratObligatoireBool: false,
        },
        loading: true
      }));
      if (this.validationForm()) {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            erreur: null,
          }
        }));
        if (this.ifSAlariePoste(this.state.currentPoste.salarie.id)) {
          swal({
            title: "Êtes-vous sûre ?",
            text: this.state.currentSalarie.nom + " " + this.state.currentSalarie.prenom + " à déjà un poste. \nVoulez-vous cloturer se poste '" + this.state.currentSalarie.postes[0].titrePoste.intitule + "' pour créer celui-ci ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
            .then((willDelete) => {
              if (willDelete) {
                PosteService.cloturerPoste(this.state.currentSalarie.postes[0].id, this.state.currentPoste.dateDebut).then(resp => {
                  swal("Le poste '" + this.state.currentSalarie.postes[0].titrePoste.intitule + "' à bien été cloturé.", {
                    icon: "success",
                  });
                  this.setState({ loading: true })
                  const json = JSON.stringify(this.state.currentPoste).split('"value":').join('"id":');
                  const data = JSON.parse(json);
                  /* const formData = new FormData();
                   formData.append('file', this.state.fichierContratBrut);
                   formData.append('poste', data);*/
                  PosteService.savePoste(data).then((resp) => {
                    //PosteService.savePosteWithContratPDF(formData).then((resp) => {
                    //titre : contrat_nom_prenom_idPoste.pdf
                    this.uploadFile(this.state.fichierContratBrut, resp.data.id);
                    //this.props.history.push("/salaries/profil/" + this.state.currentSalarie.id);
                  }).catch((e) => { console.log(e) })
                }).catch((e) => {
                  this.setState({ loading: true })
                  swal("Erreur : " + e.message, {
                    icon: "error",
                  });
                })
              } else {
                swal("Le poste '" + this.state.currentSalarie.postes[0].titrePoste.intitule + "' n'à pas été cloturé.");

              }
            });
        } else {
          const json = JSON.stringify(this.state.currentPoste).split('"value":').join('"id":');
          const data = JSON.parse(json);

          /*const formData = new FormData();
          formData.append('contrat', this.state.fichierContratBrut);
      //const formData = new FormData();
          /*formData.append('contrat', this.state.fichierContratBrut);
 organismeDeFormation
          formData.append('poste', data);
          console.log("formData : ", formData)*/
          PosteService.savePoste(data).then((resp) => {
            //PosteService.savePosteWithContratPDF(formData).then((resp) => {
            //titre : contrat_nom_prenom_idPoste.pdf
            this.uploadFile(this.state.fichierContratBrut, resp.data.id);
            //this.props.history.push("/salaries/profil/" + this.state.currentSalarie.id);
          }).catch((e) => { console.log(e) })

        }
      } else {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            erreur: "Erreur dans le formulaire.",
          },
          loading: false
        }));
      }
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          contratObligatoire: "Le contrat est olbigatoire.",
          contratObligatoireBool: true,
        }
      }));
    }
  }

  render() {
    const { titresPoste, typesContrat, lieuxTravail, managers, competences, maitresApprentissage, domaines, nomfichier, currentSalarie, errors, loading } = this.state;
    return (
      <>
        <form name="createPoste" className="submit-form" onSubmit={this.savePoste}>
          <div className="row">
            <div className="col">
              <label htmlFor="salarie">Salarié : {" " + currentSalarie.nom + " " + currentSalarie.prenom}</label>
            </div>
          </div>
          <div className="row">
            <span className="text-warning col">{errors.salarieAcPoste}</span>
          </div>
          <div className="row">
            <div className="col mt-1">
              <label htmlFor="domainePoste">Service du poste *</label>
              <CSelect custom name="domainePoste" id="domainePoste" onChange={this.handleChange} required>
                <option value="0">Veuillez sélectionner un Service</option>
                {domaines.map((domaine, key) => (
                  <option key={key} value={domaine.id}>
                    {domaine.titre}
                  </option>
                ))}
              </CSelect>
            </div>
          </div>
          <div id="bodyFormPoste" className="d-none">
            <label htmlFor="description" className="mt-1">Description</label>
            <textarea className="form-control" id="description" name="description" rows="3" onChange={this.handleChange} placeholder="Fiche du poste."></textarea>
            <div className="row">
              <div className="col mt-1">
                <label htmlFor="competences">Compétences</label>
                <Select
                  name="competences"
                  id="competences"
                  placeholder="Liste des compétences"
                  value={this.state.currentPoste.competencesRequises}
                  options={competences.map((e) => ({ label: e.nom, value: e.id }))}
                  onChange={this.handleChangeCompetence}
                  isMulti
                />
              </div>
            </div>
            <div className="row">
              <div className="col mt-1">
                <label htmlFor="typeContrat">Type de contrat *</label>
                <CSelect custom name="typeContrat" id="typeContrat" onChange={this.handleChange} required>
                  <option value="0">Veuillez sélectionner un type de contrat</option>
                  {typesContrat.map((typeContrat, key) => (
                    <option key={key} value={typeContrat.id}>
                      {typeContrat.type}
                    </option>
                  ))}
                </CSelect>
                <span className="text-danger">{errors.typeContrat}</span>
              </div>
              <div className="col mt-1">
                <label htmlFor="titrePoste">Intitulé de poste *</label>
                <CSelect custom name="titrePoste" id="titrePoste" onChange={this.handleChange} required>
                  <option value="0">Veuillez sélectionner un intitulé de poste</option>
                  {titresPoste != null ? titresPoste.map((titrePoste, key) => (
                    <option key={key} value={titrePoste.id}>
                      {titrePoste.intitule}
                    </option>
                  )) : <option>Pas d'intitulé de poste</option>}
                </CSelect>
                <span className="text-danger">{errors.intitulePoste}</span>
              </div>
            </div>
            <div className="row">
              <div className="col mt-1">
                <label htmlFor="remunerationBrut">Rémunération Brut (€) *</label>
                <input type="number" className="form-control" id="remunerationBrut" name="remunerationBrut" onChange={this.handleChange} min={0} defaultValue={0} pattern="[0-9]*" required />
                <span className="text-danger">{errors.remunerationBrut}</span>
              </div>
              <div className="col mt-1">
                <label htmlFor="coefficient">Coefficient *</label>
                <input type="number" className="form-control" id="coefficient" name="coefficient" onChange={this.handleChange} min={0} defaultValue={0} pattern="[0-9]*" required />
                <span className="text-danger">{errors.coefficient}</span>
              </div>
            </div>
            <div className="row">
              <div className="col mt-1">
                <label htmlFor="position">Position *</label>
                <CSelect custom name="position" id="position" onChange={this.handleChange} required>
                  <option value="0">Veuillez sélectionner une position</option>
                  <option value="CADRE">Cadre</option>
                  <option value="NON_CADRE">Non cadre</option>
                </CSelect>
                <span className="text-danger">{errors.position}</span>
              </div>
              <div className="col mt-1">
                <label htmlFor="coefficientTravailler">Coefficient travailler (%) *</label>
                <input type="number" className="form-control" id="coefficientTravailler" name="coefficientTravailler" onChange={this.handleChange} min={0} max={100} defaultValue={100} pattern="[0-9]*" step={10} required />
                <span className="text-danger">{errors.coefficientTravailler}</span>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="dateDebut">Période d'essaie (Mois) *</label>
                <input type="number" className="form-control" id="dureePeriodeEssaie" name="dureePeriodeEssaie" onChange={this.handleChange} min={0} defaultValue={0} required />
                <span className="text-danger">{errors.dureePeriodeEssaie}</span>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="dateDebut">Date de début *</label>
                <input type="date" className="form-control" id="dateDebut" name="dateDebut" onChange={this.onChangeDate} required />
              </div>
              <div className="col" id="dateFin">
                <label htmlFor="dateFin">Date de fin</label>
                <input type="date" className="form-control" id="dateFin" name="dateFin" onChange={this.onChangeDate} />
              </div>
            </div>
            <div className="col">
              <span className="text-danger row">{errors.dateFinInf}</span>
              <span className="text-danger row">{errors.dateInfAujDHui}</span>
            </div>
            <div className="row invisible d-none" id="dateFormation" >
              <div className="col">
                <label htmlFor="debutFormation">Date de début de formation *</label>
                <input type="date" className="form-control" id="debutFormation" name="debutFormation" onChange={this.handleChange} />
                <span className="text-danger">{errors.debutFormation}</span>
              </div>
              <div className="col">
                <label htmlFor="finFormation">Date de fin de formation *</label>
                <input type="date" className="form-control" id="finFormation" name="finFormation" onChange={this.handleChange} />
                <span className="text-danger">{errors.finFormation}</span>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col">
                <label htmlFor="dateDebut">Volume horaire *</label>
                <input type="number" className="form-control" id="volumeHoraire" onChange={this.onChangeVolumeHoraire} min={0} defaultValue={0} pattern="[0-9]*" required />
                <div onChange={this.onChangeTypeHoraire} className="form-check">
                  <div className="form-check form-check-inline">
                    <input type="radio" value="J" name="typeHoraire" id="typeHoraireJ" className="form-check-input" required />
                    <label className="form-check-label" htmlFor="typeHoraireJ">
                      Jour
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input type="radio" value="H" name="typeHoraire" id="typeHoraireH" className="form-check-input" required defaultChecked />
                    <label className="form-check-label" htmlFor="typeHoraireH">
                      Heure
                    </label>
                  </div>
                </div>
                <span className="text-danger">{errors.volumeNeg}</span>
              </div>
              <div className="col">
                <label htmlFor="lieuTravail">Lieu de travail *</label>
                <CSelect custom name="lieuTravail" id="lieuTravail" onChange={this.handleChange} required>
                  <option value="0">Veuillez sélectionner un lieu de travail</option>
                  {lieuxTravail.map((lieuTravail, key) => (
                    <option key={key} value={lieuTravail.id}>
                      {lieuTravail.nom}
                    </option>
                  ))}
                </CSelect>
                <span className="text-danger">{errors.lieuTravail}</span>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="manager">Manager</label>
                <CSelect custom name="manager" id="manager" onChange={this.handleChange} required>
                  <option value="0">Veuillez sélectionner un Manageur</option>
                  {managers.map((manager, key) => (
                    <option key={key} value={manager.id}>
                      {manager.nom + " " + manager.prenom}
                    </option>
                  ))}
                </CSelect>
                <span className="text-danger">{errors.manager}</span>
              </div>
              <div className="col invisible d-none" id="maitreApprentissage">
                <label htmlFor="maitreApprentissage">Maitre d'apprentissage</label>
                <CSelect custom name="maitreApprentissage" id="maitreApprentissage" onChange={this.handleChange} required>
                  <option value="0">Veuillez sélectionner un maitre d'apprentissage</option>
                  {maitresApprentissage.map((maitreApprentissage, key) => (
                    <option key={key} value={maitreApprentissage.id}>
                      {maitreApprentissage.nom + " " + maitreApprentissage.prenom}
                    </option>
                  ))}
                </CSelect>
                <span className="text-danger">{errors.maitreApprentissage}</span>
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
                {loading && <CSpinner size="sm" variant="border" />}Créer le poste
              </CButton>
              <Link to={"/salaries/profil/" + currentSalarie.id} className="withoutUnderlane">
                <CButton className="mt-1" block color="danger" title="Vous voulez annuler ?">
                  Annuler
                </CButton>
              </Link>
              <span className="text-danger">{errors.erreur}</span>
            </div>
          </div>
        </form>
      </>
    )

  }
}
export default withRouter(CreatePoste);
