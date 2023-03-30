import { CAlert, CButton, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import AdressesService from "../../services/adresses.service";
import { Link, withRouter } from "react-router-dom";

class UpdateAdresse extends Component {
  constructor(props) {
    super(props);
    this.getAdresse = this.getAdresse.bind(this);
    this.updateAdresse = this.updateAdresse.bind(this);
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
        pays: "",
        version: null
      },
      message: null,
      ifError: null,
      loading: false
    };
  }

  componentDidMount() {
    this.getAdresse(this.props.adresseid.id);
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
            duration: null,
            durationBool: false,
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
            ville: value,
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
            ville: value,
          },
        }));
      }
    }
    if (name === "zipCode") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            zipCode: "Le champ pays est requis.",
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
            pays: value,
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
            pays: value,
          },
        }));
      }
    }
  }

  getAdresse(id) {
    AdressesService.getAdresseById(id)
      .then(response => {
        this.setState({
          currentAdresse: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  validationForm() {
    const { currentErrors } = this.state;
    if (!currentErrors.numberBool && !currentErrors.routeBool && !currentErrors.complementAddressBool && !currentErrors.townBool && !currentErrors.zipCodeBool && !currentErrors.countryBool) {
      return true;
    } else {
      return false;
    }
  }

  updateAdresse(e) {
    e.preventDefault();
    this.setState({ loading: true })
    if (this.validationForm()) {
      AdressesService.getAdresseByEntity(this.state.currentAdresse).then(response => {
        if (typeof response.data !== "object") {
          AdressesService.update(this.state.currentAdresse)
            .then(response => {
              this.setState({
                message: "Modification bien prise en compte ! Redirection vers la liste des adresses.",
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
      <div>
        <div className="edit-form">
          <form name="updateAddress" onSubmit={this.updateAdresse}>
            <div className="form-group">
              <label htmlFor="number">Numéro</label>
              <input type="text" name="number" className="form-control" id="number" value={currentAdresse.numero} onChange={this.handleChange} required />
              <span className="text-danger">{currentErrors.number}</span>
            </div>
            <div className="form-group">
              <label htmlFor="route">Voie</label>
              <input type="text" name="route" className="form-control" id="route" value={currentAdresse.voie} onChange={this.handleChange} required />
              <span className="text-danger">{currentErrors.route}</span>
            </div>
            <div className="form-group">
              <label htmlFor="cpltAddress">Complément d'adresse</label>
              <input type="text" name="cpltAddress" className="form-control" id="cpltAddress" value={currentAdresse.complementAdresse === null ? "" : currentAdresse.complementAdresse} onChange={this.handleChange} />
              <span className="text-danger">{currentErrors.cpltAddress}</span>
            </div>
            <div className="form-group">
              <label htmlFor="town">Ville</label>
              <input type="text" name="town" className="form-control" id="town" value={currentAdresse.ville} onChange={this.handleChange} required />
              <span className="text-danger">{currentErrors.town}</span>
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">Code Postal</label>
              <input type="text" name="zipCode" className="form-control" id="zipCode" value={currentAdresse.codePostal} onChange={this.handleChange} required />
              <span className="text-danger">{currentErrors.zipCode}</span>
            </div>
            <div className="form-group">
              <label htmlFor="country">Pays</label>
              <input type="text" name="country" className="form-control" id="country" value={currentAdresse.pays} onChange={this.handleChange} required />
              <span className="text-danger">{currentErrors.country}</span>
            </div>
            <CButton type="submit" block color="info" disabled={loading}>
              {loading && <CSpinner size="sm" variant="border" />} Modifier cette adresse
            </CButton>
            <Link to={"/adresses/liste"} className="withoutUnderlane">
              <CButton className="mt-1" block color="danger" title="Vous voulez annuler ?">
                Annuler
              </CButton>
            </Link>
          </form>
          {ifError != null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
        </div>
      </div>
    );
  }
}

export default withRouter(UpdateAdresse);