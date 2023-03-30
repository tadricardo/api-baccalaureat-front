import { CButton, CAlert, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import ComptenceService from "../../services/competence.service";
import Select from 'react-select';
import { Link, withRouter } from "react-router-dom";
import serviceService from "src/services/service.service";

class CreateCompetence extends Component {
  constructor(props) {
    super(props);
    this.onChangeCompetence = this.onChangeCompetence.bind(this);
    this.CreateCompetence = this.CreateCompetence.bind(this);
    this.getDomaine = this.getDomaine.bind(this);
    this.onChangeDomaine = this.onChangeDomaine.bind(this);
    this.ifcompetence = this.ifcompetence.bind(this);
    this.ifdomaine = this.ifdomaine.bind(this);
    this.state = {
      errors: { domaineNull: null, competenceNull: null, BdomaineNull: true, BcompetenceNull: true },
      domaines: [],
      currentCompetence: {
        id: null,
        nom: "",
        domaines: {
          id: null
        }
      },
      message: "",
      ifError: null,
      loading: false
    };
  }

  componentDidMount() {
    this.getDomaine();
  }

  ifcompetence(competence) {
    if (competence !== "") {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          competenceNull: null,
          BcompetenceNull: false,
        },
        currentCompetence: {
          ...prevState.currentCompetence,
          nom: competence
        }
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          competenceNull: "Le nom de la compétence est obligatoire.",
          BcompetenceNull: true,
        },
        currentCompetence: {
          ...prevState.currentCompetence,
          nom: null
        }
      }));
    }
  }

  ifdomaine(e) {
    if (e.length !== 0) {
      this.setState((prevState) => ({
        currentCompetence: {
          ...prevState.currentCompetence,
          domaines: e,
        },
        errors: {
          ...prevState.errors,
          domaineNull: null,
          BdomaineNull: false,
        }
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          domaineNull: "La compétence doit avoir au moins un service.",
          BdomaineNull: true,
        },
        currentCompetence: {
          ...prevState.currentCompetence,
          domaines: e,
        },
      }));
    }
  }

  onChangeCompetence(e) {
    const competence = e.target.value;
    this.ifcompetence(competence);
  }

  getDomaine() {
    serviceService.getAllService()
      .then(response => {
        this.setState({
          domaines: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  onChangeDomaine(e) {
    this.ifdomaine(e);
  }

  CreateCompetence(e) {
    e.preventDefault();
    this.ifcompetence(this.state.currentCompetence.nom);
    this.ifdomaine(this.state.currentCompetence.domaines);
    this.setState({ loading: true })
    if (!this.state.errors.BdomaineNull && !this.state.errors.BcompetenceNull) {
      ComptenceService.getCompetenceByName(this.state.currentCompetence.nom).then(resp => {
        if (resp.data === "") {
          const json = JSON.stringify(this.state.currentCompetence).split('"value":').join('"id":');
          const data = JSON.parse(json);
          ComptenceService.saveCompetence(data)
            .then(response => {
              this.setState({
                currentCompetence: response.data,
                message: "Création bien prise en compte ! Redirection vers la liste des compétences.",
                ifError: false
              });
              window.setTimeout(() => { this.props.history.push("/competence/liste", 2500) });
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
            message: "Cette compétence existe déjà.",
            ifError: true,
            loading: false
          });
        }
      })

    }
  }

  render() {
    const { currentCompetence, domaines, ifError, errors, loading } = this.state;
    return (
      <div>
        <div className="edit-form">
          <form name="createCompetenceForm" onSubmit={this.CreateCompetence}>
            <div className="form-group">
              <label htmlFor="nom">Créer une nouvelle compétence</label>
              <input type="text" className="form-control" placeholder="Saisir un nom de compétence" id="nom" value={currentCompetence.nom} onChange={this.onChangeCompetence} required />
              <span className="text-danger">{errors.competenceNull}</span>
            </div>

            <div className="form-group">
              <label htmlFor="domaines">Services *</label>
              <Select
                name="domaines"
                placeholder="Sélectionner un service"
                value={currentCompetence.domaine}
                options={domaines.map(e => ({ label: e.titre, value: e.id }))}
                onChange={this.onChangeDomaine}
                isMulti
                required
              />
              <span className="text-danger">{errors.domaineNull}</span>
            </div>
            <CButton type="submit" block color="info" disabled={loading}>
              {loading && <CSpinner size="sm" variant="border" />} Créer une compétence
            </CButton>
            <Link to={"/competence/liste"} className="withoutUnderlane">
              <CButton className="mt-1" block color="danger" title="Vous voulez annuler ?">
                Annuler
              </CButton>
            </Link>
          </form>
        </div>
        {ifError != null ? ifError ? <CAlert color="danger">{this.state.message}</CAlert> : <CAlert color="success">{this.state.message}</CAlert> : <CAlert></CAlert>}
      </div>
    );
  }
}

export default withRouter(CreateCompetence);