import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CFormGroup,
  CInputFile,
  CLabel,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
  CTabs
} from "@coreui/react";
import { faFilePdf, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FileSaver from 'file-saver';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import momentFR from 'moment/locale/fr';
import React, { Component } from "react";
import ReactPaginate from 'react-paginate';
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import posteService from "src/services/poste.service";
import swal from "sweetalert";
import { default as SalariesService, default as salariesService } from "../../services/salaries.service";
import signatureService from "../../services/signature.service";
import EntretienPersonnelDashboard from "../Dashboard/entretienPersonnelDashboard";
import DossierSalarie from "./DossierSalarie";
import SalarieRqth from "./SalarieRQTH";
import SalarieEtranger from "./SalarieEtranger";
import formationsService from "../../services/formations.service";
import competenceService from "../../services/competence.service";


class Salarie extends Component {
  _isMounted = false;
  col = "";
  order = "ASC";
  downArrow = "faArrowDown";
  upArrow = "faArrowUp"

  constructor(props) {
    super(props);
    this.changeProfil = this.changeProfil.bind(this);
    this.getSignature = this.getSignature.bind(this);
    this.onChangeSignature = this.onChangeSignature.bind(this);
    this.deleteSignature = this.deleteSignature.bind(this);
    this.contratPDF = this.contratPDF.bind(this);
    this.state = {
      currentUser: jwt_decode(this.props.user),
      acces: jwt_decode(this.props.acces),
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
        signatureBase64: "",
        nationalite: "",
        numeroSecuriteSocial: "",
        deptNaissance: "",
        villeNaissance: "",
        nomPrenomContactUrgence: "",
        numeroContactUrgence: "",
        adresse: {
          id: 0,
          version: null,
        },
        domaine: {
          id: 0,
          version: null,
        },
        entreprise: {
          id: 0,
          version: null,
        },
        conges: [],
        visitesMedicales: [],
        postes: [{
          id: 0,
          titrePoste: {},
          typeContrat: {},
          dateDebut: null,
          dateFin: null,
          volumeHoraire: 0.0,
          volumeJournalier: 0.0,
          manager: {},
          fichierContrat: {},
          lieuTravail: {},
          description: null,
          competencesRequises: [],
          maitreApprentissage: {},
          domaine: {},
          position: null,
          coefficient: 0.0,
          remunerationBrut: 0.0,
          coefficientTravailler: 0.0,
          dureePeriodeEssaie: 0,
          debutFormation: null,
          finFormation: null,
          version: 0,
        }],
        roles: [],
        competences: [{
          id: 0,
          competence: {
            id: 0,
            nom: null,
            domaine: [{
              id: 0,
              titre: null,
            }]
          },
          salarie: {
            id: 0,
          }
        }],
        formations: [],
        manager: {},
        actif: true,
        version: null,
      },
      errors: {},
      offsetSkill: 0,
      perPageSkill: 5,
      pageCountSkill: 0,
      offsetTraining: 0,
      perPageTraining: 5,
      pageCountTraining: 0,
      offsetPoste: 0,
      perPagePoste: 5,
      pageCountPoste: 0,
      offsetConge: 0,
      perPageConge: 5,
      pageCountConge: 0,
      offsetVisiteMedicale: 0,
      perPageVisiteMedicale: 5,
      pageCountVisiteMedicale: 0,
      signature: null,
      currentMessages: {
        messageType: null,
        messageTaille: null,
        messageSignature: null,
      },
      currentErrors: {
        errorType: false,
        errorTaille: false,
        errorSignature: false,
      },
      sort: {
        column: "titre",
        order: "ASC",
      },
    };
    moment.updateLocale('fr', momentFR);
  }

  componentDidMount() {
    this._isMounted = true;
    if (this.props.isRole >= 3) {
      salariesService.checkManager(parseInt(this.props.salarieId.id), this.state.currentUser.id).then((resp) => {
        if (parseInt(this.props.salarieId.id) === this.state.currentUser.id || resp.data === 1) {
          this.getSalarie(this.props.salarieId.id);
        } else {
          this.props.history.goBack();
        }
      }).catch(e => console.log(e))
    } else {
      this.getSalarie(this.props.salarieId.id);
      this.unlisten = this.props.history.listen((location, action) => {
        if (location !== null && location !== undefined) {
          if (location.state !== null && location.state !== undefined) {
            if (location.state !== this.state.currentSalarie.id) {
              this.getSalarie(location.state);
            }
          };
        }
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getSalarie(id) {
    SalariesService.getSalarieById(typeof id === "object" ? id.id : id)
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            currentSalarie: response.data,
          }, () => {
            this.getSignature(id);
          });
          const displaySkill = this.getPaginatedItems(this.state.currentSalarie.competences, 1);
          const displayTraining = this.getPaginatedItems(this.state.currentSalarie.formations, 2);
          const displayPoste = this.getPaginatedItems(this.state.currentSalarie.postes, 3);
          const displayConge = this.getPaginatedItems(this.state.currentSalarie.conges, 4);
          const displayVisiteMedicale = this.getPaginatedItems(this.state.currentSalarie.visitesMedicales, 5);
          const pageCountSkill = Math.ceil(this.state.currentSalarie.competences.length / this.state.perPageSkill);
          const pageCountTraining = Math.ceil(this.state.currentSalarie.formations.length / this.state.perPageTraining);
          const pageCountPoste = Math.ceil(this.state.currentSalarie.postes.length / this.state.perPagePoste);
          const pageCountConge = Math.ceil(this.state.currentSalarie.conges.length / this.state.perPageConge);
          const pageCountVisiteMedicale = Math.ceil(this.state.currentSalarie.visitesMedicales.length / this.state.perPageVisiteMedicale);
          this.setState({
            displaySkill,
            displayTraining,
            displayPoste,
            displayConge,
            displayVisiteMedicale,
            pageCountSkill,
            pageCountTraining,
            pageCountPoste,
            pageCountConge,
            pageCountVisiteMedicale
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getPaginatedItems(items, type) {
    switch (type) {
      case 1:
        return items.slice(this.state.offsetSkill, this.state.offsetSkill + this.state.perPageSkill);
      case 2:
        return items.slice(this.state.offsetTraining, this.state.offsetTraining + this.state.perPageTraining);
      case 3:
        return items.slice(this.state.offsetPoste, this.state.offsetPoste + this.state.perPagePoste);
      case 4:
        return items.slice(this.state.offsetConge, this.state.offsetConge + this.state.perPageConge);
      case 5:
        return items.slice(this.state.offsetVisiteMedicale, this.state.offsetVisiteMedicale + this.state.perPageVisiteMedicale);
      default:
        return false;
    }
  }

  getSignature(id) {
    signatureService.donwloadSignatureByIdSignature(id)
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            signature: response.data,
          });
          this.setState((prevState) => ({
            currentErrors: {
              ...prevState.currentErrors,
              errorType: false,
            },
            currentMessages: {
              ...prevState.currentMessages,
              messageType: null,
            }
          }));
        }
      })
      .catch((e) => {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            errorType: true,
          },
          currentMessages: {
            ...prevState.currentMessages,
            messageType: "Erreur : " + e.message,
          }
        }));
      });
  }
  onChangeSignature(e) {
    if (e.target.files[0].type.match("image/png") || e.target.files[0].type.match("image/jpeg") || e.target.files[0].type.match("image/gif") || e.target.files[0].type.match("image/webp")) {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          errorType: false,
        },
        currentMessages: {
          ...prevState.currentMessages,
          messageType: null,
        }
      }));
      if (e.target.files[0].size <= 1000000) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            errorTaille: false,
          },
          currentMessages: {
            ...prevState.currentMessages,
            messageTaille: null,
          }
        }));

        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('idSalarie', this.state.currentSalarie.id);

        signatureService.saveUpdateSignature(formData)
          .then((resp) => {
            this.setState({
              signature: resp.data,
            });
            this.setState((prevState) => ({
              currentErrors: {
                ...prevState.currentErrors,
                errorSignature: false,
              },
              currentMessages: {
                ...prevState.currentMessages,
                messageSignature: "Signature mise à jour",
              }
            }));
            //window.setTimeout(() => { this.props.history.push(`/salaries/profil/${resp.data.id}`) }, 2500)
          })
          .catch((e) => {
            this.setState((prevState) => ({
              currentErrors: {
                ...prevState.currentErrors,
                errorSignature: true,
              },
              currentMessages: {
                ...prevState.currentMessages,
                messageSignature: "Erreur : " + e.message,
              }
            }));
          });
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            errorTaille: true,
          },
          currentMessages: {
            ...prevState.currentMessages,
            messageTaille: "Fichier trop lourd, taille max : 1Mo.",
          }
        }));
      }
    } else {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          errorType: true,
        },
        currentMessages: {
          ...prevState.currentMessages,
          messageType: "Formats acceptés : png, jpeg, gif et webp.",
        }
      }));
    }
  }

  deleteSignature() {
    swal({
      title: "Êtes-vous sûrs ?",
      text: "Voulez-vous supprimer votre signature ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        signatureService.deleteSignature(this.state.currentSalarie.id)
          .then((resp) => {
            if (willDelete) {
              this.setState({
                signature: null,
              });
              swal("Suppression effectué.", {
                icon: "success",
              });
            }
          }).catch((e) => {
            swal("Erreur : " + e.message + ".", {
              icon: "error",
            });
          })
      });
  }

  changeProfil(e) {
    const target = e.target;
    this.props.history.push(`${target.pathname}`);
    this.getSalarie(parseInt(target.id));
  }

  handlePageClickSkill(data) {
    let selected = data.selected;
    let offset = Math.ceil(selected * this.state.perPageSkill);
    this.setState({ offsetSkill: offset }, () => {
      const displaySkill = this.getPaginatedItems(this.state.currentSalarie.competences, 1);
      this.setState({
        displaySkill,
      });
    });
  };

  handlePageClickTraining(data) {
    let selected = data.selected;
    let offset = Math.ceil(selected * this.state.perPageTraining);
    this.setState({ offsetTraining: offset }, () => {
      const displayTraining = this.getPaginatedItems(this.state.currentSalarie.formations, 2);
      this.setState({
        displayTraining,
      });
    });
  }

  handlePageClickPoste(data) {
    let selected = data.selected;
    let offset = Math.ceil(selected * this.state.perPagePoste);
    this.setState({ offsetPoste: offset }, () => {
      const displayPoste = this.getPaginatedItems(this.state.currentSalarie.postes, 3);
      this.setState({
        displayPoste,
      });
    });
  }

  handlePageClickConge(data) {
    let selected = data.selected;
    let offset = Math.ceil(selected * this.state.perPageConge);
    this.setState({ offsetConge: offset }, () => {
      const displayConge = this.getPaginatedItems(this.state.currentSalarie.conges, 4);
      this.setState({
        displayConge,
      });
    });
  }

  handlePageClickVisiteMedicale(data) {
    let selected = data.selected;
    let offset = Math.ceil(selected * this.state.perPageVisiteMedicale);
    this.setState({ offsetVisiteMedicale: offset }, () => {
      const displayVisiteMedicale = this.getPaginatedItems(this.state.currentSalarie.visitesMedicales, 5);
      this.setState({
        displayVisiteMedicale,
      });
    });
  }

  contratPDF(idPoste) {
    posteService.getContratPDF(idPoste).then(response => {
      const filename = response.headers['content-disposition'].split('filename=')[1];
      const blob = new Blob([response.data], { type: 'application/pdf' });
      FileSaver.saveAs(blob, `${filename}`);
    }).catch(e =>
      console.log("erreur telechargement PDF : ", e),
    )
  }

  trainingSort(column) {
    this.order = column === this.col && this.order === "ASC" ? "DESC" : "ASC";
    this.col = column;

    formationsService.getFormationsBySalarieId(this.state.currentSalarie.id, 0, 5, this.col, this.order)
      .then((res) => {
        this.setState({
          displayTraining: res.data
        })
      })
  }

  skillSort(column) {
    this.order = column === this.col && this.order === "ASC" ? "DESC" : "ASC";
    this.col = column;
    competenceService.getCompetencesBySalarieId(this.state.currentSalarie.id, 0, 5, this.col, this.order)
      .then((res) => {
        this.setState({
          displaySkill: res.data,
        })
      })
  }

  posteSort(column) {
    this.order = column === this.col && this.order === "ASC" ? "DESC" : "ASC";
    this.col = column;
    posteService.getPostesBySalarieId(this.state.currentSalarie.id, 0, 5, this.col, this.order)
      .then((res) => {
        this.setState({
          displayPoste: res.data,
        })
      })
  }

  congeSort(column) {
    this.order = column === this.col && this.order === "ASC" ? "DESC" : "ASC";
    this.col = column;
    salariesService.getAllCongeByIdSalarieAndKeyword(this.state.currentSalarie.id, 0, 5, "", this.col, this.order, "")
      .then((res) => {
        this.setState({
          displayConge: res.data,
        })
      })
  }

  visiteMedicaleSort(column) {
    this.order = column === this.col && this.order === "ASC" ? "DESC" : "ASC";
    this.col = column;
    salariesService.getAllVisiteMedicaleByIdSalarieAndKeyword(this.state.currentSalarie.id, 0, 5, null, this.col, this.order)
      .then((res) => {
        this.setState({
          displayVisiteMedicale: res.data,
        })
      })
  }

  nomTypeConge(typeConge) {
    if (typeConge === "CONGE_PAYE")
      return "Congé payé";
    if (typeConge === "CONGE_PAYE_MONETISE")
      return "Congé payé monétisé";
    if (typeConge === "CONGE_EVENEMENT_FAMILIAL")
      return "Congé évènement familial";
    if (typeConge === "CONGE_MATERNITE")
      return "Congé maternité";
    if (typeConge === "CONGE_PATERNITE")
      return "Congé parternité";
    if (typeConge === "CONGE_PARENTAL")
      return "Congé parental";
    if (typeConge === "CONGE_DE_FORMATION_PROFESSIONNELLE")
      return "Congé de formation professionnelle";
    if (typeConge === "CONGE_POUR_PREPARATION_EXAMEN")
      return "Congé pour préparation d'un éxamen";
    if (typeConge === "ABSENCE_NON_REMUNEREE")
      return "Absence non rémunérée";
    if (typeConge === "ARRET_MALADIE")
      return "Arrêt maladie";
    if (typeConge === "ACCIDENT_DU_TRAVAIL")
      return "Accident du travail";
    if (typeConge === "RTT_CHOISI")
      return "RTT choisi";
    if (typeConge === "RTT_IMPOSE")
      return "RTT imposé";
    if (typeConge === "RTT_MONETISE")
      return "RTT monétisé";
    if (typeConge === "REPOS_CADRE")
      return "Repos cadre";
    if (typeConge === "REGULARISATION_RTT")
      return "Régularisation RTT";
    if (typeConge === "CONGE_RECUPERATION")
      return "Congé récupération";
    if (typeConge === "CONGE_DE_SOLIDARITE")
      return "Congé de salidarité";
    if (typeConge === "CONGE_SANS_SOLDE")
      return "Congé sans solde";
    if (typeConge === "CONGE_SABBATIQUE")
      return "Congé sabbatique";
    if (typeConge === "COMPTE_EPARGNE_TEMPS")
      return "Compte épargne temps";
  }

  nomTypologieVisiteRdvRealise(type) {
    if (type === "VISITE_EMBAUCHE")
      return "Visite d'embauche";
    if (type === "VISITE_SUIVI")
      return "Visite de suivi";
    if (type === "VISITE_PRE_REPRISE")
      return "Visite de préreprise";
    if (type === "VISITE_REPRISE")
      return "Visite de reprise";
    if (type === "VISITE_DEMANDE_EMPLOYEUR")
      return "Visite à la demande de l'employeur";
    if (type === "SALARIE_PRESENT")
      return "Salarié présent";
    if (type === "SALARIE_ABSENT")
      return "Salarié absent";
  }

  downloadJustificatifConge = (id) => {
    SalariesService.getJustificatifConge(id).then(res => {
      const filename = res.headers['content-disposition'].split('filename=')[1];
      const blob = new Blob([res.data]);
      FileSaver.saveAs(blob, `${filename}`);
    }).catch(e =>
      console.log("Erreur lors du téléchargement : ", e),
    );
  }

  render() {
    const { currentSalarie, displaySkill, displayTraining, displayPoste, displayConge, displayVisiteMedicale, currentUser, signature, currentMessages, currentErrors, acces } = this.state;
    const { isRole } = this.props;
    // TODO : Ajouter select-option pour les type et input text pour la recherche
    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h3>Profil de {currentSalarie.prenom + " " + currentSalarie.nom}</h3>
            </CCardHeader>
            <CCardBody>
              <CTabs>
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink>
                      Informations générales
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Formations
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Compétences
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Signature
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Congés
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Visites Médicales
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Postes occupés
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Mes entretiens
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Mes Documents
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      RQTH
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Titre de séjour
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Départ
                    </CNavLink>
                  </CNavItem>
                </CNav>

                <CTabContent>
                  <CTabPane>
                    <CCard>
                      <CCardHeader>
                        <h4><FontAwesomeIcon icon={["far", "address-card"]} /> Description</h4>
                      </CCardHeader>
                      <CCardBody>
                        <div className="table-responsive">
                          <table className="table table-striped table-hover">
                            <tbody>
                              <tr>
                                <td className="font-weight-bold">Nom</td>
                                <td>{currentSalarie.nom}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Prenom</td>
                                <td>{currentSalarie.prenom}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Compte actif</td>
                                <td>{currentSalarie.actif ? <span className="text-success">OUI</span> : <span className="text-danger">NON</span>}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Genre</td>
                                <td>{currentSalarie.genre === "PAS_EXPRIMER" ? "Ne souhaite pas s'exprimer" : currentSalarie.genre}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Email (pro)</td>
                                <td>{currentSalarie.email}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Date de naissance</td>
                                <td>{moment(currentSalarie.dateNaissance).format("ll")}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Poste actuel</td>
                                <td>
                                  {currentSalarie.postes.map(
                                    (value, indexObject) => {
                                      if (indexObject === 0) {
                                        return (
                                          <div key={value.id}>
                                            {value.titrePoste.intitule}
                                          </div>
                                        );
                                      }
                                      return <div key={value.id}></div>;
                                    }
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Type de contrat</td>
                                <td>
                                  {currentSalarie.postes.map(
                                    (value, indexObject) => {
                                      if (indexObject === 0) {
                                        return (
                                          <div key={value.id}>
                                            {value.typeContrat.type}
                                          </div>
                                        );
                                      }
                                      return <div key={value.id}></div>;
                                    }
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Manager</td>
                                <td>
                                  {currentSalarie.manager !== null ? (
                                    <Link id={currentSalarie.manager.id} to={"/salaries/profil/" + currentSalarie.manager.id} onClick={this.changeProfil}>{currentSalarie.manager.prenom +
                                      " " + currentSalarie.manager.nom}
                                    </Link>
                                  ) : ("")}
                                </td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Tel (pro)</td>
                                <td>{currentSalarie.telProfessionnel}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Mobil (pro)</td>
                                <td>{currentSalarie.mobileProfessionnel}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Tel (personnel)</td>
                                <td>{currentSalarie.telPersonnel}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Mobil (personnel)</td>
                                <td>{currentSalarie.mobilPersonnel}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Adresse</td>
                                <td>{`${currentSalarie.adresse.numero} ${currentSalarie.adresse.voie
                                  } ${currentSalarie.adresse.codePostal} ${currentSalarie.adresse.ville
                                  } ${currentSalarie.adresse.complementAdresse || ""
                                  } `}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Companie</td>
                                <td>{currentSalarie.entreprise.nom}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Implantation</td>
                                <td>{currentSalarie.entreprise.nom}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Rôle</td>
                                <td>
                                  {currentSalarie.roles.map((d) => {
                                    return <div key={d.id}>{d.titre}</div>;
                                  })}
                                </td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Service</td>
                                <td>{currentSalarie.domaine.titre}</td>
                              </tr>

                              <tr>
                                <td className="font-weight-bold">Nationalité</td>
                                <td>{currentSalarie.nationalite}</td>
                              </tr>

                              <tr>
                                <td className="font-weight-bold">Département de Naissance</td>
                                <td>{currentSalarie.deptNaissance}</td>
                              </tr>

                              <tr>
                                <td className="font-weight-bold">Ville de Naissance</td>
                                <td>{currentSalarie.villeNaissance}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">N° Sécurité Social</td>
                                <td>{currentSalarie.numeroSecuriteSocial}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">contact en urgence</td>
                                <td>{currentSalarie.nomPrenomContactUrgence}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold">Numéro contact d'urgence</td>
                                <td>{currentSalarie.numeroContactUrgence}</td>
                              </tr>


                            </tbody>
                          </table>
                        </div>
                      </CCardBody>
                      <CCardFooter>
                        <CRow>
                          {(acces.acces.some(acces => acces.frontRoute === "/salaries/modification/:id")) && (
                            <CCol col="6" sm="6" md="6" xl="6" className="mb-3">
                              <CButton active block color="info" aria-pressed="true" to={"/salaries/modification/" + currentSalarie.id}>
                                <FontAwesomeIcon icon={["far", "edit"]} /> Modifier
                              </CButton>
                            </CCol>)}
                          {
                            (isRole === 1 || currentSalarie.id === currentUser.id) && (
                              <CCol col="6" sm="6" md="6" xl="6" className="mb-3">
                                <Link to={{ pathname: "/salaries/updatePassword", state: currentSalarie }}>
                                  <CButton type="button" block color="info">
                                    <FontAwesomeIcon icon={["fas", "lock"]} /> Modifier le mot de passe
                                  </CButton>
                                </Link>
                              </CCol>)}
                          {
                            (isRole === 1 || currentSalarie.id === currentUser.id) && (
                              <CCol col="6" sm="6" md="6" xl="6" className="mb-3">
                                <Link to={{ pathname: "/salaries/updatePassword", state: currentSalarie }}>
                                  <CButton type="button" block color="info">
                                    <FontAwesomeIcon icon={["fas", "lock"]} /> Modifier le mot de passe
                                  </CButton>
                                </Link>
                              </CCol>)}
                        </CRow>
                      </CCardFooter>
                    </CCard>
                  </CTabPane>

                  <CTabPane>
                    <CCard>
                      <CCardHeader><h4><FontAwesomeIcon icon={["fas", "align-justify"]} /> Liste des formations</h4></CCardHeader>
                      <CCardBody>
                        <div className="table-responsive">
                          <table className="table table-striped table-hover">
                            <thead>
                              <tr>
                                <th onClick={() => this.trainingSort("titre")}>Titre</th>
                                <th onClick={() => this.trainingSort("dateDebut")}>Date de début </th>
                                <th onClick={() => this.trainingSort("dateFin")}>Date de fin</th>
                                <th onClick={() => this.trainingSort("duree")}>Volume horaire</th>
                                <th onClick={() => this.trainingSort("prix")}>Prix <small>(HT)</small></th>
                              </tr>
                            </thead>
                            <tbody>
                              {displayTraining &&
                                displayTraining.length !== 0 ?
                                displayTraining.map((t) => {
                                  return (
                                    <tr key={t.id}>
                                      <td><Link to={`/formations/voir/${t.id}`}>{t.titre}</Link></td>
                                      <td>{moment(t.dateDebut).format("ll")}</td>
                                      <td>{moment(t.dateFin).format("ll")}</td>
                                      <td>{t.duree}</td>
                                      <td>{t.prix}</td>
                                    </tr>
                                  );
                                }) : (<tr><td colSpan="5" className="text-center font-weight-bold">Aucune formation</td></tr>)}
                            </tbody>
                          </table>
                        </div>
                        {this.state.pageCountTraining > 1 && (<ReactPaginate
                          name="test"
                          previousLabel={'Précédent'}
                          nextLabel={'Suivant'}
                          breakLabel={'...'}
                          pageCount={this.state.pageCountTraining}
                          pageRangeDisplayed={5}
                          marginPagesDisplayed={2}
                          onPageChange={this.handlePageClickTraining.bind(this)}
                          containerClassName={"pagination"}
                          subContainerClassName={"pages pagination"}
                          activeClassName={"active"}
                          pageLinkClassName="page-link"
                          breakLinkClassName="page-link"
                          nextLinkClassName="page-link"
                          previousLinkClassName="page-link"
                          pageClassName="page-item"
                          breakClassName="page-item"
                          nextClassName="page-item"
                          previousClassName="page-item"
                        />)}
                      </CCardBody>
                    </CCard>
                  </CTabPane>

                  <CTabPane>
                    <CCard className=" mt-3">
                      <CCardHeader><h4><FontAwesomeIcon icon={["fas", "list"]} /> Liste des competences</h4></CCardHeader>
                      <CCardBody>
                        <div className="table-responsive">
                          <table className="table table-striped table-hover">
                            <thead>
                              <tr>
                                <th>Nom de la compétence</th>
                                <th>Note</th>
                              </tr>
                            </thead>
                            <tbody>
                              {displaySkill &&
                                displaySkill.length !== 0 ?
                                displaySkill.map((d) => {
                                  return (
                                    <tr key={d.id}>
                                      <td>{d.competence.nom}</td>
                                      <td>{d.note}</td>
                                    </tr>
                                  );
                                }) : (<tr><td colSpan="5" className="text-center font-weight-bold">Aucune compétence</td></tr>)
                              }
                            </tbody>
                          </table>
                        </div>
                        {this.state.pageCountSkill > 1 && (<ReactPaginate
                          previousLabel={'Précédent'}
                          nextLabel={'Suivant'}
                          breakLabel={'...'}
                          pageCount={this.state.pageCountSkill}
                          pageRangeDisplayed={5}
                          marginPagesDisplayed={2}
                          onPageChange={this.handlePageClickSkill.bind(this)}
                          containerClassName={"pagination"}
                          subContainerClassName={"pages pagination"}
                          activeClassName={"active"}
                          pageLinkClassName="page-link"
                          breakLinkClassName="page-link"
                          nextLinkClassName="page-link"
                          previousLinkClassName="page-link"
                          pageClassName="page-item"
                          breakClassName="page-item"
                          nextClassName="page-item"
                          previousClassName="page-item"
                        />)}
                      </CCardBody>
                    </CCard>
                  </CTabPane>

                  <CTabPane>
                    <CCard>
                      <CCardHeader>
                        <CRow>
                          <CCol lg={11} >
                            <h4>Signature</h4>
                          </CCol>
                          {parseInt(this.props.salarieId.id) === this.state.currentUser.id | isRole === 1 | isRole === 2 && (
                            <CCol lg={1}>
                              <CButton className="float-right"
                                color="danger"
                                onClick={this.deleteSignature}
                                title="Vous voulez supprimer votre signature ?"
                              >{" "}<FontAwesomeIcon icon={faTrash} />
                              </CButton>
                            </CCol>)}
                        </CRow>
                      </CCardHeader>
                      <CCardBody>
                        <CFormGroup row>
                          <CContainer>
                            {parseInt(this.props.salarieId.id) === this.state.currentUser.id | isRole === 1 | isRole === 2 && (
                              <CRow>
                                <CLabel col md={1}>Signature</CLabel>
                                <CCol xs="12" md={11}>
                                  <CInputFile custom id="custom-file-input" onChange={this.onChangeSignature} />
                                  <CLabel htmlFor="custom-file-input" id="signature" name="signature" variant="custom-file">
                                    Formats acceptés : png, jpeg, gif et webp. Taille max : 1Mo.
                                  </CLabel>
                                </CCol>
                              </CRow>)}
                            <CRow>
                              <CCol lg={12}>
                                {currentMessages.messageSignature ? <CAlert color={currentErrors.errorSignature ? "danger" : "success"}>{currentMessages.messageSignature}</CAlert> : ""}
                                {currentMessages.messageTaille ? <CAlert color={currentErrors.errorTaille ? "danger" : "success"}>{currentMessages.messageTaille}</CAlert> : ""}
                                {currentMessages.messageType ? <CAlert color={currentErrors.errorType ? "danger" : "success"}>{currentMessages.messageType}</CAlert> : ""}
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol lg={12}>
                                {signature && <img src={`data:image/jpeg;base64,${signature}`} className="rounded float-left img-signature mt-2" alt="Signature" />}
                              </CCol>
                            </CRow>
                          </CContainer>
                        </CFormGroup>
                      </CCardBody>
                    </CCard>
                  </CTabPane>

                  <CTabPane>
                    <CCard>
                      <CCardHeader>
                        <CRow>
                          <CCol lg={10}>
                            <h4><FontAwesomeIcon icon={["fas", "align-justify"]} /> Congés</h4>
                          </CCol>
                          <CCol lg={2}>
                            <Link to={{ pathname: "/salaries/profil/" + currentSalarie.id + "/ajout-conge", state: currentSalarie }}>
                              <CButton type="button" block color="info">
                                Ajouter un congé
                              </CButton>
                            </Link>
                          </CCol>
                        </CRow>
                      </CCardHeader>
                      <CCardBody>
                        <div className="table-responsive">
                          <table className="table table-hover table-striped table-bordered">
                            <thead title="Cliquer pour trier">
                              <tr>
                                <th onClick={() => this.congeSort("dateDebut")}>Date de début</th>
                                <th onClick={() => this.congeSort("commenceApresMidi")}>Commence l'après-midi</th>
                                <th onClick={() => this.congeSort("dateFin")}>Date de fin</th>
                                <th onClick={() => this.congeSort("finiApresMidi")}>Fini l'après-midi</th>
                                <th onClick={() => this.congeSort("duree")}>Durée (en Jour)</th>
                                <th onClick={() => this.congeSort("typeConge")}>type de congé</th>
                                <th>Commentaire</th>
                                <th onClick={() => this.congeSort("lienJustificatif")}>Justificatif</th>
                              </tr>
                            </thead>
                            <tbody>
                              {displayConge &&
                                displayConge.length !== 0 ?
                                displayConge.map((conge) =>
                                  <tr key={conge.id}>
                                    <td>{moment(conge.dateDebut).format("DD-MM-YYYY")}</td>
                                    <td>{conge.commenceApresMidi ? "OUI" : "NON"}</td>
                                    <td>{moment(conge.dateFin).format("DD-MM-YYYY")}</td>
                                    <td>{conge.finiApresMidi ? "OUI" : "NON"}</td>
                                    <td>{conge.duree}</td>
                                    <td>{this.nomTypeConge(conge.typeConge)}</td>
                                    <td>{conge.commentaire}</td>
                                    <td>{conge.lienJustificatif !== null && <button className="btn btn-link" onClick={() => this.downloadJustificatifConge(conge.id)}>Justificatif</button>}</td>
                                  </tr>
                                ) : <tr><td colSpan="8" className="text-center font-weight-bold">Aucun congé</td></tr>}
                            </tbody>
                          </table>
                        </div>
                        {this.state.pageCountConge > 1 && (<ReactPaginate
                          name="test"
                          previousLabel={'Précédent'}
                          nextLabel={'Suivant'}
                          breakLabel={'...'}
                          pageCount={this.state.pageCountConge} // count Total des congés
                          pageRangeDisplayed={5}
                          marginPagesDisplayed={2}
                          onPageChange={this.handlePageClickConge.bind(this)}
                          containerClassName={"pagination"}
                          subContainerClassName={"pages pagination"}
                          activeClassName={"active"}
                          pageLinkClassName="page-link"
                          breakLinkClassName="page-link"
                          nextLinkClassName="page-link"
                          previousLinkClassName="page-link"
                          pageClassName="page-item"
                          breakClassName="page-item"
                          nextClassName="page-item"
                          previousClassName="page-item"
                        />)}
                      </CCardBody>
                    </CCard>
                  </CTabPane>

                  <CTabPane>
                    <CCard>
                      <CCardHeader>
                        <CRow>
                          <CCol lg={10}>
                            <h4><FontAwesomeIcon icon={["fas", "align-justify"]} /> Visites Médicales</h4>
                          </CCol>
                          <CCol lg={2}>
                            {(isRole === 1 || isRole === 2) &&
                              <Link to={{ pathname: "/salaries/profil/" + currentSalarie.id + "/ajout-visite-medicale", state: currentSalarie }}>
                                <CButton type="button" block color="info">
                                  Ajouté une visite médicale
                                </CButton>
                              </Link>
                            }
                          </CCol>
                        </CRow>
                      </CCardHeader>
                      <CCardBody>
                        <div className="table-responsive">
                          <table className="table table-hover table-striped table-bordered">
                            <thead title="Cliquer pour trier">
                              <tr>
                                <th onClick={() => this.visiteMedicaleSort("dateVisite")}>Date de la visite</th>
                                <th onClick={() => this.visiteMedicaleSort("dateFinValidite")}>Date de fin de validitée</th>
                                <th onClick={() => this.visiteMedicaleSort("typologieVisite")}>Typologie de la visite</th>
                                <th onClick={() => this.visiteMedicaleSort("nomCentreMedical")}>Centre médical</th>
                                <th>Commentaire</th>
                                <th onClick={() => this.visiteMedicaleSort("rdvRealise")}>Rendez-vous réalisé ?</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {displayVisiteMedicale &&
                                displayVisiteMedicale.length !== 0 ?
                                displayVisiteMedicale.map((vm) =>
                                  <tr key={vm.id}>
                                    <td>{moment(vm.dateVisite).format("DD-MM-YYYY HH:mm")}</td>
                                    <td>{moment(vm.dateFinValidite).format("DD-MM-YYYY")}</td>
                                    <td>{this.nomTypologieVisiteRdvRealise(vm.typologieVisite)}</td>
                                    <td>{vm.nomCentreMedical}</td>
                                    <td>{vm.commentaire}</td>
                                    <td>{this.nomTypologieVisiteRdvRealise(vm.rdvRealise)}</td>
                                    <td>{(isRole === 1 || isRole === 2) &&
                                      <Link to={{ pathname: `/salaries/profil/${currentSalarie.id}/modifier-visite-medicale/${vm.id}`, state: currentSalarie }}>
                                        <CButton type="button" block color="info">
                                          Modifier la visite médicale
                                        </CButton>
                                      </Link>
                                    }</td>
                                  </tr>
                                ) : <tr><td colSpan="8" className="text-center font-weight-bold">Aucune visite médicale</td></tr>}
                            </tbody>
                          </table>
                        </div>
                        {this.state.pageCountVisiteMedicale > 1 && (<ReactPaginate
                          name="test"
                          previousLabel={'Précédent'}
                          nextLabel={'Suivant'}
                          breakLabel={'...'}
                          pageCount={this.state.pageCountVisiteMedicale} // count Total des visite médicale
                          pageRangeDisplayed={5}
                          marginPagesDisplayed={2}
                          onPageChange={this.handlePageClickVisiteMedicale.bind(this)}
                          containerClassName={"pagination"}
                          subContainerClassName={"pages pagination"}
                          activeClassName={"active"}
                          pageLinkClassName="page-link"
                          breakLinkClassName="page-link"
                          nextLinkClassName="page-link"
                          previousLinkClassName="page-link"
                          pageClassName="page-item"
                          breakClassName="page-item"
                          nextClassName="page-item"
                          previousClassName="page-item"
                        />)}
                      </CCardBody>
                    </CCard>
                  </CTabPane>

                  <CTabPane>
                    <CCard>
                      <CCardHeader>
                        <CRow>
                          <CCol lg={10}>
                            <h4><FontAwesomeIcon icon={["fas", "align-justify"]} /> Liste des postes</h4>
                          </CCol>
                          {isRole === 1 | isRole === 2 &&
                            <CCol lg={2}>
                              <Link to={{ pathname: "/salaries/profil/" + currentSalarie.id + "/poste/creation", state: currentSalarie }}>
                                <CButton type="button" block color="info">
                                  Ajouter un poste
                                </CButton>
                              </Link>
                            </CCol>
                          }
                        </CRow>
                      </CCardHeader>
                      <CCardBody>
                        <div className="table-responsive">
                          <table className="table table-hover table-striped table-bordered">
                            <thead>
                              <tr>
                                <th onClick={() => this.posteSort("titrePoste.intitule")}>Poste</th>
                                <th onClick={() => this.posteSort("typeContrat.type")}>Type de contrat</th>
                                <th onClick={() => this.posteSort("domaine.titre")}>Service</th>
                                <th onClick={() => this.posteSort("manager.prenom")}>Manager</th>
                                <th onClick={() => this.posteSort("salarie.entreprise.nom")}>Entreprise</th>
                                <th onClick={() => this.posteSort("maitreApprentissage.nom")}>Maitre d'apprentissage</th>
                                <th onClick={() => this.posteSort("dateDebut")}>Date d'arrivée</th>
                                <th onClick={() => this.posteSort("dateFin")}>Date de départ</th>
                                <th>Action</th>
                                <th>Contrat</th>
                              </tr>
                            </thead>
                            <tbody>
                              {displayPoste &&
                                displayPoste.length !== 0 ?
                                displayPoste.map((poste, index) =>
                                  <tr key={poste.id}>
                                    <td>{poste.titrePoste.intitule}</td>
                                    <td>{poste.typeContrat.type}</td>
                                    <td>{poste.domaine.titre}</td>
                                    <td>{poste.manager != null ? poste.manager.nom + " " + poste.manager.prenom : "Aucun(e)"}</td>
                                    <td>{poste.salarie.entreprise.nom}</td>
                                    <td>{poste.maitreApprentissage != null ? poste.maitreApprentissage.nom + " " + poste.maitreApprentissage.prenom : "Aucun"}</td>
                                    <td >{moment(poste.dateDebut).format("ll")}</td>
                                    <td >{poste.dateFin && moment(poste.dateFin).format("ll")}</td>
                                    <td>
                                      <Link to={{ pathname: `/salaries/profil/${currentSalarie.id}/poste/detail`, state: poste }}>
                                        <CButton type="button" color="info" className="mb-2">
                                          Détail du poste
                                        </CButton>
                                      </Link>
                                      {(isRole === 1 | isRole === 2) && index === 0 ?
                                        <Link to={{ pathname: "/salaries/profil/" + currentSalarie.id + "/poste/modification", state: poste }}>
                                          <CButton type="button" block color="info">
                                            <FontAwesomeIcon icon={["far", "edit"]} /> Modifier le poste
                                          </CButton>
                                        </Link> : ""}
                                    </td>
                                    <td><CButton onClick={() => this.contratPDF(poste.id)} color="info" className={'ml-3 mb-1'} ><FontAwesomeIcon icon={faFilePdf} /> Contrat pdf </CButton></td>
                                  </tr>
                                ) : <tr><td colSpan="11" className="text-center font-weight-bold">Aucun poste</td></tr>}
                            </tbody>
                          </table>
                        </div>
                        {this.state.pageCountPoste > 1 && (<ReactPaginate
                          name="test"
                          previousLabel={'Précédent'}
                          nextLabel={'Suivant'}
                          breakLabel={'...'}
                          pageCount={this.state.pageCountPoste} // count Total de poste
                          pageRangeDisplayed={5}
                          marginPagesDisplayed={2}
                          onPageChange={this.handlePageClickPoste.bind(this)}
                          containerClassName={"pagination"}
                          subContainerClassName={"pages pagination"}
                          activeClassName={"active"}
                          pageLinkClassName="page-link"
                          breakLinkClassName="page-link"
                          nextLinkClassName="page-link"
                          previousLinkClassName="page-link"
                          pageClassName="page-item"
                          breakClassName="page-item"
                          nextClassName="page-item"
                          previousClassName="page-item"
                        />)}
                      </CCardBody>
                    </CCard>
                  </CTabPane>
                  <CTabPane>
                    <EntretienPersonnelDashboard idUser={this.props.salarieId.id} />
                  </CTabPane>
                  <CTabPane>
                    <DossierSalarie salarie={{ id: this.props.salarieId.id, nom: currentSalarie.nom, prenom: currentSalarie.prenom }} />
                  </CTabPane>
                  <CTabPane>
                    <SalarieRqth salarie={{ id: this.props.salarieId.id, nom: currentSalarie.nom, prenom: currentSalarie.prenom }} />
                  </CTabPane>
                  <CTabPane>
                    <SalarieEtranger salarie={{ id: this.props.salarieId.id, nom: currentSalarie.nom, prenom: currentSalarie.prenom }} />
                  </CTabPane>
                  <CTabPane>
                    <CCard>
                      <CCardHeader>
                        <CRow>
                          <CCol lg={12}>
                            <h4><FontAwesomeIcon icon={["fas", "align-justify"]} /> Date de départ</h4>
                          </CCol>
                        </CRow>
                      </CCardHeader>
                      <CCardBody>
                        {
                         
                         currentSalarie.postes.length > 0 && currentSalarie.postes[0].typeContrat.type !== "CDI" ? "Départ le " + currentSalarie.postes[0].dateFin  : "Aucune date"
                        }
                        
                      </CCardBody>
                    </CCard>
                  </CTabPane>
                </CTabContent>
              </CTabs>
            </CCardBody>
          </CCard>
        </CCol >
      </CRow >
    );
  }
}
function mapStateToProps(state) {
  const { isRole, user, acces } = state.authen;
  return {
    isRole,
    user,
    acces
  };
}
export default withRouter(connect(mapStateToProps)(Salarie));
