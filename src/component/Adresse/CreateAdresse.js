import { CAlert, CButton, CSelect, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import AdressesService from "../../services/adresses.service";
import { withRouter } from "react-router-dom";
import countries from 'world_countries_lists/data/countries/fr/countries.json';

class CreateAdresse extends Component {
  constructor(props) {
    super(props);
    this.saveAdresse = this.saveAdresse.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      currentErrors: {
        number: null,
        numberBool: null,
        route: null,
        routeBool: null,
        complementAddress: null,
        complementAddressBool: null,
        town: null,
        townBool: null,
        zipCode: null,
        zipCodeBool: null,
        country: null,
        countryBool: null
      },
      currentAdresse: {
        id: null,
        numero: "",
        voie: "",
        complementAdresse: "",
        ville: "",
        codePostal: "",
        pays: "FRANCE",
        version: null
      },
      message: null,
      ifError: null,
      loading: false
    };
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
          currentAdresse: {
            ...prevState.currentAdresse,
            numero: value,
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            number: null,
            numberBool: false,
          },
          currentAdresse: {
            ...prevState.currentAdresse,
            numero: value,
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
          currentAdresse: {
            ...prevState.currentAdresse,
            voie: value,
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            route: null,
            routeBool: false,
          },
          currentAdresse: {
            ...prevState.currentAdresse,
            voie: value,
          },
        }));
      }
    }
    if (name === "cpltAddress") {
      if (value !== "" || value !== null || value.length !== 0) {
        this.setState((prevState) => ({
          currentAdresse: {
            ...prevState.currentAdresse,
            complementAdresse: value,
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
          currentAdresse: {
            ...prevState.currentAdresse,
            ville: value.toUpperCase(),
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            town: null,
            townBool: false,
          },
          currentAdresse: {
            ...prevState.currentAdresse,
            ville: value.toUpperCase(),
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
          currentAdresse: {
            ...prevState.currentAdresse,
            codePostal: value,
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            zipCode: null,
            zipCodeBool: false,
          },
          currentAdresse: {
            ...prevState.currentAdresse,
            codePostal: value,
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
          currentAdresse: {
            ...prevState.currentAdresse,
            pays: value.toUpperCase(),
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            country: null,
            countryBool: false,
          },
          currentAdresse: {
            ...prevState.currentAdresse,
            pays: value.toUpperCase(),
          },
        }));
      }
    }
  }

  validationForm() {
    const { currentErrors } = this.state;
    if (!currentErrors.numberBool && !currentErrors.routeBool && !currentErrors.complementAddressBool && !currentErrors.townBool && !currentErrors.zipCodeBool && !currentErrors.countryBool) {
      return true;
    } else {
      return false;
    }
  }

  saveAdresse(e) {
    e.preventDefault();
    this.setState({ loading: true })
    if (this.validationForm()) {
      AdressesService.getAdresseByEntity(this.state.currentAdresse).then(response => {
        if (typeof response.data !== "object") {
          AdressesService.save(this.state.currentAdresse)
            .then(response => {
              this.setState({
                message: "Création bien prise en compte ! Redirection vers la liste des adresses.",
                ifError: false
              });
              window.setTimeout(() => { this.props.history.push("/adresses/liste") }, 2500);
            })
            .catch(e => {
              this.setState({
                message: "Une erreur s'est produite ! veuillez ré-essayer ou contacter un administrateur.",
                ifError: true,
                loading: false
              });
            });
        } else {
          this.setState({
            message: "Cette adresse existe déjà.",
            ifError: true,
            loading: false
          });
        }
      })
    } else {
      this.setState({
        message: "Une erreur est présente dans votre formulaire.",
        ifError: true,
        loading: false
      });
    }

  }


  render() {
    const { currentAdresse, currentErrors, message, ifError, loading } = this.state;

    return (
      <div className="submit-form">
        <div>
          <form name="createAddress" onSubmit={this.saveAdresse}>
            <div className="form-group">
              <label htmlFor="number">Numéro</label>
              <input type="text" name="number" className="form-control" id="number" placeholder="Saisir le numéro de l'adresse" value={currentAdresse.numero} onChange={this.handleChange} required />
              <span className="text-danger">{currentErrors.number}</span>
            </div>
            <div className="form-group">
              <label htmlFor="route">Voie</label>
              <input type="text" name="route" className="form-control" id="route" placeholder="Sasir le nom de la voie" value={currentAdresse.voie} onChange={this.handleChange} required />
              <span className="text-danger">{currentErrors.route}</span>
            </div>
            <div className="form-group">
              <label htmlFor="cpltAddress">Complément d'adresse</label>
              <input type="text" name="cpltAddress" className="form-control" id="cpltAddress" placeholder="Saisir un complément d'adresse" value={currentAdresse.complementAdresse} onChange={this.handleChange} />
              <span className="text-danger">{currentErrors.complementAddress}</span>
            </div>
            <div className="form-group">
              <label htmlFor="town">Ville</label>
              <input type="text" name="town" className="form-control" id="town" placeholder="Saisir une ville" value={currentAdresse.ville} onChange={this.handleChange} required />
              <span className="text-danger">{currentErrors.town}</span>
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">Code Postal</label>
              <input type="text" name="zipCode" className="form-control" id="zipCode" placeholder="Saisir un code postal" value={currentAdresse.codePostal} onChange={this.handleChange} required />
              <span className="text-danger">{currentErrors.zipCode}</span>
            </div>
            <div className="form-group">
              <label htmlFor="country">Pays</label>
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
            <CButton type="submit" block color="info" disabled={loading}>
              {loading && <CSpinner size="sm" variant="border" />} Créer une adresse
            </CButton>

            <CButton className="mt-1" to={"/adresses/liste"} block color="danger" title="Vous voulez annuler ?">
              Annuler
            </CButton>
          </form>
          {ifError != null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
        </div>
      </div>
    );
  }
}

export default withRouter(CreateAdresse);