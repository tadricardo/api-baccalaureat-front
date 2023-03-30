import { CAlert, CButton, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import Select from 'react-select';
import CompetenceService from "../../services/competence.service";
import { Link, withRouter } from "react-router-dom";
import serviceService from "src/services/service.service";

class UpdateCompetence extends Component {
  constructor(props) {
    super(props);
    this.onChangeCompetence = this.onChangeCompetence.bind(this);
    this.updateCompetence = this.updateCompetence.bind(this);
    this.getCompetence = this.getCompetence.bind(this);
    this.getDomaine = this.getDomaine.bind(this);
    this.onChangeDomaine = this.onChangeDomaine.bind(this);
    this.ifcompetence = this.ifcompetence.bind(this);
    this.ifdomaine = this.ifdomaine.bind(this);

    this.state = {
      domaines: [],
      loading: false,
      currentCompetence: {
        id: null,
        nom: "",
        domaines: []
      },
      errors: { domaineNull: null, competenceNull: null, BdomaineNull: false, BcompetenceNull: false },
      message: "",
      ifError: null
    };
  }

  componentDidMount() {
    this.getCompetence(this.props.competenceId.id);
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

  getCompetence(id) {
    CompetenceService.getCompetenceById(id)
      .then(response => {
        this.setState({
          currentCompetence: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  onChangeDomaine(e) {
    this.ifdomaine(e);
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

  updateCompetence(e) {
    e.preventDefault();
    this.ifcompetence(this.state.currentCompetence.nom);
    this.ifdomaine(this.state.currentCompetence.domaines);
    this.setState({ loading: true });
    if (!this.state.errors.BdomaineNull && !this.state.errors.BcompetenceNull) {
      CompetenceService.getCompetenceByName(this.state.currentCompetence.nom).then(resp => {
        if (resp.data === "") {
          CompetenceService.updateCompetence(this.state.currentCompetence)
            .then(response => {
              this.setState({
                currentCompetence: response.data,
                errors: {
                  competenceNull: null,
                  domaineNull: null,
                  update: null,
                },
                message: "Modification bien prise en compte ! Redirection vers la liste des compétences.",
                ifError: false
              });
              window.setTimeout(() => { this.props.history.push("/competence/liste", 2500) });
            })
            .catch(e => {
              this.setState({
                loading: false,
                message: e.message,
                ifError: true,
                errors: {
                  update: e,
                },
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
    const { currentCompetence, domaines, errors, loading, ifError } = this.state;
    return (
      <div>
        <div className="edit-form">
          <form name="updateCompetenceForm" onSubmit={this.updateCompetence}>
            <div className="form-group">
              <label htmlFor="nom">Nom de la compétence</label>
              <input type="text" className="form-control" id="nom" value={currentCompetence.nom} onChange={this.onChangeCompetence} />
              <span className="text-danger">{errors.competenceNull}</span>
            </div>
            <div className="form-group">
              <label htmlFor="domaines">Services *</label>
              <Select
                name="domaines"
                placeholder="Liste des services"
                value={currentCompetence.domaines === null ? "" : currentCompetence.domaines}
                getOptionLabel={option => option.titre}
                getOptionValue={option => option.id}
                options={domaines.map(e => ({ titre: e.titre, id: e.id }))}
                onChange={this.onChangeDomaine}
                isMulti
                required
              />
              <span className="text-danger">{errors.domaineNull}</span>
            </div>
            <CButton type="submit" block color="info" disabled={loading}>
              {loading && <CSpinner size="sm" variant="border" />} Modifier cette compétence
            </CButton>
            <Link to={"/competence/liste"} className="withoutUnderlane">
              <CButton className="mt-1" block color="danger" title="Vous voulez annuler ?">
                Annuler
              </CButton>
            </Link>
          </form>
          <span className="text-danger">{errors.update}</span>
        </div>
        {ifError != null ? ifError ? <CAlert color="danger">{this.state.message}</CAlert> : <CAlert color="success">{this.state.message}</CAlert> : <CAlert></CAlert>}
      </div>
    );
  }
}
export default withRouter(UpdateCompetence);