import { CAlert, CButton, CForm, CFormGroup, CInput, CSpinner } from '@coreui/react';
import React, { Component } from 'react'
import { withRouter } from 'react-router';
import activityDomainService from 'src/services/activityDomain.service';
class CreateActivityDomain extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.createActivityDomain = this.createActivityDomain.bind(this);
    this.state = {
      currentErrors: {
        title: null,
        titleBool: true,
      },
      currentActivityDomain: {
        id: null,
        titre: "",
        version: 0
      },
      message: "",
      ifError: null,
      loading: false
    };
  }

  onChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "title") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            title: "Le titre est requis.",
            titleBool: true,
          },
          currentActivityDomain: {
            ...prevState.currentActivityDomain,
            titre: value,
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            title: "",
            titleBool: false
          },
          currentActivityDomain: {
            ...prevState.currentActivityDomain,
            titre: value,
          },
        }));
      }
    }
  }

  createActivityDomain(e) {
    const { currentErrors, currentActivityDomain } = this.state;
    e.preventDefault();
    this.setState({ loading: true })
    if (currentErrors.titleBool) {
      this.setState({
        message: "Une erreur est présente dans votre formulaire.",
        ifError: true,
        loading: false
      });
    } else {
      activityDomainService.getByTitle(currentActivityDomain.titre).then(response => {
        if (response.data === "") {
          activityDomainService.save(currentActivityDomain).then(response => {
            this.setState({
              currentActivityDomain: response.data,
              message: "Création bien prise en compte !",
              ifError: false
            });
            window.setTimeout(() => { this.props.history.push('/activite-domaine/liste') }, 2500);
          })
            .catch(e => {
              console.log(e);
            })
        } else {
          this.setState({
            message: "Ce domaine d'activité existe déjà.",
            ifError: true,
            loading: false
          });
        }
      })

    }
  }

  render() {
    const { currentActivityDomain, currentErrors, loading, ifError, message } = this.state;
    return (
      <>
        <CForm className="mt-3" onSubmit={this.createActivityDomain}>
          <CFormGroup>
            <label htmlFor="title">Titre du domaine d'activité</label>
            <CInput type="text" name="title" className="form-control" id="title" placeholder="Saisir un titre" value={currentActivityDomain.titre} onChange={this.onChange} />
            <span className="text-danger">{currentErrors.titre}</span>
          </CFormGroup>
          <CFormGroup>
            <CButton type="submit" block color="info" disabled={loading}>
              {loading && <CSpinner size="sm" variant="border" />} Créer un domaine activité
            </CButton>
            <CButton to={"/activite-domaine/liste"} className="mt-1" block color="danger" title="Vous voulez annuler ?">
              Annuler
            </CButton>
          </CFormGroup>
          {ifError !== null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
        </CForm>
      </>
    )
  }
}

export default withRouter(CreateActivityDomain);