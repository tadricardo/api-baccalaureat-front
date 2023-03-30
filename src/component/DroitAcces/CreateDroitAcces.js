import { CAlert, CButton, CCol, CForm, CFormGroup, CInput, CRow, CSelect, CSpinner, CSwitch } from '@coreui/react';
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import droitAccesService from 'src/services/droit-acces.service';
import { ifNumber } from 'src/utils/fonctions';

class CreateDroitAcces extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.createRoute = this.createRoute.bind(this);
    this.getAllParent = this.getAllParent.bind(this);
    this.state = {
      currentErrors: {
        description: null,
        descriptionBool: true,
        indexation: null,
        indexationBool: true,
        frontRoute: null,
        frontRouteBool: true,
        parent: null,
        parentBool: true,
        iconBool: true
      },

      currentRoute: {
        id: null,
        description: "",
        indexation: 0,
        frontRoute: "",
        icon: "",
        parent: null,
        hiddenParent: false,
        hidden: false,
        index: 0,
        version: 0
      },
      routeParent: [],
      message: "",
      ifError: null,
      loading: false
    }
  }

  componentDidMount() {
    this.getAllParent()
  }

  getAllParent() {
    droitAccesService.getAllParent().then(response => {
      this.setState({
        routeParent: response.data,
      });
    })
  }

  onChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "parent") {
      if (this.state.currentRoute.hiddenParent) {
        if (parseInt(value) !== 0 || value !== "" || value !== null || value.length !== 0) {
          this.setState((prevState) => ({
            currentErrors: {
              ...prevState.currentErrors,
              parent: null,
              parentBool: false,
            },
            currentRoute: {
              ...prevState.currentRoute,
              parent: {
                id: parseInt(value),
              },
            },
          }));
        } else {
          this.setState((prevState) => ({
            currentErrors: {
              ...prevState.currentErrors,
              parent: "Le parent est requis.",
              parentBool: true,
            }
          }));
        }
      }

    }
    if (name === "icon") {
      if (value !== "" || value !== null || value.length !== 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            icon: "",
            iconBool: false
          },
          currentRoute: {
            ...prevState.currentRoute,
            icon: value,
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentRoute: {
            ...prevState.currentRoute,
            icon: "",
          },
        }));
      }
    }

    if (name === "switchHidden") {
      this.setState((prevState) => ({
        currentRoute: {
          ...prevState.currentRoute,
          hidden: value,
        },
      }));
    }

    if (name === "switchPosition") {
      this.setState((prevState) => ({
        currentRoute: {
          ...prevState.currentRoute,
          hiddenParent: value,
        },
      }));
    }

    if (name === "frontRoute") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            frontRoute: "Le chemin de la route est requis.",
            frontRouteBool: true,
          },
          currentRoute: {
            ...prevState.currentRoute,
            frontRoute: value,
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            frontRoute: "",
            frontRouteBool: false
          },
          currentRoute: {
            ...prevState.currentRoute,
            frontRoute: value,
          },
        }));
      }
    }

    if (name === "description") {
      if (value === "" || value === null || value.length === 0) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            description: "Une description est requise.",
            descriptionBool: true,
          },
          currentRoute: {
            ...prevState.currentRoute,
            description: value,
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            description: "",
            descriptionBool: false
          },
          currentRoute: {
            ...prevState.currentRoute,
            description: value,
          },
        }));
      }
    }

    if (name === "indexation") {
      if (ifNumber(value)) {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            indexation: "",
            indexationBool: false
          },
          currentRoute: {
            ...prevState.currentRoute,
            indexation: value,
          },
        }));
      } else {
        this.setState((prevState) => ({
          currentErrors: {
            ...prevState.currentErrors,
            indexation: "L'indexation doit être un nombre entier.",
            indexationBool: true
          },
          currentRoute: {
            ...prevState.currentRoute,
            indexation: value,
          },
        }));
      }
    }
  }

  createRoute(e) {
    const { currentErrors, currentRoute } = this.state;
    e.preventDefault();
    this.setState({ loading: true })
    if(this.state.currentRoute.hiddenParent){
      if(currentRoute.parent === null){
        this.setState((prevState) => ({
          loading: false,
          currentErrors: {
            ...prevState.currentErrors,
            parent: "Le parent est requis.",
            parentBool: true,
          }
        }));
      } else {
        if (currentErrors.frontRouteBool && currentErrors.descriptionBool && currentErrors.indexationBool) {
          this.setState({
            message: "Une erreur est présente dans votre formulaire.",
            ifError: true,
            loading: false
          });
        } else {
          droitAccesService.getDroitAccesByFrontName(currentRoute.frontRoute).then(response => {
            if (response.data === "") {
              droitAccesService.saveDA(currentRoute).then(response => {
                this.setState({
                  currentRoute: response.data,
                  message: "Création bien prise en compte !",
                  ifError: false
                });
                window.setTimeout(() => { this.props.history.push(`/route/liste`) }, 2000)
              })
                .catch(e => {
                  console.log(e);
                })
            } else {
              this.setState({
                message: "Cette route existe déjà.",
                ifError: true,
                loading: false
              });
            }
          })
        }
      }
    } else {
      if (currentRoute.icon.length === 0) {
        this.setState((prevState) => ({
          loading: false,
          currentErrors: {
            ...prevState.currentErrors,
            icon: "Une icone est requis.",
            iconBool: true,
          }
        }));
      } else {
        if (currentErrors.frontRouteBool && currentErrors.descriptionBoo) {
          this.setState({
            message: "Une erreur est présente dans votre formulaire.",
            ifError: true,
            loading: false
          });
        } else {
          droitAccesService.getDroitAccesByFrontName(currentRoute.frontRoute).then(response => {
            if (response.data === "") {
              droitAccesService.saveDA(currentRoute).then(response => {
                this.setState({
                  currentRoute: response.data,
                  message: "Création bien prise en compte !",
                  ifError: false
                });
                window.setTimeout(() => { this.props.history.push(`/route/liste`) }, 2000)
              })
                .catch(e => {
                  console.log(e);
                })
            } else {
              this.setState({
                message: "Cette route existe déjà.",
                ifError: true,
                loading: false
              });
            }
          })
        }
      }
    }
  }

  render() {
    const { currentRoute, currentErrors, routeParent, loading, ifError, message } = this.state;
    return (
      <>
        <CForm className="mt-3" onSubmit={this.createRoute}>
          <CFormGroup>
            <label htmlFor="title">Chemin de la route*</label>
            <CInput type="text" required name="frontRoute" className="form-control" id="frontRoute" placeholder="Saisir un chemin de route" value={currentRoute.frontRoute} onChange={this.onChange} />
            <span className="text-danger">{currentErrors.frontRoute}</span>
          </CFormGroup>
          <CFormGroup>
            <label htmlFor="title">Description*</label>
            <CInput type="text" required name="description" className="form-control" id="description" placeholder="Saisir une description pour cette route" value={currentRoute.description} onChange={this.onChange} />
            <span className="text-danger">{currentErrors.description}</span>
          </CFormGroup>
          <CFormGroup>
            <label htmlFor="icon">Icon</label>
            <CInput type="text" name="icon" className="form-control" id="icon" placeholder="Saisir une icon pour cette route" value={currentRoute.icon} onChange={this.onChange} />
            <span className="text-danger">{currentErrors.icon}</span>
          </CFormGroup>
          <div hidden={!currentRoute.hidden}>
            <CFormGroup className="">
              <label htmlFor="title">Index dans le menu </label>
              <CInput type="number" name="indexation" className="form-control" id="indexation" placeholder="Saisir un index pour le placement dans le menu" value={currentRoute.indexation} onChange={this.onChange} />
              <span className="text-danger">{currentErrors.indexation}</span>
            </CFormGroup>
          </div>
          <CRow>
            <CCol lg="6">
              <CFormGroup>
                <label htmlFor='switchHidden'>Visible dans le menu ?  </label>
                <CSwitch name='switchHidden' id='switchHidden' className="ml-4 pt-2" color="dark" variant="opposite" shape='pill' onChange={this.onChange} value={currentRoute.hidden} />
              </CFormGroup>
            </CCol>
            <CCol lg="6">
              <CFormGroup>
                <label htmlFor='switchPosition'>Sera-t-il un sous-menu ? </label>
                <CSwitch name='switchPosition' id='switchPosition' className="ml-4 pt-2" color="dark" variant="opposite" shape='pill' onChange={this.onChange} value={currentRoute.hiddenParent} />
              </CFormGroup>
            </CCol>
          </CRow>
          <div hidden={!currentRoute.hiddenParent}>
            <CFormGroup>
              <label htmlFor="parent">Parent </label>
              <CSelect custom className={currentErrors.parent ? "form-control is-invalid" : "form-control"} name="parent" id="parent" onChange={this.onChange} required>
                <option value="0">Veuillez sélectionner un parent</option>
                {routeParent.map((parent, key) => (
                  <option key={key} value={parent.id}>
                    {parent.description}
                  </option>
                ))}
              </CSelect>
              <span className="text-danger">{currentErrors.parent}</span>
            </CFormGroup>
          </div>
          <CFormGroup>
            <CButton type="submit" block color="info" disabled={loading}>
              {loading && <CSpinner size="sm" variant="border" />} Créer une route
            </CButton>
            <CButton to={"/route/liste"} className="mt-1" block color="danger" title="Vous voulez annuler ?">
              Annuler
            </CButton>
          </CFormGroup>
          {ifError !== null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
        </CForm>
      </>
    )
  }
}

export default withRouter(CreateDroitAcces)
