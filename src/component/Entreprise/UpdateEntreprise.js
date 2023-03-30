import { CAlert, CButton, CSelect, CSpinner, CSwitch } from "@coreui/react";
import { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import countries from 'world_countries_lists/data/countries/fr/countries.json';
import EntreprisesService from "../../services/entreprises.service";
class UpdateEntreprise extends Component {
  constructor(props) {
    super(props);
    this.getEntreprise = this.getEntreprise.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateEntreprise = this.updateEntreprise.bind(this);
    this.state = {
      currentErrors: {
        name: null, nameBool: false,
        siret: null, siretBool: false,
        service: null, serviceBool: false,
        company: null, companyBool: false,
        skills: null, skillsBool: false,
        role: null, roleBool: false,
        address: null, addressBool: false,
        number: null, numberBool: false,
        route: null, routeBool: false,
        town: null, townBool: false,
        zipCode: null, zipCodeBool: false,
        country: null, countryBool: false,
      },
      currentEntreprise: {
        id: null,
        nom: "",
        numeroSIRET: null,
        actif: true,
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
        version: null
      },
      message: "",
      ifError: null,
      loading: false
    };
  }

  componentDidMount() {
    this.getEntreprise(this.props.entrepriseid.id);
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "number") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            number: "Le numéro de l'adresse est requis.",
            numberBool: true,
          },
          currentEntreprise: {
            ...prevState.currentEntreprise,
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
          currentEntreprise: {
            ...prevState.currentEntreprise,
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
          currentEntreprise: {
            ...prevState.currentEntreprise,
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
          currentEntreprise: {
            ...prevState.currentEntreprise,
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
          currentEntreprise: {
            ...prevState.currentEntreprise,
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
          currentEntreprise: {
            ...prevState.currentEntreprise,
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
          currentEntreprise: {
            ...prevState.currentEntreprise,
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
          currentEntreprise: {
            ...prevState.currentEntreprise,
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
          currentEntreprise: {
            ...prevState.currentEntreprise,
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
          currentEntreprise: {
            ...prevState.currentEntreprise,
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
          currentEntreprise: {
            ...prevState.currentEntreprise,
            adresse: {
              pays: value.toUpperCase(),
            }
          },
        }));
      }
    }

    if (name === "name") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentEntreprise: {
            ...prevState.currentEntreprise,
            nom: value,
          },
          currentErrors: {
            ...prevState.currentErrors,
            name: "Le champ nom est requis.",
            nameBool: true
          }
        }));
      } else {
        this.setState((prevState) => ({
          currentEntreprise: {
            ...prevState.currentEntreprise,
            nom: value,
          },
          currentErrors: {
            ...prevState.currentErrors,
            name: null,
            nameBool: false
          }
        }));
      }
    }

    if (name === "siret") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            siret: "Le champ SIRET est requis.",
            siretBool: true,
          },
          currentEntreprise: {
            ...prevState.currentEntreprise,
            siret: value
          },
        }));
      } else {
        const regSiret = new RegExp("^[0-9]{14}$");
        if (regSiret.test(value)) {
          this.setState((prevState) => ({
            currentErrors: {
              ...prevState.currentErrors,
              siret: null,
              siretBool: false,
            },
            currentEntreprise: {
              ...prevState.currentEntreprise,
              siret: value
            },
          }));
        } else {
          this.setState((prevState) => ({
            currentErrors: {
              ...prevState.currentErrors,
              siret: "Respecter l'écriture du SIRET, uniquement 14 chiffres.",
              siretBool: true,
            },
            currentEntreprise: {
              ...prevState.currentEntreprise,
              siret: value
            },
          }));
        }
      }
    }
    if (name === "actif") {
      this.setState((prevState) => ({
        currentEntreprise: {
          ...prevState.currentEntreprise,
          actif: !this.state.currentEntreprise.actif
        },
      }));
    }
  }

  getEntreprise(id) {
    EntreprisesService.getEntrepriseById(id)
      .then(response => {
        this.setState({
          currentEntreprise: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  validationForm() {
    const { currentErrors } = this.state;
    if (!currentErrors.nameBool &&
      !currentErrors.siretBool &&
      !currentErrors.countryBool &&
      !currentErrors.numberBool &&
      !currentErrors.townBool &&
      !currentErrors.zipCodeBool &&
      !currentErrors.routeBool) {
      return true;
    } else {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          name: currentErrors.nameBool ? "Le champ nom est requis." : null,
          siret: currentErrors.siretBool ? "Le champ SIRET est requis." : null,
          country: currentErrors.countryBool ? "Le champ pays est requis." : null,
          number: currentErrors.numberBool ? "Le champ numéro est requis." : null,
          town: currentErrors.townBool ? "Le champ ville est requis." : null,
          zipCode: currentErrors.zipCodeBool ? "Le champ code postal est requis." : null,
          route: currentErrors.routeBool ? "Le champ voie est requis." : null,
        }
      }));
      return false;
    }
  }

  updateEntreprise(e) {
    e.preventDefault();
    this.setState({ loading: false })
    if (!this.validationForm()) {
      this.setState({
        message: "Une erreur est présente dans votre formulaire.",
        ifError: false,
        loading: false
      });
    } else {
      EntreprisesService.update(this.state.currentEntreprise)
        .then(response => {
          this.setState({
            currentEntreprise: response.data,
            message: "Création bien prise en compte ! Redirection vers la liste des entreprises.",
            ifError: true
          });
          window.setTimeout(() => { this.props.history.push("/entreprises/liste") }, 2500);
        })
        .catch(e => {
          this.setState({
            message: e.response.data,
            ifError: false,
            loading: false
          });
        });
    }
  }


  render() {
    const { currentEntreprise, currentErrors, message, ifError, loading } = this.state;
    return (
      <div>
        <div className="edit-form">
          <form name="updateCompany" onSubmit={this.updateEntreprise}>
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input type="text" className="form-control" id="nom" value={currentEntreprise.nom} onChange={this.handleChange} />
              <span className="text-danger">{currentErrors.name}</span>
            </div>
            <div className="form-group">
              <label htmlFor="name">SIRET</label>
              <input type="text" name="siret" placeholder="Saisir un nom le numéro du SIRET" className="form-control" id="siret" maxLength="14" value={currentEntreprise.numeroSIRET} onChange={this.handleChange} required />
              <span className="text-danger">{currentErrors.siret}</span>
            </div>
            <div className="row">
              <div className="col-1">
                <CSwitch
                  name="actif"
                  color="info"
                  value={currentEntreprise.actif}
                  checked={currentEntreprise.actif}
                  onChange={this.handleChange}
                />
              </div>
              <div className="col-11 mt-1">
                <label>{currentEntreprise.actif ? "Entreprise Actif" : "Entreprise Inactif"}</label>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="adresse" className={currentErrors.adresse ? "font-weight-bold text-danger" : "text-center font-weight-bold"}>Adresse *</label>
                <div className="border">
                  <div className="row m-1">
                    <div className="col">
                      <label htmlFor="number">Numéro*</label>
                      <input type="text" name="number" className="form-control" id="number" placeholder="Saisir le numéro de l'adresse" value={currentEntreprise.adresse.numero} onChange={this.handleChange} required />
                      <span className="text-danger">{currentErrors.number}</span>
                    </div>
                    <div className="col">
                      <label htmlFor="route">Voie*</label>
                      <input type="text" name="route" className="form-control" id="route" placeholder="Sasir le nom de la voie" value={currentEntreprise.adresse.voie} onChange={this.handleChange} required />
                      <span className="text-danger">{currentErrors.route}</span>
                    </div>
                  </div>
                  <div className="row m-1">
                    <div className="col">
                      <label htmlFor="cpltAddress">Complément d'adresse</label>
                      <input type="text" name="cpltAddress" className="form-control" id="cpltAddress" placeholder="Saisir un complément d'adresse" value={currentEntreprise.adresse.complementAdresse} onChange={this.handleChange} />
                      <span className="text-danger">{currentErrors.complementAddress}</span>
                    </div>
                    <div className="col">
                      <label htmlFor="town">Ville*</label>
                      <input type="text" name="town" className="form-control" id="town" placeholder="Saisir une ville" value={currentEntreprise.adresse.ville} onChange={this.handleChange} required />
                      <span className="text-danger">{currentErrors.town}</span>
                    </div>
                  </div>
                  <div className="row m-1">
                    <div className="col">
                      <label htmlFor="zipCode">Code Postal*</label>
                      <input type="text" name="zipCode" className="form-control" id="zipCode" placeholder="Saisir un code postal" value={currentEntreprise.adresse.codePostal} onChange={this.handleChange} required />
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
                        value={currentEntreprise.adresse.pays === null ? 0 : currentEntreprise.adresse.pays.substring(0, 1) + currentEntreprise.adresse.pays.substring(1).toLowerCase()}
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
            <CButton type="submit" block color="info" disabled={loading} className="mt-2">
              {loading && <CSpinner size="sm" variant="border" />} Modifier
            </CButton>
            <Link to={"/entreprises/liste"} className="withoutUnderlane">
              <CButton className="mt-1" block color="danger" title="Vous voulez annuler ?">
                Annuler
              </CButton>
            </Link>
          </form>
          {ifError != null && <CAlert color={ifError ? "success" : "danger"}>{message}</CAlert>}
        </div >
      </div >
    );
  }
}

export default withRouter(UpdateEntreprise)