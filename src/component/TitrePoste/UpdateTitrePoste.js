import { CAlert, CButton, CSelect, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import { withRouter } from "react-router";
import TitrePosteService from "../../services/titre-poste.service";
import { Link } from "react-router-dom";
import serviceService from "../../services/service.service";
import posteFicheService from "../../services/poste-fiche.service";

class UpdateTitrePoste extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitrePoste = this.onChangeTitrePoste.bind(this);
    this.updateTitrePoste = this.updateTitrePoste.bind(this);
    this.getTitrePoste = this.getTitrePoste.bind(this);
    this.getAllDomaine = this.getAllDomaine.bind(this);
    this.onChangeDomaine = this.onChangeDomaine.bind(this);
    this.onChangeFichePoste = this.onChangeFichePoste.bind(this);
    this.state = {
      currentErrors: {
        intitule: null, intituleBool: false,
        domaine: null, domaineBool: false,
        fichePoste: null, fichePosteBool: false,
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
      message: "",
      ifError: null,
      loading: false,
      domaines: [],
      posteFiches: [],
    };
  }

  componentDidMount() {
    this.getTitrePoste(this.props.titrePosteId.id);
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
          title: "Le champ nom est requis.",
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

  getTitrePoste(id) {
    TitrePosteService.getTitrePosteById(id)
      .then(response => {
        this.setState({
          currentTitrePoste: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  validationForm() {
    const errors = this.state.currentErrors;
    if (!errors.domaineBool &&
      !errors.fichePosteBool &&
      !errors.intituleBool) {
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
          intitule: errors.intituleBool ? "L'intitulé est requis." : null,
        }
      }));
    }
  }

  updateTitrePoste(e) {
    e.preventDefault();
    this.setState({ loading: true })
    if (this.validationForm()) {
      TitrePosteService.getTitrePosteByIdServiceOrAndName(this.state.currentTitrePoste.domaine.id, this.state.currentTitrePoste.intitule).then(resp => {
        if (resp.data.length === 0) {
          TitrePosteService.updateTitrePoste(this.state.currentTitrePoste)
            .then(response => {
              this.setState({
                currentTitrePoste: response.data,
                message: 'Modification bien prise en compte !',
                ifError: false,
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
          <form name="updateTitlePoste" onSubmit={this.updateTitrePoste}>
            <div className="form-group">
              <label htmlFor="intitule">Nom de l'intitulé du poste</label>
              <input type="text" name="intitule" className="form-control" id="intitule" value={currentTitrePoste.intitule} onChange={this.onChangeTitrePoste} />
              <span className="text-danger">{currentErrors.intitule}</span>
            </div>
            <div className="form-group">
              <label htmlFor="domaine">Service *</label>
              <CSelect custom name="domainePoste" id="domainePoste" onChange={this.onChangeDomaine} required
                value={
                  currentTitrePoste.domaine.id === null
                    ? 0
                    : currentTitrePoste.domaine.id
                }>
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
              <CSelect custom name="domainePoste" id="domainePoste" onChange={this.onChangeFichePoste} required
              value={
                currentTitrePoste.posteFiche.id === null
                  ? 0
                  : currentTitrePoste.posteFiche.id
              }>
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
              {loading && <CSpinner size="sm" variant="border" />}  Modifier cette intitulé de posee
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

export default withRouter(UpdateTitrePoste);