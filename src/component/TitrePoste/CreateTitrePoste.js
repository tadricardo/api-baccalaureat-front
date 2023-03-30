import { CButton, CAlert, CSpinner, CSelect } from "@coreui/react";
import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import serviceService from "../../services/service.service";
import posteFicheService from "../../services/poste-fiche.service";
import TitrePosteService from "../../services/titre-poste.service";

class CreateRole extends Component {
  constructor(props) {
    super(props);
    this.reloadFileList = this.reloadFileList.bind(this);
    this.onChangeFichePoste = this.onChangeFichePoste.bind(this);
    this.onChangeTitrePoste = this.onChangeTitrePoste.bind(this);
    this.createTitrePoste = this.createTitrePoste.bind(this);
    this.getAllDomaine = this.getAllDomaine.bind(this);
    this.onChangeDomaine = this.onChangeDomaine.bind(this);
    this.state = {
      currentErrors: {
        title: null, titleBool: true,
        domaine: null, domaineBool: true,
        fichePoste: null, fichePosteBool: true,
      },
      currentTitrePoste: {
        id: null,
        intitule: "",
        domaine: {
          id: null
        },
        posteFiche: {
          id: null
        }
      },
      message: null,
      ifError: null,
      loading: false,
      domaines: [],
      posteFiches: [],
    };
  }

  componentDidMount() {
    this.getAllDomaine();
    this.reloadFileList();
  }

  reloadFileList = () => {
    posteFicheService.getAllPosteFiche().then((res) => {
      this.setState((prevState) => ({
        ...prevState,
        posteFiches: res.data
      }));
    });
  }

  onChangeFichePoste(e) {
    const idFiche = e.target.value;
    if ("0" !== idFiche) {
      this.setState((prevState) => ({
        currentTitrePoste: {
          ...prevState.currentTitrePoste,
          posteFiche: {
            id: idFiche
          }
        },
        currentErrors: {
          ...prevState.currentErrors,
          fichePoste: null,
          fichePosteBool: false
        }
      }))
    } else {
      this.setState((prevState) => ({
        currentTitrePoste: {
          ...prevState.currentTitrePoste,
          posteFiche: {
            id: idFiche
          }
        },
        currentErrors: {
          ...prevState.currentErrors,
          fichePoste: "La fiche du poste est obligatoire.",
          fichePosteBool: true
        }
      }));
    }
  }

  getAllDomaine() {
    serviceService.getAllService()
      .then(response => {
        this.setState({
          domaines: response.data,
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  onChangeDomaine(e) {
    const idDomaine = e.target.value;
    if ("0" !== idDomaine) {
      this.setState((prevState) => ({
        currentTitrePoste: {
          ...prevState.currentTitrePoste,
          domaine: {
            id: idDomaine
          }
        },
        currentErrors: {
          ...prevState.currentErrors,
          domaine: null,
          domaineBool: false
        }
      }))
    } else {
      this.setState((prevState) => ({
        currentTitrePoste: {
          ...prevState.currentTitrePoste,
          domaine: {
            id: idDomaine
          }
        },
        currentErrors: {
          ...prevState.currentErrors,
          domaine: "Le Service est obligatoire.",
          domaineBool: true
        }
      }));
    }
  }

  onChangeTitrePoste(e) {
    const titrePoste = e.target.value;
    if (titrePoste === "" || titrePoste === null || titrePoste.length === 0) {
      this.setState((prevState) => ({
        currentTitrePoste: {
          ...prevState.currentTitrePoste,
          intitule: titrePoste,
        },
        currentErrors: {
          ...prevState.currentErrors,
          title: "L'intitulé est requis.",
          titleBool: true
        }
      }));
    } else {
      this.setState((prevState) => ({
        currentTitrePoste: {
          ...prevState.currentTitrePoste,
          intitule: titrePoste,
        },
        currentErrors: {
          ...prevState.currentErrors,
          title: null,
          titleBool: false
        }
      }));
    }
  }

  validationForm() {
    const errors = this.state.currentErrors;
    if (!errors.domaineBool &&
      !errors.fichePosteBool &&
      !errors.titleBool) {
      return true; //Formulaire OK
    } else {
      this.setState((prevState) => ({
        message: "Une erreur est présente dans votre formulaire.",
        ifError: true,
        loading: false,
        currentErrors: {
          ...prevState.currentErrors,
          domaine: errors.domaineBool ? "Le Service est obligatoire." : null,
          fichePoste: errors.fichePosteBool ? "La fiche du poste est obligatoire." : null,
          title: errors.titleBool ? "L'intitulé est requis." : null,
        }
      }));
    }
  }

  createTitrePoste(e) {
    e.preventDefault();
    this.setState({ loading: true })
    if (this.validationForm()) {
      TitrePosteService.getTitrePosteByIdServiceOrAndName(this.state.currentTitrePoste.domaine.id, this.state.currentTitrePoste.intitule).then(resp => {
        if (resp.data.length === 0) {
          TitrePosteService.saveTitrePoste(this.state.currentTitrePoste)
            .then(response => {
              this.setState({
                currentTitrePoste: response.data,
                message: "Création bien prise en compte ! Redirection vers la liste des intitulés de poste.",
                ifError: false
              });
              window.setTimeout(() => { this.props.history.push("/titre-poste/liste") }, 2500);
            })
            .catch(e => {
              this.setState({
                message: e.message,
                ifError: true,
                loading: false
              });
            });
        } else {
          this.setState({
            message: "Cette intitule de poste existe déjà.",
            ifError: true,
            loading: false
          });
        }
      })
    }

  }

  render() {
    const { currentTitrePoste, currentErrors, ifError, message, loading, domaines, posteFiches } = this.state;
    return (
      <div>
        <div className="edit-form">
          <form name="createTitlePoste" onSubmit={this.createTitrePoste}>
            <div className="form-group">
              <label htmlFor="title">Créer un nouveau intitulé de poste</label>
              <input type="text" name="title" className="form-control" id="title" value={currentTitrePoste.intitule} onChange={this.onChangeTitrePoste} required />
              <span className="text-danger">{currentErrors.title}</span>
            </div>
            <div className="form-group">
              <label htmlFor="domaine">Service *</label>
              <CSelect custom name="domainePoste" id="domainePoste" onChange={this.onChangeDomaine} required>
                <option value="0">Veuillez sélectionner un Service</option>
                {domaines.map((domaine, key) => (
                  <option key={key} value={domaine.id}>
                    {domaine.titre}
                  </option>
                ))}
              </CSelect>
              <span className="text-danger">{currentErrors.domaine}</span>
            </div>
            <div className="form-group">
              <label htmlFor="domaine">Fiche du poste *</label>
              <CSelect custom name="domainePoste" id="domainePoste" onChange={this.onChangeFichePoste} required>
                <option value="0">Veuillez sélectionner une fiche de poste</option>
                {posteFiches.map((fiche, key) => (
                  <option key={key} value={fiche.id}>
                    {fiche.nomFichier}
                  </option>
                ))}
              </CSelect>
              <span className="text-danger">{currentErrors.fichePoste}</span>
            </div>
            <CButton type="submit" block color="info" disabled={loading}>
              {loading && <CSpinner size="sm" variant="border" />} Créer cette intitulé de poste
            </CButton>
            <Link to={"/titre-poste/liste"} className="withoutUnderlane">
              <CButton className="mt-1" block color="danger" title="Vous voulez annuler ?">
                Annuler
              </CButton>
            </Link>
          </form>
        </div>
        {ifError != null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
      </div>
    );
  }
}

export default withRouter(CreateRole);