import { CAlert, CButton, CSelect, CSpinner } from "@coreui/react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import { isMajor, isValidDate } from "src/utils/fonctions";
import countries from 'world_countries_lists/data/countries/fr/countries.json';
import CompetenceService from "../../services/competence.service";
import EntrepriseService from "../../services/entreprises.service";
import RoleService from "../../services/role.service";
import SalariesService from "../../services/salaries.service";
import serviceService from "../../services/service.service";

class CreateSalarie extends Component {
  constructor(props) {
    super(props);
    this.getAllServices = this.getAllServices.bind(this);
    this.getAllCompanies = this.getAllCompanies.bind(this);
    this.getAllSkills = this.getAllSkills.bind(this);
    this.getAllRoles = this.getAllRoles.bind(this);
    this.onChangeRoles = this.onChangeRoles.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveEmployee = this.saveEmployee.bind(this);
    this.handleCompetence = this.handleCompetence.bind(this);
    this.handleCompetenceDelete = this.handleCompetenceDelete.bind(this);
    this.handleCompetenceNote = this.handleCompetenceNote.bind(this);
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
        birthdayBool: true,
        phonePerso: null,
        phonePersoBool: false,
        phoneMPerso: null,
        phoneMPersoBool: false,
        phonePro: null,
        phoneProBool: false,
        phoneMPro: null,
        phoneMProBool: false,
        service: null,
        serviceBool: true,
        company: null,
        companyBool: true,
        skills: null,
        skillsBool: false,
        role: null,
        roleBool: false,
        nationalite: null,
        nationaliteBool: false,
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
        complementAddressBool: false,
        town: null,
        townBool: true,
        zipCode: null,
        zipCodeBool: true,
        country: null,
        countryBool: false
      },
      domains: [],
      companies: [],
      skills: [],
      skills2: [],
      roles: [],
      password: null,
      multiValue: [],
      nomError: false,
      prenomError: false,
      currentSalarie: {
        nom: null,
        prenom: null,
        genre: null,
        email: null,
        dateNaissance: new Date(),
        motDePasse: null,
        telPersonnel: null,
        mobilPersonnel: null,
        telProfessionnel: null,
        mobileProfessionnel: null,
        nationalite: "France",
        numeroSecuriteSocial: null,
        deptNaissance: null,
        villeNaissance: null,
        nomPrenomContactUrgence: null,
        numeroContactUrgence: null,
        adresse: {
          id: null,
          numero: "",
          voie: "",
          complementAdresse: "",
          ville: "",
          codePostal: "",
          pays: "FRANCE",
          version: null
        },
        domaine: {
          id: null,
        },
        entreprise: {
          id: null,
        },
        roles: [{
          id: 4,
          titre: "EMPLOYEE"
        }],
      },
      competences: [],
      competencesNote: [],
      competencesError: [],
      competencesErrorDoublon: [],
      competencesToSave: [],
      message: "",
      ifError: null,
      loading: false
    };
  }

  componentDidMount() {
    this.getAllServices();
    this.getAllCompanies();
    this.getAllSkills();
    this.getAllRoles();
  }

  handleChange(e) {
    let regexEmail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    let regexTel = new RegExp("^0[1-9]([-. ]?[0-9]{2}){4}$");

    let regexNumeroSecu = new RegExp(/^[1-478][0-9]{2}(0[1-9]|1[0-2]|62|63)(2[ABab]|[0-9]{2})(00[1-9]|0[1-9][0-9]|[1-8][0-9]{2}|9[0-8][0-9]|990)(00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})(0[1-9]|[1-8][0-9]|9[0-7])$/g);

    //let regexNumeroTel= new RegExp()
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
            lastname: "",
            lastnameBool: false
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
          }, currentSalarie: {
            ...prevState.currentSalarie,
            prenom: (value + '').charAt(0).toUpperCase() + value.substr(1),
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            firstname: "",
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
      if(value === "" || value === null || value.length === 0){
        this.setState((prevState)=> ({
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
                birthdayBool: false,
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
      if (regexTel.test(value) || value.length === 0) {
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
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            phonePerso: "Veuillez saisir un bon numéro",
            phonePersoBool: true,
          },
        }));
      }
    }

    if (name === "phoneMPerso") {
      if (regexTel.test(value) || value.length === 0) {
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
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            phoneMPerso: "Veuillez saisir un bon numéro",
            phoneMPersoBool: true,
          },
        }));
      }
    }

    if (name === "phonePro") {
      if (regexTel.test(value) || value.length === 0) {
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
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            phonePro: "Veuillez saisir un bon numéro",
            phoneProBool: true,
          },
        }));
      }
    }

    if (name === "phoneMPro") {
      if (regexTel.test(value) || value.length === 0) {
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
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            phoneMPro: "Veuillez saisir un bon numéro",
            phoneMProBool: true,
          },
        }));
      }
    }


    if (name === "email") {

      if (regexEmail.test(value)) {

        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            email: "Veuillez entrer une adresse e-mail valide.",
            emailBool: true,
          }
        }));
        if (value === "" || value === null || value.length === 0) {
          this.setState((prevState) => ({
            currentErrors: {
              ...prevState.currentErrors,
              email: "Le champ email est requis.",
              emailBool: true,
            }
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
      if (!regexNumeroSecu.test(value)) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            numeroSecuriteSocial: "le numéro de sécurité social n'est pas valide.",
            numeroSecuriteSocialBool: true,
          }
        }));
      }
      else {
        if (value === "" || value === null || value.length === 0 || value < 15) {
          this.setState((prevState) => ({
            currentErrors: {
              ...prevState.currentErrors,
              numeroSecuriteSocial: "Le champ numéro Sécurité social est requis ou il est invalide.",
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
    }

    if (name === "deptNaissance") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            deptNaissance: "Le champ département de naissance est requis.",
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

    if (name === "service") {
      if (parseInt(value) === 0 || value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            service: "Le champ service est requis.",
            serviceBool: true,
          }
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            service: null,
            serviceBool: false,
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
      if (parseInt(value) === 0 || value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            company: "Le champ service est requis.",
            companyBool: true,
          }
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
              ...prevState.currentSalarie,
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
              ...prevState.currentSalarie.adresse,
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
              ...prevState.currentSalarie.adresse,
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
              ...prevState.currentSalarie.adresse,
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
              ...prevState.currentSalarie.adresse,
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
              ...prevState.currentSalarie.adresse,
              ville: value.toUpperCase(),

            },


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
              ...prevState.currentSalarie.adresse,
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
              ...prevState.currentSalarie.adresse,
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
              ...prevState.currentSalarie.adresse,
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
  }

  onChangeRoles(e) {
    if (e.length === 0) {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          role: "Veuillez séléctionner au moins une rôle",
          roleBool: true
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
          roleBool: false
        },
        currentSalarie: {
          ...prevState.currentSalarie,
          roles: e,
        },
      }));
    }

  }

  getAllServices() {
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
        this.setState({ skills: response.data, skills2: response.data });
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
        skills: competencesError.filter(error => error !== null).length === 0 && competencesErrorDoublon.filter(error => error !== null).length === 0 ? null : "Erreur dans les compétences.",
        skillsBool: competencesError.filter(error => error !== null).length === 0 && competencesErrorDoublon.filter(error => error !== null).length === 0 ? false : true,
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
        skills: competencesError.filter(error => error !== null).length === 0 && this.state.competencesErrorDoublon.filter(error => error !== null).length === 0 ? null : "Erreur dans les compétences.",
        skillsBool: competencesError.filter(error => error !== null).length === 0 && this.state.competencesErrorDoublon.filter(error => error !== null).length === 0 ? false : true,
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
    this.setState({
      competences,
      competencesNote,
      competencesError,
      competencesErrorDoublon,
    })
  }

  addAutreCompetence = e => {
    e.preventDefault();
    let competences = this.state.competences.concat([0])
    let competencesNote = this.state.competencesNote.concat(['0'])
    let competencesError = this.state.competencesError.concat([''])
    let competencesErrorDoublon = this.state.competencesErrorDoublon.concat([''])
    this.setState({
      competences,
      competencesNote,
      competencesError,
      competencesErrorDoublon
    })
  }

  validationForm() {
    const { currentErrors } = this.state;

    if (!currentErrors.lastnameBool &&
      !currentErrors.firstnameBool &&
      !currentErrors.emailBool &&
      !currentErrors.birthdayBool &&
      !currentErrors.domainBool &&
      !currentErrors.roleBool &&
      !currentErrors.adresseBool &&
      !currentErrors.complementAddressBool &&
      !currentErrors.countryBool &&
      !currentErrors.numberBool &&
      !currentErrors.townBool &&
      !currentErrors.zipCodeBool &&
      !currentErrors.routeBool &&
      !currentErrors.skillsBool) {
      return true;
    } else {
      return false;
    }
  }

  SaveCompetence() {
    let competenceArray = this.state.competencesToSave;
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
    this.setState({
      competencesToSave: competenceArray
    });
    return competenceArray;
  }

  saveEmployee(e) {
    e.preventDefault();
    this.setState({ loading: true })
    if (this.validationForm()) {
      const json = JSON.stringify(this.state.currentSalarie).split('"value":').join('"id":');
      const data = JSON.parse(json);
      const requete = {
        salarie: data,
        competences: this.SaveCompetence(),
      }
      SalariesService.getSalarieByEmail(this.state.currentSalarie.email).then(response => {
        if (response.data === "") {
          SalariesService.saveWithCompetences(requete)
            .then((resp) => {
              this.setState({
                message: "Création bien prise en compte ! Redirection vers son profil.",
                ifError: false
              });
              window.setTimeout(() => { this.props.history.push(`/salaries/profil/${resp.data.id}`) }, 2500)
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
            message: "Cette adresse email est déjà utilisée.",
            ifError: true,
            loading: false
          });
        }
      })
    } else {
      this.setState({

        message: "Des erreurs sont présentes ! veuillez ré-essayer.",
        ifError: true,
        loading: false
      });
    }

  }

  render() {

    const { domains, companies, skills, roles, currentErrors, message, ifError, currentSalarie, loading, competences, competencesNote, competencesError, competencesErrorDoublon } = this.state;
    return (
      <div className="submit-form">
        <div>
          <form name="createEmployee" onSubmit={this.saveEmployee}>
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
                    value={currentSalarie.nom || ""}
                    required
                    placeholder="Saisir un nom"
                  />
                  <span className="text-danger" >{currentErrors.lastname}</span>
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
                    value={currentSalarie.prenom || ""}
                    onChange={this.handleChange}
                    required
                    placeholder="Saisir un prénom"
                  />
                  <span className="text-danger">{currentErrors.firstname}</span>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="genre">Genre</label>
                  <CSelect
                    custom
                    className={currentErrors.nationalite ? "form-control is-invalid" : "form-control"}
                    name="genre"
                    id="genre"
                    onChange={this.handleChange}
                    defaultValue={"0"}
                    required
                  >
                    <option value="0" disabled>GENRE</option>
                    <option value="HOMME">HOMME</option>
                    <option value="FEMME">FEMME</option>
                    <option value="PAS_EXPRIMER">Ne souhaite pas s'exprimer</option>

                  </CSelect>

                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="email" className={currentErrors.email ? "font-weight-bold text-danger" : "font-weight-bold"}>Email </label>
                  <input
                    type="email"
                    name="email"
                    className={currentErrors.email ? "form-control is-invalid" : "form-control"}
                    id="email"
                    onChange={this.handleChange}
                    required
                    placeholder="Saisir une adresse mail"
                  />
                  <span className="text-danger">{currentErrors.email}</span>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="dayOfBirth" className={currentErrors.birthday ? "font-weight-bold text-danger" : "font-weight-bold"} >Date de naissance *</label>
                  <input
                    type="date"
                    name="birthday"
                    className={currentErrors.birthday ? "form-control is-invalid" : "form-control"}
                    id="dayOfBirth"
                    value={currentSalarie.dateNaissance || ""}
                    onChange={this.handleChange}
                    required
                  />

                  <span className="text-danger">{currentErrors.birthday}</span>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
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
                  <option value="0" disabled>Veuillez sélectionner un pays</option>
                  {countries.map((country, key) => (
                    <option key={key} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </CSelect>
                <span className="text-danger">{currentErrors.country}</span>
              </div>

              <div className="col">
                <div className="form-group">
                  <label htmlFor="numeroSecuriteSocial" className={currentErrors.numeroSecuriteSocial ? "font-weight-bold text-danger" : "font-weight-bold"}>Numéro Sécurité Social</label>
                  <input
                    type="text"
                    name="numeroSecuriteSocial"
                    className={currentErrors.numeroSecuriteSocial ? "form-control is-invalid" : "form-control"}
                    id="numeroSecuriteSocial"
                    onChange={this.handleChange}
                    placeholder="Numéro de la securité social"
                  />
                  <span className="text-danger">{currentErrors.numeroSecuriteSocial}</span>
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
                    onChange={this.handleChange}
                    placeholder="Ville de Naissance"
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
                    onChange={this.handleChange}
                    placeholder="département de Naissance"
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
                    onChange={this.handleChange}
                    placeholder="Nom et prénom du contact d'urgence"
                  />
                  <span className="text-danger">{currentErrors.contactUrgence}</span>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="numeroContactUrgence" className={currentErrors.nomPrenomContactUrgence ? "font-weight-bold text-danger" : "font-weight-bold"}>Numéro contact d'urgence</label>
                  <input
                    type="text"
                    name="numeroContactUrgence"
                    className={currentErrors.departement ? "form-control is-invalid" : "form-control"}
                    id="numeroContactUrgence"
                    onChange={this.handleChange}
                    placeholder="Numéro de la personne à contacter en cas urgence"
                  />
                  <span className="text-danger">{currentErrors.departement}</span>
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
                    onChange={this.handleChange}
                    placeholder="Saisir un numéro"
                  />
                  <span className="text-danger">{currentErrors.phonePerso}</span>
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
                    onChange={this.handleChange}
                    placeholder="Saisir un numéro"
                  />
                  <span className="text-danger">{currentErrors.phoneMPerso}</span>
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
                    onChange={this.handleChange}
                    placeholder="Saisir un numéro"
                  />
                  <span className="text-danger">{currentErrors.phonePro}</span>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="phoneMPro" className={currentErrors.phoneMPro ? "font-weight-bold text-danger" : "font-weight-bold"}>Tél. Mobile pro</label>
                  <input
                    type="text"
                    name="phoneMPro"
                    className={currentErrors.phoneMPro ? "form-control is-invalid" : "form-control"}
                    id="phoneMPro"
                    onChange={this.handleChange}
                    placeholder="Saisir un numéro"
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
                      <input type="text" name="number" className="form-control" id="number" placeholder="Saisir le numéro de l'adresse" onChange={this.handleChange} required />
                      <span className="text-danger">{currentErrors.number}</span>
                    </div>
                    <div className="col">
                      <label htmlFor="route">Voie*</label>
                      <input type="text" name="route" className="form-control" id="route" placeholder="Sasir le nom de la voie" onChange={this.handleChange} required />
                      <span className="text-danger">{currentErrors.route}</span>
                    </div>
                  </div>
                  <div className="row m-1">
                    <div className="col">
                      <label htmlFor="cpltAddress">Complément d'adresse</label>
                      <input type="text" name="cpltAddress" className="form-control" id="cpltAddress" placeholder="Saisir un complément d'adresse" onChange={this.handleChange} />
                      <span className="text-danger">{currentErrors.complementAddress}</span>
                    </div>
                    <div className="col">
                      <label htmlFor="town">Ville*</label>
                      <input type="text" name="town" className="form-control" id="town" placeholder="Saisir une ville" onChange={this.handleChange} required />
                      <span className="text-danger">{currentErrors.town}</span>
                    </div>
                  </div>
                  <div className="row m-1">
                    <div className="col">
                      <label htmlFor="zipCode">Code Postal*</label>
                      <input type="text" name="zipCode" className="form-control" id="zipCode" placeholder="Saisir un code postal" onChange={this.handleChange} required />
                      <span className="text-danger">{currentErrors.zipCode}</span>
                    </div>
                    <div className="col">
                      <label htmlFor="country">Pays*</label>
                      <CSelect
                        custom
                        className={currentErrors.country ? "form-control is-invalid" : "form-control"}
                        name="country"
                        id="country"
                        onChange={this.handleChange}
                        defaultValue={"France"}
                        required
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
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="service" className={currentErrors.service ? "font-weight-bold text-danger" : "text-center font-weight-bold"}>Service *</label>
                  <CSelect
                    custom
                    className={currentErrors.service ? "form-control is-invalid" : "form-control"}
                    name="service"
                    id="service"
                    onChange={this.handleChange}
                  >
                    <option value="0">Veuillez sélectionner un service</option>
                    {domains.map((service, key) => (
                      <option key={key} value={service.id}>
                        {service.titre}
                      </option>
                    ))}
                  </CSelect>
                  <span className="text-danger">{currentErrors.service}</span>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="company" className={currentErrors.company ? "font-weight-bold text-danger" : "font-weight-bold"}>Entreprise *</label>
                  <CSelect
                    className={currentErrors.company ? "form-control is-invalid" : "form-control"}
                    custom
                    name="company"
                    id="company"
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
                              <option key={key} value={e.id}>
                                {`${e.nom} (${e.id})`}
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
                            <option value="0" defaultValue>Note de la compétence</option>
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
              </div>
            </div>
            <div className="row mt-2">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="roles" className={currentErrors.role ? "font-weight-bold text-danger" : "text-center font-weight-bold"}>Rôle *</label>
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
            <div className="row">

              <div className="col">
                <CButton type="submit" block color="info" disabled={loading}>
                  {loading && <CSpinner size="sm" variant="border" />} Ajout d'un salarié
                </CButton>
              </div>
              <div className="col">

                <CButton className="mt-1" to={"/salaries/liste"} block color="danger" title="Vous voulez annuler ?">
                  Annuler
                </CButton>
              </div>

            </div>

          </form>
          {ifError != null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
        </div >
      </div >
    );
  }
}
export default withRouter(CreateSalarie);
