
import { CButton, CCard, CCardBody, CCardHeader, CCol, CCollapse, CForm, CFormGroup, CInput, CInputGroup, CInputGroupAppend, CLabel, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane, CTabs, CTextarea } from "@coreui/react";
import moment from "moment";
import React, { Component } from "react";
import { withRouter } from "react-router";
import momentFR from 'moment/locale/fr';
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import entretienService from "src/services/entretien.service";
import salariesService from "src/services/salaries.service";
import posteFicheService from "../../services/poste-fiche.service";
import compteRenduService from "src/services/compte-rendu.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faEdit, faFilePdf, faHourglassHalf, faList, faLock, faSignature } from "@fortawesome/free-solid-svg-icons";
import jwt_decode from 'jwt-decode';
import swal from "sweetalert";
import ModalSignature from "./ModalSignature";
import FileSaver from 'file-saver';
import { ancienneteSalarieMoisAnnees, ancienneteSalarieMoisAnneesParPoste, compareDateHighestOrEqualDateCurrent, getUnique } from "src/utils/fonctions";
class ReadCompteRendu extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.findResponseByIdQuestion = this.findResponseByIdQuestion.bind(this);
    this.findChooose = this.findChooose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.compteRenduPDF = this.compteRenduPDF.bind(this);
    this.compteRenduPDFVide = this.compteRenduPDFVide.bind(this);
    this.state = {
      currentErrors: {
        resultatTravail: null, resultatTravailBool: true,
        implication: null, implicationBool: true,
        evolutionTechnique: null, evolutionTechniqueBool: true,
        conclure: null, conclureBool: true,
      },
      currentInterview: {
        id: null,
        participants: [{
          salarie: {
            id: null,
          },
          fonction: null,
        }],
        compteRendu: {
          id: null,
        }
      },
      user: {
        id: null,
      },
      posteFiches: null,
      salarie: {
        id: null,
        nom: null,
        prenom: null,
        email: null,
        telPersonnel: null,
        mobilPersonnel: null,
        adresse: {
          id: null,
          numero: null,
          voie: null,
          ville: null,
          complementAdresse: null,
          codePostal: null,
          pays: null,
          version: null
        },
        dateNaissance: null,
        telProfessionnel: null,
        mobileProfessionnel: null,
        domaine: {
          id: null,
          titre: null,
          version: null
        },
        roles: [],
        competences: [],
        entreprise: {
          id: null,
          nom: null,
          adresse: {
            id: null,
            numero: null,
            voie: null,
            ville: null,
            complementAdresse: null,
            codePostal: null,
            pays: null,
            version: null
          },
          version: null
        },
        formations: [],
        postes: [],
        signatureBase64: null,
        version: null

      },
      manager: {
        id: null,
        nom: null,
        prenom: null,
        email: null,
        domaine: {
          id: null,
          titre: null,
          version: null
        },
        roles: [],
        searchExpression: "",
        loading: false,
        entreprise: {
          id: null,
          nom: null,
          adresse: {
            id: null,
            numero: null,
            voie: null,
            ville: null,
            complementAdresse: null,
            codePostal: null,
            pays: null,
            version: null
          },
          version: null
        },
        version: null
      },
      typeEntretien: {},
      compteRendu: {
        id: null,
        compteRendu: null,
        dateCreation: null,
        resultatTravail: 0,
        implication: 0,
        evolutionTechnique: 0,
        conclusion: null,
        signatureManager: false,
        dateSigntureManager: null,
        signatureSalarie: false,
        dateSigntureSalarie: null,
        statut: null,
        reponses: [],
        questionnaire: {
          id: null,
          titre: null,
          questions:
            [
              {
                id: null,
                question: {
                  id: null,
                  intitule: null,
                  choix: {},
                  version: null
                },
                reponse: null,
                reponseChoix: null,
                commentaireManager: null,
                commentaireSalarie: null,
                version: null
              }
            ]
          ,
          version: null
        },
        version: null
      },
      collapse: false,
      save: false,
      entretiens: [],
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      itemsPerPage: 5,
      currentPage: 0,
      pageCount: 0,
    }
    moment.updateLocale("fr", momentFR);
  };

  componentDidMount() {
    const { state } = this.props.location;
    this.setState({ currentInterview: state })
    if (state === undefined) {
      this.props.history.push("/home");
    } else {
      this.retrieveEntretien(state.id);
      this.retrieveAllEntretienSalarie(state.id);
    }
    const token = JSON.parse(localStorage.getItem('token'));
    this.setState({ user: jwt_decode(token) })
  }

  getSalarie(id) {
    salariesService.getSalarieById(id)
      .then((response) => {
        this.setState({
          salarie: response.data,
          posteFiches: response.data.postes.map((poste) => { return poste.titrePoste.posteFiche })
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  retrieveEntretien(idEntretien) {

    entretienService.getEntretienById(idEntretien)
      .then(response => {
        let participants = response.data.participants;
        let salarieObj = participants.filter(par => par.fonction === "SALARIE");
        let managerObj = participants.filter(par => par.fonction === "MANAGER");
        this.setState({ currentInterview: response.data, salarie: salarieObj[0].salarie, manager: managerObj[0].salarie, participants: response.data.participants, typeEntretien: response.data.typeEntretien, compteRendu: response.data.compteRendu, statut: response.data.compteRendu.statut })
        this.getSalarie(salarieObj[0].salarie.id);
      })
      .catch(e => {
        console.log(e);
      });
  }

  toggle() {
    this.setState({
      collapse: !this.state.collapse
    });
  }


  findResponseByIdQuestion(idQuestion) {
    var rep = this.state.compteRendu.reponses.filter(element => element.question.id === idQuestion)
    return rep
  }

  findChooose(elem, id) {
    id = id - 1;
    return Object.values(elem.question.choix).filter((el, index) => index === id);
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "conclusion") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            conclure: "La conclusion est requis.",
            conclureBool: true
          },
          compteRendu: {
            ...prevState.compteRendu,
            conclusion: value,
          }
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            conclure: null,
            conclureBool: false
          },
          compteRendu: {
            ...prevState.compteRendu,
            conclusion: value,
          }
        }));
      }
    }

    if (name === "resultatTravail") {
      if (parseInt(value) >= 0 && parseInt(value) <= 1) {
        this.setState((prevState) => ({
          compteRendu: {
            ...prevState.compteRendu,
            resultatTravail: value,
          },
          currentErrors: {
            ...prevState.currentErrors,
            resultatTravail: null,
            resultatTravailBool: false
          }
        }));
      } else {
        this.setState((prevState) => ({
          compteRendu: {
            ...prevState.compteRendu,
            resultatTravail: 0,
          },
          currentErrors: {
            ...prevState.currentErrors,
            resultatTravail: "La note est obligatoire et doit être comprise entre 0 et 1.",
            resultatTravailBool: true
          }
        }));
      }
    }

    if (name === "implication") {
      if (parseInt(value) >= 0 && parseInt(value) <= 1) {
        this.setState((prevState) => ({
          compteRendu: {
            ...prevState.compteRendu,
            implication: value,
          },
          currentErrors: {
            ...prevState.currentErrors,
            implication: null,
            implicationBool: false
          }
        }));
      } else {
        this.setState((prevState) => ({
          compteRendu: {
            ...prevState.compteRendu,
            implication: 0,
          },
          currentErrors: {
            ...prevState.currentErrors,
            implication: "La note est obligatoire et doit être comprise entre 0 et 1.",
            implicationBool: true
          }
        }));
      }
    }

    if (name === "evolutionTechnique") {
      if (parseInt(value) >= 0 && parseInt(value) <= 1) {
        this.setState((prevState) => ({
          compteRendu: {
            ...prevState.compteRendu,
            evolutionTechnique: value,
          },
          currentErrors: {
            ...prevState.currentErrors,
            evolutionTechnique: "",
            evolutionTechniqueBool: false
          }
        }));
      } else {
        this.setState((prevState) => ({
          compteRendu: {
            ...prevState.compteRendu,
            evolutionTechnique: 0,
          },
          currentErrors: {
            ...prevState.currentErrors,
            evolutionTechnique: "La note est obligatoire et doit être comprise entre 0 et 1.",
            evolutionTechniqueBool: true
          }
        }));
      }
    }
  }

  FormValide() {
    const { currentErrors } = this.state;
    if (currentErrors.evolutionTechniqueBool &&
      currentErrors.implicationBool &&
      currentErrors.resultatTravailBool) {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          resultatTravail: this.state.resultatTravailBool ? "La note est obligatoire et doit être comprise entre 0 et 1." : null,
          implication: this.state.implicationBool ? "La note est obligatoire et doit être comprise entre 0 et 1." : null,
          evolutionTechnique: this.state.evolutionTechniqueBool ? "La note est obligatoire et doit être comprise entre 0 et 1." : null,
        }
      }));
      return true;
    } else {
      return false;
    }
  }

  closeComment() {
    const { compteRendu, currentErrors } = this.state;
    if (currentErrors.conclureBool && (compteRendu && compteRendu.conclusion === null)) {
      swal("Erreur !", "Veuillez saisir une conclusion.", "warning");
      this.setState((prevState) => ({
        currentErrors: {
          conclure: "La conclusion est obligatoire."
        }
      }));
    } else {
      if (this.FormValide()) {
        compteRenduService.update(this.state.compteRendu)
          .then((resp) => {
            this.retrieveEntretien(this.state.currentInterview.id);
          }).catch(e => console.log("Error", e))
        swal({
          title: "Êtes-vous sûrs ?",
          text: "Voulez-vous fermer l'espace commentaire ?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            compteRenduService.changeStatut("COMMENTAIRE_FERME_SIGNATURE_OUVERTE", this.state.compteRendu.id)
              .then(resp => {
                this.retrieveEntretien(this.state.currentInterview.id);
              }).catch(e => console.log(e))
          }
        });
      } else {
        swal("Erreur !", "Erreur dans le formulaire.", "warning");
      }
    }

  }

  closeQuestionnaire() {
    swal({
      title: "Êtes-vous sûrs ?",
      text: "Après la fermeture du questionnaire, le réponses ne seront plus modifiables.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        compteRenduService.changeStatut("QUESTION_FERME_COMMENTAIRE_OUVERT", this.state.compteRendu.id)
          .then(resp => {
            this.retrieveEntretien(this.state.currentInterview.id);
          }).catch(e => console.log(e))
      }
    });
  }

  compteRenduPDF(idEntretien) {
    compteRenduService.getCompteRenduPDF(idEntretien).then(response => {
      const filename = response.headers['content-disposition'].split('filename=')[1];
      const blob = new Blob([response.data], { type: 'application/pdf' });
      FileSaver.saveAs(blob, `${filename}`);
    }).catch(e =>
      swal("Erreur !", "Problème dans le téléchargement.", "error"),
    )
  }

  compteRenduPDFVide(idEntretien) {
    compteRenduService.getCompteRenduPDFVide(idEntretien).then(response => {
      const filename = response.headers['content-disposition'].split('filename=')[1];
      const blob = new Blob([response.data], { type: 'application/pdf' });
      FileSaver.saveAs(blob, `${filename}`);
    }).catch(e =>
      swal("Erreur !", "Problème dans le téléchargement.", "error"),
    )
  }

  retrieveAllEntretienSalarie(idUser) {
    entretienService.count(idUser, null, null, null).then((resp) => {
      let nbPage = Math.ceil(resp.data / this.state.itemsPerPage)
      this.setState({ pageCount: nbPage })
    }).catch((e) => { console.log(e) });
    entretienService.getAllEntretiensByPage(this.state.currentPage, this.state.itemsPerPage, idUser, null, null, null)
      .then(response => {
        this.setState({
          entretiens: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  handlePageClickEntretien = (data) => {
    let selected = data.selected;
    this.setState({ currentPage: selected }, () => {
      this.retrieveEntretien();
    });
  };

  findStatut(statut) {
    switch (statut) {
      case "ATTENTE_ENTRETIEN":
        return "En attente de l'entretien";
      case "QUESTION_OUVERTE":
        return "Ouvert";
      case "QUESTION_FERME_COMMENTAIRE_OUVERT":
        return "Questionnaire répondu / Commentaire ouvert";
      case "COMMENTAIRE_FERME_SIGNATURE_OUVERTE":
        return "Commentaire ferme / Signature ouvert";
      case "FERME":
        return "Ferme";
      default:
        return "En attente de l'entretien";
    }
  }

  downloadFile = (id) => {
    posteFicheService.getFile(id).then(res => {
      const filename = res.headers['content-disposition'].split('filename=')[1];
      const blob = new Blob([res.data]);
      FileSaver.saveAs(blob, `${filename}`);
    }).catch(e =>
      console.log("Erreur lors du téléchargement : ", e),
    );
  }

  render() {
    const style = {
      minHeight: "38px",
    };
    const { manager, salarie, compteRendu, collapse, currentInterview, user, statut, participants, currentErrors, entretiens, posteFiches } = this.state;
    const partiUser = currentInterview.participants.find(p => p.salarie.id === user.id);
    return (
      <>
        <CRow>
          <CCol xs="12" md="12" className="mb-4">
            <CCard>
              <CCardHeader>
                <h4>Compte rendu de {`${salarie.prenom} ${salarie.nom}`} du {moment(compteRendu.dateCreation).format("ll")}  </h4>
              </CCardHeader>
              <CCardBody>
                <CTabs>
                  <CNav variant="tabs">
                    <CNavItem>
                      <CNavLink>
                        Info. salarie
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink>
                        Liste des formations
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink>
                        Liste des postes
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink>
                        Fiches de poste
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink>
                        Entretiens Précédents
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink>
                        Liste des participants
                      </CNavLink>
                    </CNavItem>
                  </CNav>
                  <CTabContent>
                    <CTabPane>
                      <div className="table-responsive">
                        <table className="table table-striped table-hover">
                          <tbody>
                            <tr>
                              <td className="font-weight-bold">Nom</td>
                              <td>{salarie.nom}</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Prenom</td>
                              <td>{salarie.prenom}</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Email (pro)</td>
                              <td>{salarie.email}</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Date de naissance</td>
                              <td>{moment(salarie.dateNaissance).format("ll")}</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Poste actuel</td>
                              <td>
                                {salarie.postes && salarie.postes.map(
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
                              <td className="font-weight-bold">Lieu de travail</td>
                              <td>
                                {salarie.postes && salarie.postes.map(
                                  (value, indexObject) => {
                                    if (indexObject === 0) {
                                      return (
                                        <div key={value.id}>
                                          {`${value.lieuTravail.adresse.ville}, ${value.lieuTravail.adresse.pays}`}
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
                                {salarie.postes && salarie.postes.map(
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
                              <td className="font-weight-bold">Date d'arrivée</td>
                              <td>
                                {salarie.postes && salarie.postes.map(
                                  (value, indexObject) => {
                                    if (indexObject === 0) {
                                      return (
                                        <div key={value.id}>
                                          {moment(value.dateDebut).format("ll")}
                                        </div>
                                      );
                                    }
                                    return <div key={value.id}></div>;
                                  }
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Date de depart</td>
                              <td>
                                {salarie.postes && salarie.postes.map(
                                  (value, indexObject) => {
                                    if (indexObject === 0) {
                                      return (
                                        <div key={value.id}>
                                          {value.dateFin && moment(value.dateFin).format("ll")}
                                        </div>
                                      );
                                    }
                                    return <div key={value.id}></div>;
                                  }
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">Ancienneté</td>
                              <td>{ancienneteSalarieMoisAnnees(salarie.postes)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CTabPane>
                    <CTabPane>
                      <div className="table-responsive">
                        <table className="table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>Titre</th>
                              <th>Date de début </th>
                              <th>Date de fin</th>
                              <th>Volume horaire</th>
                              <th>Prix <small>(HT)</small></th>
                            </tr>
                          </thead>
                          <tbody>
                            {salarie.formations &&
                              salarie.formations.length !== 0 ?
                              salarie.formations.map((t) => {
                                return (
                                  <tr key={t.id}>
                                    <td><Link to={`/formations/voir/${t.id}`}>{t.titre}</Link></td>
                                    <td>{moment(t.dateDebut).format("ll")}</td>
                                    <td>{t.dateFin && moment(t.dateFin).format("ll")}</td>
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
                    </CTabPane>
                    <CTabPane>
                      <div className="table-responsive">
                        <table className="table table-hover table-striped table-bordered">
                          <thead>
                            <tr>
                              <th>Poste</th>
                              <th>Type de contrat</th>
                              <th>Service</th>
                              <th>Manager</th>
                              <th>Entreprise</th>
                              <th>Maitre d'apprentissage</th>
                              <th>Date d'arrivée</th>
                              <th>Date de départ</th>
                              <th>Ancienneté au poste</th>
                            </tr>
                          </thead>
                          <tbody>
                            {salarie.postes && salarie.postes.length === 0 ?
                              <tr><td colSpan="9" className="text-center font-weight-bold">Aucun poste</td></tr> :
                              salarie.postes && salarie.postes.map(poste =>
                                <tr key={poste.id}>
                                  <td>{poste.titrePoste.intitule}</td>
                                  <td>{poste.typeContrat.type}</td>
                                  <td>{poste.domaine.titre}</td>
                                  <td>{poste.manager != null ? `${poste.manager.nom} ${poste.manager.prenom}` : "Aucun(e)"}</td>
                                  <td>{poste.salarie.entreprise.nom}</td>
                                  <td>{poste.maitreAppretissage != null ? `${poste.maitreAppretissage.nom} ${poste.maitreAppretissage.prenom}` : "Aucun"}</td>
                                  <td>{moment(poste.dateDebut).format("ll")}</td>
                                  <td>{poste.dateFin && moment(poste.dateFin).format("ll")}</td>
                                  <td>{ancienneteSalarieMoisAnneesParPoste(poste)}</td>
                                </tr>
                              )}
                          </tbody>
                        </table>
                      </div>
                    </CTabPane>
                    <CTabPane>
                      <div>
                        {!posteFiches ?
                          "Aucune fiche de poste" : (
                            <div className="table-responsive">
                              <table className="table table-hover table-striped table-bordered">
                                <thead>
                                  <tr>
                                    <th>Fiches de poste</th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {getUnique(posteFiches, "id").map((posteFiche) =>
                                    <tr key={posteFiche.id}>
                                      <td>{posteFiche.nomFichier}</td>
                                      <td><CButton color="info" className="ml-2" onClick={() => this.downloadFile(posteFiche.id)}>Telecharger la Fiche de Poste</CButton></td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                      </div>
                    </CTabPane>
                    <CTabPane>
                      <div className="row mt-4">
                        <div className="col-lg-12 table-responsive">
                          <table className="table table-hover table-striped table-bordered ">
                            <thead>
                              <tr>
                                <th>Date/heure</th>
                                <th>Manager  (Prenom-Nom)</th>
                                <th>Type d'entretien</th>
                                <th>Status</th>
                                <th>Compte rendu</th>
                              </tr>
                            </thead>
                            {entretiens.length > 0 ? (
                              <tbody>
                                {entretiens.map(entretien =>
                                  <tr key={entretien.id}>
                                    <td>{moment(entretien.dateEntretien).format("llll")}</td>
                                    <td>
                                      {entretien.participants && entretien.participants.map(participant => participant.fonction === 'MANAGER' ? `${participant.salarie.prenom} ${participant.salarie.nom}` : "")}
                                    </td>
                                    <td>{entretien.typeEntretien.titre}</td>
                                    <td>{this.findStatut(entretien.compteRendu.statut)}</td>
                                    <td>{entretien.compteRendu === null || currentInterview.id === entretien.id ? "Aucun" : (
                                      <Link to={{ pathname: "/compterendu/read", state: entretien }}>
                                        <FontAwesomeIcon icon={["fas", "search"]} /> Voir le compte-rendu
                                      </Link>
                                    )}</td>
                                  </tr>
                                )}
                              </tbody>
                            ) : (
                              <tbody>
                                <tr>
                                  <td colSpan="6" className="text-center font-weight-bold" >Aucun entretien</td>
                                </tr>
                              </tbody>
                            )}
                          </table>
                          {this.state.pageCount > 1 && (<ReactPaginate
                            previousLabel={'Précédent'}
                            nextLabel={'Suivant'}
                            breakLabel={'...'}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={4}
                            onPageChange={this.handlePageClickEntretien}
                            containerClassName="pagination"
                            activeClassName="active"
                            pageLinkClassName="page-link"
                            breakLinkClassName="page-link"
                            nextLinkClassName="page-link"
                            previousLinkClassName="page-link"
                            pageClassName="page-item"
                            breakClassName="page-item"
                            nextClassName="page-item"
                            previousClassName="page-item"
                            forcePage={this.state.currentPage}
                          />)}

                        </div>
                      </div>
                    </CTabPane>
                    <CTabPane>
                      <div className="table-responsive">
                        <table className="table table-hover table-striped table-bordered">
                          <thead>
                            <tr>
                              <th>NOM - Prénom</th>
                              <th>Email</th>
                              <th>Fonction</th>
                              <th>Signature obligatoire</th>
                              <th>Signé</th>
                            </tr>
                          </thead>
                          <tbody>
                            {participants && participants.map(part =>
                              <tr key={part.salarie.id}>
                                <td>{`${part.salarie.nom} ${part.salarie.prenom}`}</td>
                                <td>{part.salarie.email}</td>
                                <td>{part.fonction}</td>
                                <td>{part.signatureObligatoire ? "OUI" : "NON"}</td>
                                <td>{part.signature ? <FontAwesomeIcon icon={faSignature} size="lg" color="green" title="Compte rendu signé" /> : <FontAwesomeIcon icon={faSignature} size="lg" color="red" title="Compte rendu non signé" />}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CTabPane>
                  </CTabContent>
                </CTabs>
                <hr></hr>
                <CForm onSubmit={this.addText}>
                  <CFormGroup>
                    <CRow>
                      <CCol xs="2" md="2" lg="2">
                        <CLabel htmlFor="resultatTravail">Résultat du travail</CLabel>
                      </CCol>
                      <CCol xs="10" md="10" lg="10">
                        <CInputGroup>
                          <CInput type="number" id="resultatTravail" name="resultatTravail" placeholder="Note /1 de résultat du travail" min="0" max="1" defaultValue="0" step="0.1" disabled={compteRendu.statut === "QUESTION_FERME_COMMENTAIRE_OUVERT" ? false : true} onChange={this.handleChange} />
                          <CInputGroupAppend>
                          </CInputGroupAppend>
                        </CInputGroup>
                        <span className="text-danger">{currentErrors.resultatTravail}</span>
                      </CCol>
                    </CRow>
                    <CRow className="mt-2">
                      <CCol xs="2" md="2" lg="2">
                        <CLabel htmlFor="implication">Implication</CLabel>
                      </CCol>
                      <CCol xs="10" md="10" lg="10">
                        <CInputGroup>
                          <CInput type="number" id="implication" name="implication" placeholder="Note /1 de l'implication" min="0" max="1" defaultValue="0" step="0.1" disabled={compteRendu.statut === "QUESTION_FERME_COMMENTAIRE_OUVERT" ? false : true} onChange={this.handleChange} />
                          <CInputGroupAppend>
                          </CInputGroupAppend>
                        </CInputGroup>
                        <span className="text-danger">{currentErrors.implication}</span>
                      </CCol>
                    </CRow>
                    <CRow className="mt-2">
                      <CCol xs="2" md="2" lg="2">
                        <CLabel htmlFor="evolutionTechnique">Évolution Technique</CLabel>
                      </CCol>
                      <CCol xs="10" md="10" lg="10">
                        <CInputGroup>
                          <CInput type="number" id="evolutionTechnique" name="evolutionTechnique" placeholder="Note /1 de l'Évolution Technique" min="0" max="1" defaultValue="0" step="0.1" disabled={compteRendu.statut === "QUESTION_FERME_COMMENTAIRE_OUVERT" ? false : true} onChange={this.handleChange} />
                          <CInputGroupAppend>
                          </CInputGroupAppend>
                        </CInputGroup>
                        <span className="text-danger">{currentErrors.evolutionTechnique}</span>
                      </CCol>
                    </CRow>
                  </CFormGroup>
                </CForm>

                <CForm onSubmit={this.addText}>
                  <CFormGroup row>
                    <CCol xs="2" md="2" lg="2">
                      <CLabel htmlFor="conclusion">Conclusion</CLabel>
                    </CCol>
                    <CCol xs="10" md="10" lg="10">
                      <CInputGroup>
                        <CTextarea
                          style={style}
                          readOnly={user && manager.id !== user.id}
                          name="conclusion"
                          id="conclusion"
                          disabled={compteRendu.statut === "QUESTION_FERME_COMMENTAIRE_OUVERT" ? false : true}
                          rows="1"
                          onChange={this.handleChange}
                          placeholder="Résume/conclusion de l'entretien..."
                          value={compteRendu.conclusion || ""}
                        />
                        <CInputGroupAppend>
                        </CInputGroupAppend>
                      </CInputGroup>
                      <span className="text-danger">{currentErrors.conclure}</span>
                    </CCol>
                  </CFormGroup>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard>
              <CCardHeader className="d-flex justify-content-between">
                {compteRendu.questionnaire && (<CButton color="primary" onClick={this.toggle} className={'mb-1'}><FontAwesomeIcon icon={faList} /> Voir le questionnaire</CButton>)}
                {user &&
                  (salarie.id === user.id && compteRendu.statut === "QUESTION_OUVERTE") && (
                    <CButton color="success" className={'ml-3 mb-1'} to={{ pathname: "/compterendu/read/answer", state: currentInterview }}>
                      <FontAwesomeIcon icon={faEdit} /> Répondre au questionnaire
                    </CButton>
                  )
                }
                {compteRendu.questionnaire && (user && ((salarie.id !== user.id) && (((compteRendu.statut === "QUESTION_OUVERTE" || compteRendu.statut === "ATTENTE_ENTRETIEN")) && (<span className="pull-right"><FontAwesomeIcon icon={faHourglassHalf} /> Veuillez attendre les réponses du questionnaire... </span>))))}
                {user && (manager.id === user.id || salarie.id === user.id) && compteRendu.questionnaire !== null && (compteRendu.statut === "QUESTION_FERME_COMMENTAIRE_OUVERT" && <span className="pull-right">
                  <CButton color="success" className={'ml-3 mb-1'} to={{ pathname: "/compterendu/read/comment", state: currentInterview }}>
                    <FontAwesomeIcon icon={faComment} /> Ajout de commentaire
                  </CButton> </span>)
                }
                {
                  (compteRendu.questionnaire === null && manager.id !== user.id) && (<span className="pull-right"><FontAwesomeIcon icon={faHourglassHalf} /> Veuillez attendre le manager de l'entretien... </span>)
                }
                {partiUser && !partiUser.signature && (compteRendu.statut === "COMMENTAIRE_FERME_SIGNATURE_OUVERTE" &&
                  <span className="pull-right">
                    <ModalSignature compteRenduId={compteRendu.id} salarieId={user.id} partiUser={partiUser} />
                  </span>)}

                {statut === "FERME" && <label>Tous les participants ont signés, un mail a été envoyé</label>}
                {user && (partiUser && (partiUser.id && compteRendu.statut === "QUESTION_FERME_COMMENTAIRE_OUVERT" && partiUser.fonction === "MANAGER" && (<CButton onClick={this.closeComment.bind(this)} color="warning" className={'ml-3 mb-1'}><FontAwesomeIcon icon={faLock} /> Fermer le compte-rendu </CButton>)))}
                {user && (partiUser && (partiUser.id && compteRendu.statut === "QUESTION_OUVERTE" && partiUser.fonction === "MANAGER" && !compareDateHighestOrEqualDateCurrent(currentInterview.dateEntretien) && (<CButton onClick={this.closeQuestionnaire.bind(this)} color="warning" className={'ml-3 mb-1'}><FontAwesomeIcon icon={faLock} /> Fermer le questionnaire et ouvrir les commentaires </CButton>)))}
                {user && ((compteRendu.statut === "FERME") && (<CButton onClick={() => this.compteRenduPDF(currentInterview.id)} color="info" className={'ml-3 mb-1'} ><FontAwesomeIcon icon={faFilePdf} /> Compte rendu pdf </CButton>))}
                {user && ((compteRendu.statut === "ATTENTE_ENTRETIEN") && (<CButton onClick={() => this.compteRenduPDFVide(currentInterview.id)} color="info" className={'ml-3 mb-1'} ><FontAwesomeIcon icon={faFilePdf} /> Compte rendu pdf vide </CButton>))}
              </CCardHeader>
              {compteRendu.questionnaire && (
                <CCollapse show={collapse}>
                  <CCardBody>
                    <h4>{compteRendu.questionnaire.titre}</h4>
                    {
                      // Afficher les questions par rapport au questionnaire(si le status est null ou 1)
                      compteRendu.statut === "QUESTION_OUVERTE" || compteRendu.statut === "ATTENTE_ENTRETIEN" || null ?
                        compteRendu.questionnaire.questions.map((question, key) =>
                          <div key={key}>
                            <label htmlFor={`question${question.id}`} className={"font-weight-bold"}>{question.intitule} </label>
                            {this.findResponseByIdQuestion(question.id).map(elem => <p>{elem.reponse || this.findChooose(elem, elem.reponseChoix)}</p>)}
                            <hr></hr>
                          </div>
                        ) : // Afficher les questions par rapport aux reponses (si le status est >= 1) 
                        compteRendu.reponses.map((el, key) =>
                          <div key={key}>
                            <label htmlFor={`question${el.question.id}`} className={"font-weight-bold"}>{el.question.intitule} </label>
                            {this.findResponseByIdQuestion(el.question.id).map((elem, index) => (
                              <CRow key={index}>
                                <CCol xs="12" md="12" lg="12">
                                  <p>{elem.reponse || this.findChooose(elem, elem.reponseChoix)}</p>
                                  <CRow >
                                    <CCol xs="6" md="6" lg="6" >
                                      <p>{elem.commentaireManager && (<span className="font-italic font-weight-bold">Commentaire manager : </span>)} {elem.commentaireManager}</p>
                                    </CCol>
                                    <CCol xs="6" md="6" lg="6">
                                      <p>{elem.commentaireSalarie && (<span className="font-italic font-weight-bold">Commentaire salarié : </span>)}{elem.commentaireSalarie}</p>
                                    </CCol>
                                  </CRow>
                                </CCol>
                              </CRow>
                            ))}
                            <hr></hr>
                          </div>
                        )
                    }
                  </CCardBody>
                </CCollapse>
              )}
            </CCard>
          </CCol>
        </CRow>
      </>
    );

  }
}

export default withRouter(ReadCompteRendu);
