import React, { Component } from "react";
import { CButton, CSelect, CAlert, CSpinner, CSwitch } from "@coreui/react";
import { withRouter } from "react-router";
import Select from "react-select";
import EntrepriseService from "../../services/entreprises.service";
import CompetenceService from "../../services/competence.service";
import RoleService from "../../services/role.service";
import SalariesService from "../../services/salaries.service";
import { isMajor, isValidDate } from "src/utils/fonctions";
import serviceService from "../../services/service.service";
import countries from 'world_countries_lists/data/countries/fr/countries.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

class UpdateSalarie extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onChangeRoles = this.onChangeRoles.bind(this);
    this.updateSalarie = this.updateSalarie.bind(this);
    this.validationForm = this.validationForm.bind(this);
    this.updateCompetence = this.updateCompetence.bind(this);
    this.state = {
      currentErrors: {
        lastname: null,
        lastnameBool: true,
        firstname: null,
        firstnameBool: true,
        genre: null,
        genreBool: true,
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
        nationalite: null,
        nationaliteBool: true,
        numeroSecuriteSocial: null,
        numeroSecuriteSocialBool: true,
        deptNaissance: null,
        deptNaissanceBool: true,
        villeNaissance: null,
        villeNaissanceBool: true,
        nomPrenomContactUrgence: null,
        nomPrenomContactUrgenceBool: true,
        numeroContactUrgence: null,
        numeroContactUrgenceBool: true,
        number: null,
        numberBool: true,
        route: null,
        routeBool: true,
        complementAddress: null,
        complementAddressBool: true,
        town: null,
        townBool: true,
        zipCode: null,
        zipCodeBool: true,
        country: null,
        countryBool: true
      },
      currentSalarie: {
        nom: "",
        prenom: "",
        genre: "",
        email: "",
        motDePasse: "",
        dateNaissance: "",
        telPersonnel: "",
        mobilPersonnel: "",
        telProfessionnel: "",
        mobileProfessionnel: "",
        nationalite: "",
        deptNaissance: "",
        villeNaissance: "",
        numeroSecuriteSocial: "",
        nomPrenomContactUrgence: "",
        numeroContactUrgence: "",
        adresse: {
          id: 0,
          numero: "",
          voie: "",
          complementAdresse: "",
          ville: "",
          codePostal: "",
          pays: "FRANCE",
          version: null
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
        actif: true,
        version: null,
      },
      domains: [],
      companies: [],
      skills: [],
      roles: [],
      competences: [],
      competencesNote: [],
      competencesToUpdate: [],
      message: "",
      ifError: null,
      loading: false,
      emailCurrent: ""
    };
  }

  componentDidMount() {
    this.getSalarie(this.props.salarieId.id);
    this.getAllDomaines();
    this.getAllCompanies();
    this.getAllSkills();
    this.getAllRoles();
  }

  handleChange(e) {
    let regexEmail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    let regexTel = new RegExp(/[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}/);
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "lastname") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            lastname: "Le champ nom est requis.",
            lastnameBool: true,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            nom: value.toUpperCase(),
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            lastname: null,
            lastnameBool: false,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            nom: value.toUpperCase(),
          },
        }));
      }
    }

    if (name === "firstname") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            firstname: "Le champ prénom est requis.",
            firstnameBool: true,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            prenom: (value + '').charAt(0).toUpperCase() + value.substr(1),
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            firstname: null,
            firstnameBool: false,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            prenom: (value + '').charAt(0).toUpperCase() + value.substr(1),
          },
        }));
      }
    }

    if (name === "genre") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            genre: "Le champ genre est requis",
            genreBool: true,
          }
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            genre: null,
            genreBool: false,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            genre: value,
          }

        }));
      }
    }


    if (name === "birthday") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            birthday: "Le champ date de naissance est requis.",
            birthdayBool: true,
          },
        }));
      } else {
        if (isValidDate(value)) {
          if (!isMajor(value)) {
            this.setState((prevState) => ({
              currentErrors: {
                ...prevState.currentErrors,
                birthday: "Le salarié est mineur.",
                birthdayBool: true,
              },
            }));
          } else {
            this.setState((prevState) => ({
              currentErrors: {
                ...prevState.currentErrors,
                birthday: null,
                birthdayBool: true,
              },
              currentSalarie: {
                ...prevState.currentSalarie,
                dateNaissance: value,
              },
            }));
          }
        } else {
          this.setState((prevState) => ({
            currentErrors: {
              ...prevState.currentErrors,
              birthday: "Veuilez saisir une date.",
              birthdayBool: true,
            },
          }));
        }
      }
    }
    if (name === "phonePerso") {
      if (regexTel.test(value)) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            phonePerso: "Veuillez saisir un bon numéro",
            phonePersoBool: true,
          },
        }));
      } else {
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

      }
    }

    if (name === "phoneMPerso") {
      if (regexTel.test(value)) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            phoneMPerso: "Veuillez saisir un bon numéro",
            phoneMPersoBool: true,
          },
        }));
      } else {
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
      }
    }

    if (name === "phonePro") {
      if (regexTel.test(value)) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            phonePro: "Veuillez saisir un bon numéro",
            phoneProBool: true,
          },
        }));
      } else {
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
      }
    }

    if (name === "phoneMPro") {
      if (regexTel.test(value)) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            phoneMPro: "Veuillez saisir un bon numéro",
            phoneMProBool: true,
          },
        }));
      } else {
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
          currentSalarie: {
            ...prevState.currentSalarie,
            email: value,
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
            currentSalarie: {
              ...prevState.currentSalarie,
              email: value,
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

    if (name === "nationalite") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            nationalite: "Le champ nationalité est requis.",
            nationaliteBool: true,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            nationalite: value.toUpperCase(),
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            nationalite: "",
            nationaliteBool: false
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            nationalite: value.toUpperCase(),
          },
        }));
      }
    }

    if (name === "numeroSecuriteSocial") {
      if (value === "" || value === null || value.length === 0 || value < 15) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            numeroSecuriteSocial: "Le champ numéro Sécurité social est requis ou il est ivalide.",
            numeroSecuriteSocialBool: true,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            numeroSecuriteSocial: value,
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            numeroSecuriteSocial: "",
            numeroSecuriteSocialBool: false
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            numeroSecuriteSocial: value
          },
        }));
      }
    }


    if (name === "deptNaissance") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            _deptNaissance: "Le champ département de naissance est requis.",
            get deptNaissance() {
              return this._deptNaissance;
            },
            set deptNaissance(value) {
              this._deptNaissance = value;
            },
            deptNaissanceBool: true,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            deptNaissance: value.toUpperCase(),
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            deptNaissance: "",
            deptNaissanceBool: false
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            deptNaissance: value.toUpperCase(),
          },
        }));
      }
    }

    if (name === "villeNaissance") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            villeNaissance: "Le champ ville de naissance est requis.",
            villeNaissanceBool: true,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            villeNaissance: value.toUpperCase(),
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            villeNaissance: "",
            villeNaissanceBool: false
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            villeNaissance: value.toUpperCase(),
          },
        }));
      }
    }

    if (name === "nomPrenomContactUrgence") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            nomPrenomContactUrgence: "Le champ contact urgence est requis.",
            nomPrenomContactUrgenceBool: true,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            nomPrenomContactUrgence: value.toUpperCase(),
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            nomPrenomContactUrgence: "",
            nomPrenomContactUrgenceBool: false
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            nomPrenomContactUrgence: value
          },
        }));
      }
    }

    if (name === "numeroContactUrgence") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            numeroContactUrgence: "Le champ numéro d'urgence est requis.",
            numeroContactUrgenceBool: true,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            numeroContactUrgence: value,
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            numeroContactUrgence: "",
            numeroContactUrgenceBool: false
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            numeroContactUrgence: value
          },
        }));
      }
    }

    if (name === "domain") {
      if (
        parseInt(value) === 0 ||
        value === "" ||
        value === null ||
        value.length === 0
      ) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            domain: "Le champ service est requis.",
            domainBool: true,
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            domain: null,
            domainBool: false,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            domaine: {
              id: value,
            },
          },
        }));
      }
    }
    if (name === "company") {
      if (
        parseInt(value) === 0 ||
        value === "" ||
        value === null ||
        value.length === 0
      ) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            company: "Le champ service est requis.",
            companyBool: true,
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            company: null,
            companyBool: false,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            entreprise: {
              id: value,
            },
          },
        }));
      }
    }

    if (name === "number") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            number: "Le numéro de l'adresse est requis.",
            numberBool: true,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            adresse: {
              numero: value,
            }
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            number: null,
            numberBool: false,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            adresse: {
              numero: value,
            }
          },
        }));
      }
    }
    if (name === "route") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            route: "Le champ voie est requis.",
            routeBool: true,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            adresse: {
              voie: value,
            }
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            route: null,
            routeBool: false,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            adresse: {
              voie: value,
            }
          },
        }));
      }
    }
    if (name === "cpltAddress") {
      if (value !== "" || value !== null || value.length !== 0) {
        this.setState((prevState) => ({
          currentSalarie: {
            ...prevState.currentSalarie,
            adresse: {
              complementAdresse: value,
            }
          },
        }));
      }
    }
    if (name === "town") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            town: "Le champ ville est requis.",
            townBool: true,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            adresse: {
              ville: value.toUpperCase(),
            }
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            town: null,
            townBool: false,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            adresse: {
              ville: value.toUpperCase(),
            }
          },
        }));
      }
    }
    if (name === "zipCode") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            zipCode: "Le champ code postal est requis.",
            zipCodeBool: true,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            adresse: {
              codePostal: value,
            }
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            zipCode: null,
            zipCodeBool: false,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            adresse: {
              codePostal: value,
            }
          },
        }));
      }
    }
    if (name === "country") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            country: "Le champ pays est requis.",
            countryBool: true,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            adresse: {
              pays: value.toUpperCase(),
            }
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            country: null,
            countryBool: false,
          },
          currentSalarie: {
            ...prevState.currentSalarie,
            adresse: {
              pays: value.toUpperCase(),
            }
          },
        }));
      }
    }

    if (name === "compteActif") {
      this.setState((prevState) => ({
        currentSalarie: {
          ...prevState.currentSalarie,
            actif: value,
        },
      }));
    }
  }

  onChangeRoles(e) {
    if (e.length === 0) {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          role: "Veuillez séléctionner au moins une rôle",
          roleBool: true,
        },
        currentSalarie: {
          ...prevState.currentSalarie,
          roles: e,
        },
      }));
    } else {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          role: null,
          roleBool: false,
        },
        currentSalarie: {
          ...prevState.currentSalarie,
          roles: e,
        },
      }));
    }
  }

  getAllDomaines() {
    serviceService.getAllService()
      .then((response) => {
        this.setState({ domains: response.data });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getAllCompanies() {
    EntrepriseService.getAllEntreprises()
      .then((response) => {
        this.setState({ companies: response.data });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getAllSkills() {
    CompetenceService.getAllCompetence()
      .then((response) => {
        this.setState({ skills: response.data });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getAllRoles() {
    RoleService.getAllRoles()
      .then((response) => {
        this.setState({ roles: response.data });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getSalarie(id) {
    SalariesService.getSalarieById(id)
      .then((response) => {
        let comp = [];
        let compNote = [];
        let i = 0
        response.data.competences.forEach(e => {
          comp[i] = e.competence.id;
          compNote[i] = e.note;
          i++;
        })
        this.setState({
          currentSalarie: response.data,
          emailCurrent: response.data.email,
          competences: comp,
          competencesNote: compNote,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  handleCompetence = i => e => {
    let competences = [...this.state.competences]
    competences[i] = parseInt(e.target.value);
    this.setState({
      competences
    })
  }

  handleCompetenceNote = i => e => {
    let competencesNote = [...this.state.competencesNote]
    competencesNote[i] = e.target.value
    this.setState({
      competencesNote
    })
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
    this.setState({
      competences,
      competencesNote,
    })
  }

  addAutreCompetence = e => {
    e.preventDefault();
    let competences = this.state.competences.concat([''])
    let competencesError = this.state.competences.concat(['Une compétence doit avoir une note.'])
    this.setState({
      competences,
      competencesError
    })
  }

  validationForm() {
    const { currentErrors, currentSalarie } = this.state;
    if (currentSalarie.domaine.id === 0) {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          domain: "Le champ service est requis.",
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
      currentErrors.domainBool &&
      currentErrors.companyBool &&
      currentErrors.skillsBool &&
      currentErrors.roleBool &&
      currentErrors.adresseBool &&
      currentErrors.complementAddressBool &&
      currentErrors.countryBool &&
      currentErrors.numberBool &&
      currentErrors.townBool &&
      currentErrors.zipCodeBool &&
      currentErrors.routeBool
    ) {
      return false;
    } else {
      return true;
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
        salarie: {
          id: 0,
        }
      },
      comp && competenceArray.push(object)
    )))
    return competenceArray;
  }

  updateSalarie(e) {
    e.preventDefault();
    this.setState({ loading: true })
    if (this.validationForm()) {
      const json = JSON.stringify(this.state.currentSalarie)
        .split('"value":')
        .join('"id":');
      const data = JSON.parse(json);
      delete data.postes;
      const requete = {
        salarie: data,
        competences: this.updateCompetence(),
      }
      SalariesService.getSalarieByEmail(this.state.currentSalarie.email).then(response => {
        if (response.data === "" || response.data.email === this.state.emailCurrent) {
          SalariesService.updateWithCompetenceAndWithoutPassword(requete)
            .then((resp) => {
              this.setState({
                message: "Modification bien prise en compte ! Redirection vers son profil.",
                ifError: false
              });
              window.setTimeout(() => { this.props.history.push(`/salaries/dossiers-personnel/${resp.data.id}`) }, 2500)
            }).catch((e) => {
              this.setState({
                message: e,
                ifError: true,
                loading: false
              });
            });
        } else {
          this.setState({
            message: "Cette adresse email est déjà utilisée.",
            ifError: true,
            loading: false
          });
        }
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
    const { domains, companies, skills, roles, currentSalarie, currentErrors, message, ifError, loading, competences, competencesNote } = this.state;
    return (
      <div className="submit-form">
        <div>
          <form name="updateEmployee" onSubmit={this.updateSalarie}>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="lastname" className={currentErrors.lastname ? "font-weight-bold text-danger" : "font-weight-bold"}>Nom *</label>
                  <input
                    type="text"
                    name="lastname"
                    className={currentErrors.lastname ? "form-control is-invalid" : "form-control"}
                    id="lastname"
                    onChange={this.handleChange}
                    value={
                      currentSalarie.nom === null ? "" : currentSalarie.nom
                    }
                    required
                  />
                  <span className="text-danger">{currentErrors.lastname}</span>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="firstname" className={currentErrors.firstname ? "font-weight-bold text-danger" : "font-weight-bold"}>Prénom *</label>
                  <input
                    type="text"
                    name="firstname"
                    className={currentErrors.firstname ? "form-control is-invalid" : "form-control"}
                    id="firstname"
                    onChange={this.handleChange}
                    value={
                      currentSalarie.prenom === null
                        ? ""
                        : currentSalarie.prenom
                    }
                    required
                  />
                  <span className="text-danger">{currentErrors.firstname}</span>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="genre">Genre</label>
                  <CSelect
                    custom
                    name="genre"
                    id="genre"
                    onChange={this.handleChange}
                    value={currentSalarie.genre}
                    required
                  >
                    <option value="0" >GENRE</option>
                    <option value="HOMME">HOMME</option>
                    <option value="FEMME">FEMME</option>
                    <option value="PAS_EXPRIMER">Ne souhaite pas s'exprimer</option>
                  </CSelect>

                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="compteActif">Compte actif</label><br/>
                  <CSwitch
                    className="mt-1"
                    id="compteActif"
                    name="compteActif"
                    color="success"
                    checked={currentSalarie.actif}
                    value={currentSalarie.actif}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="email" className={currentErrors.email ? "font-weight-bold text-danger" : "font-weight-bold"}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    className={currentErrors.email ? "form-control is-invalid" : "form-control"}
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
              <div className="col">
                <div className="form-group">
                  <label htmlFor="dayOfBirth" className={currentErrors.birthday ? "font-weight-bold text-danger" : "font-weight-bold"}>Date de naissance *</label>
                  <input
                    type="date"
                    name="birthday"
                    className={currentErrors.birthday ? "form-control is-invalid" : "form-control"}
                    id="dayOfBirth"
                    onChange={this.handleChange}
                    value={
                      currentSalarie.dateNaissance === null
                        ? ""
                        : currentSalarie.dateNaissance
                    }
                    required
                  />
                  <span className="text-danger">{currentErrors.birthday}</span>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="nationalite">Nationalité</label>
                  <CSelect
                    custom
                    className={currentErrors.nationalite ? "form-control is-invalid" : "form-control"}
                    name="nationalite"
                    id="nationalite"
                    onChange={this.handleChange}
                    defaultValue={"France"}
                    required
                  >
                    <option value={currentSalarie.nationalite} disabled>Veuillez sélectionner un pays</option>
                    {countries.map((country, key) => (
                      <option key={key} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </CSelect>
                  <span className="text-danger">{currentErrors.country}</span>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="numeroSecuriteSocial">N° Sécurité Social</label>
                  <input
                    type="text"
                    name="numeroSecuriteSocial"
                    className="form-control"
                    id="numeroSecuriteSocial"
                    value={
                      currentSalarie.numeroSecuriteSocial === null
                        ? ""
                        : currentSalarie.numeroSecuriteSocial
                    }
                    onChange={this.handleChange}
                  />
                  <span className="text-danger">{currentErrors.phoneMPro}</span>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="villeNaissance" className={currentErrors.villeNaissance ? "font-weight-bold text-danger" : "font-weight-bold"}>Ville de Naissance</label>
                  <input
                    type="text"
                    name="villeNaissance"
                    className={currentErrors.villeNaissance ? "form-control is-invalid" : "form-control"}
                    id="villeNaissance"
                    value={
                      currentSalarie.villeNaissance === null
                        ? ""
                        : currentSalarie.villeNaissance
                    }
                    onChange={this.handleChange}
                  />
                  <span className="text-danger">{currentErrors.villeNaissance}</span>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="deptNaissance" className={currentErrors.deptNaissance ? "font-weight-bold text-danger" : "font-weight-bold"}>Département de Naissance</label>
                  <input
                    type="text"
                    name="deptNaissance"
                    className={currentErrors.deptNaissance ? "form-control is-invalid" : "form-control"}
                    id="deptNaissance"
                    value={
                      currentSalarie.deptNaissance === null
                        ? ""
                        : currentSalarie.deptNaissance
                    }
                    onChange={this.handleChange}
                  />
                  <span className="text-danger">{currentErrors.deptNaissance}</span>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="nomPrenomContactUrgence" className={currentErrors.contactUrgence ? "font-weight-bold text-danger" : "font-weight-bold"}>Contact d'urgence</label>
                  <input
                    type="text"
                    name="nomPrenomContactUrgence"
                    className={currentErrors.contactUrgence ? "form-control is-invalid" : "form-control"}
                    id="nomPrenomContactUrgence"
                    value={
                      currentSalarie.nomPrenomContactUrgence === null
                        ? ""
                        : currentSalarie.nomPrenomContactUrgence
                    }
                    onChange={this.handleChange}
                  />
                  <span className="text-danger">{currentErrors.contactUrgence}</span>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="numeroContactUrgence" className={currentErrors.numeroSecuriteSocial ? "font-weight-bold text-danger" : "font-weight-bold"}>Numéro contact d'urgence</label>
                  <input
                    type="text"
                    name="numeroContactUrgence"
                    className={currentErrors.numeroContactUrgence ? "form-control is-invalid" : "form-control"}
                    id="numeroContactUrgence"
                    value={
                      currentSalarie.numeroContactUrgence === null
                        ? ""
                        : currentSalarie.numeroContactUrgence
                    }
                    onChange={this.handleChange}
                  />
                  <span className="text-danger">{currentErrors.numeroContactUrgence}</span>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="phonePerso" className={currentErrors.phonePerso ? "font-weight-bold text-danger" : "font-weight-bold"}>Tél. perso</label>
                  <input
                    type="text"
                    name="phonePerso"
                    className={currentErrors.phonePerso ? "form-control is-invalid" : "form-control"}
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
                  <label htmlFor="phoneMPerso" className={currentErrors.phoneMPerso ? "font-weight-bold text-danger" : "font-weight-bold"}>Tél. Mobile perso</label>
                  <input
                    type="text"
                    name="phoneMPerso"
                    className={currentErrors.phoneMPerso ? "form-control is-invalid" : "form-control"}
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
                  <label htmlFor="phonePro" className={currentErrors.phonePro ? "font-weight-bold text-danger" : "font-weight-bold"}>Tél. pro</label>
                  <input
                    type="text"
                    name="phonePro"
                    className={currentErrors.phonePro ? "form-control is-invalid" : "form-control"}
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
                  <label htmlFor="phoneMPro">Tél. Mobile pro</label>
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
            <div className="row">
              <div className="col" id="adresseExistante">
                <label htmlFor="adresse" className={currentErrors.adresse ? "font-weight-bold text-danger" : "text-center font-weight-bold"}>Adresse *</label>
                <div className="border">
                  <div className="row m-1">
                    <div className="col">
                      <label htmlFor="number">Numéro*</label>
                      <input type="text" name="number" className="form-control" id="number" placeholder="Saisir le numéro de l'adresse" value={currentSalarie.adresse.numero} onChange={this.handleChange} required />
                      <span className="text-danger">{currentErrors.number}</span>
                    </div>
                    <div className="col">
                      <label htmlFor="route">Voie*</label>
                      <input type="text" name="route" className="form-control" id="route" placeholder="Sasir le nom de la voie" value={currentSalarie.adresse.voie} onChange={this.handleChange} required />
                      <span className="text-danger">{currentErrors.route}</span>
                    </div>
                  </div>
                  <div className="row m-1">
                    <div className="col">
                      <label htmlFor="cpltAddress">Complément d'adresse</label>
                      <input type="text" name="cpltAddress" className="form-control" id="cpltAddress" placeholder="Saisir un complément d'adresse" value={currentSalarie.adresse.complementAdresse} onChange={this.handleChange} />
                      <span className="text-danger">{currentErrors.complementAddress}</span>
                    </div>
                    <div className="col">
                      <label htmlFor="town">Ville*</label>
                      <input type="text" name="town" className="form-control" id="town" placeholder="Saisir une ville" value={currentSalarie.adresse.ville} onChange={this.handleChange} required />
                      <span className="text-danger">{currentErrors.town}</span>
                    </div>
                  </div>
                  <div className="row m-1">
                    <div className="col">
                      <label htmlFor="zipCode">Code Postal*</label>
                      <input type="text" name="zipCode" className="form-control" id="zipCode" placeholder="Saisir un code postal" value={currentSalarie.adresse.codePostal} onChange={this.handleChange} required />
                      <span className="text-danger">{currentErrors.zipCode}</span>
                    </div>
                    <div className="col">
                      <label htmlFor="country">Pays* </label>
                      <CSelect
                        custom
                        className={currentErrors.country ? "form-control is-invalid" : "form-control"}
                        name="country"
                        id="country"
                        onChange={this.handleChange}
                        defaultValue={"France"}
                        required
                        value={currentSalarie.adresse.pays === null ? 0 : currentSalarie.adresse.pays.substring(0, 1) + currentSalarie.adresse.pays.substring(1).toLowerCase()}
                      >
                        <option value="0" disabled>Veuillez sélectionner un pays</option>
                        {countries.map((country, key) => (
                          <option key={key} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </CSelect>
                      <span className="text-danger">{currentErrors.country}</span>
                    </div>
                  </div>
                  <span className="text-danger">{currentErrors.adresse}</span>
                </div>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="domain">Service</label>
                  <CSelect
                    custom
                    name="domain"
                    id="domain"
                    value={
                      currentSalarie.domaine.id === null
                        ? 0
                        : currentSalarie.domaine.id
                    }
                    onChange={this.handleChange}
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
                  <label htmlFor="company">Entreprise</label>
                  <CSelect
                    custom
                    name="company"
                    id="company"
                    value={
                      currentSalarie.entreprise.id === null
                        ? 0
                        : currentSalarie.entreprise.id
                    }
                    onChange={this.handleChange}
                  >
                    <option value="0">
                      Veuillez sélectionner une entreprise
                    </option>
                    {companies.map((company, key) => (
                      <option key={key} value={company.id}>
                        {company.nom}
                      </option>
                    ))}
                  </CSelect>
                  <span className="text-danger">{currentErrors.company}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="competence">Compétence</label>
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
                    </div>
                  ))}
                </div>
                <CButton className="mt-1" block color="info" onClick={this.addAutreCompetence}>
                  Ajouter une compétence
                </CButton>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="roles">Rôle *</label>
                  <Select
                    name="roles"
                    placeholder="Liste des rôles"
                    value={
                      currentSalarie.roles === null ? "" : currentSalarie.roles
                    }
                    getOptionLabel={(option) => option.titre}
                    getOptionValue={(option) => option.id}
                    options={roles.map((e) => ({ titre: e.titre, id: e.id }))}
                    onChange={this.onChangeRoles}
                    isMulti
                  />
                  <span className="text-danger">{currentErrors.role}</span>
                </div>
              </div>
            </div>
            <CButton type="submit" block color="info" disabled={loading}>
              {loading && <CSpinner size="sm" variant="border" />} Modification du salarié
            </CButton>
            <CButton className="mt-1" to={"/salaries/dossiers-personnel/" + currentSalarie.id} block color="danger" title="Vous voulez annuler ?">
              Annuler
            </CButton>
          </form>
          {ifError != null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
        </div>
      </div>
    );
  }
}
export default withRouter(UpdateSalarie);
