import { CAlert, CButton, CForm, CFormGroup, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import DroitAccesService from "src/services/droit-acces.service";
import swal from "sweetalert";
import RoleService from "../../services/role.service";


class CreateRole extends Component {
  constructor(props) {
    super(props);
    this.onChangeRole = this.onChangeRole.bind(this);
    this.createRole = this.createRole.bind(this);
    this.onChangeRoute = this.onChangeRoute.bind(this);
    this.onChangeInputRoute = this.onChangeInputRoute.bind(this);
    this.loadRoute = this.loadRoute.bind(this);
    this.state = {
      nameRoute: "",
      currentErrors: {
        title: null,
        titleBool: true
      },
      currentRole: {
        id: null,
        titre: ""
      },
      routes: [],
      currentRoute: {},
      message: "",
      ifError: null,
      loading: false
    };
  }

  onChangeRole(e) {
    const role = e.target.value;
    if (role === "" || role === null || role.length === 0) {
      this.setState((prevState) => ({
        currentRole: {
          ...prevState.currentRole,
          titre: role,
        },
        currentErrors: {
          ...prevState.currentErrors,
          title: "Le champ nom est requis.",
          titleBool: true
        }
      }));
    } else {
      this.setState((prevState) => ({
        currentRole: {
          ...prevState.currentRole,
          titre: role,
        },
        currentErrors: {
          ...prevState.currentErrors,
          title: null,
          titleBool: false
        }
      }));
    }
  }

  async loadRoute(search, prevOptions, { page }, e) {
    let response = await DroitAccesService.getAllByPageAndKeyword(page, 10, this.state.nameRoute, "ASC");
    let responseJSON = await response.data;
    return {
      options: responseJSON,
      hasMore: responseJSON.length >= 1,
      additional: {
        page: search ? 2 : page + 1,
      }
    };
  }

  onChangeRoute(e) {
    this.setState({ currentRoute: e });
  }

  onChangeInputRoute(e) {
    this.setState({ nameRoute: e })
  }

  addRoute(e) {
    let newRoute = this.state.currentRoute;
    const result = this.state.routes.find(e => e.id === newRoute.id);
    if (result === undefined) {
      if (newRoute.length !== 0) {
        const newItems = [...this.state.routes, newRoute];
        this.setState({
          routes: newItems,
        });
      }
    } else {
      swal({
        text: "Le chemin de route est déjà présent.",
        icon: "warning",
      })
    }
  }

  deleteItem(key) {
    const filteredItem = this.state.routes.filter((item) => { return item.id !== key.id; });
    this.setState({ routes: filteredItem });
  }

  createRole(e) {
    e.preventDefault();
    this.setState({ loading: true })
    if (this.state.currentErrors.titleBool) {
      this.setState({
        message: "Une erreur est présente dans votre formulaire.",
        ifError: true,
        loading: false
      });
    } else {
      let RoleAndRoute = {
        role: this.state.currentRole,
        droitAcces: this.state.routes
      }
      RoleService.getRoleByTitle(this.state.currentRole.titre).then(resp => {
        if (resp.data === "") {
          RoleService.saveRole(RoleAndRoute)
            .then(response => {
              this.setState({
                currentRole: response.data,
                message: "Création bien prise en compte ! Redirection vers la liste de rôle.",
                ifError: false
              });
              window.setTimeout(() => { this.props.history.push("/role/liste") }, 2500);
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
            message: "Ce rôle existe déjà.",
            ifError: true,
            loading: false
          });
        }
      })
    }
  }

  render() {
    const { currentRole, currentErrors, message, ifError, loading } = this.state;
    return (
      <div>
        <CForm name="createRole" className="mt-3" onSubmit={this.createRole}>
          <CFormGroup className="form-group">
            <label htmlFor="title">Créer un nouveau rôle</label>
            <input type="text" name="title" className="form-control" id="title" placeholder="Saisir un nom de rôle" value={currentRole.titre} onChange={this.onChangeRole} />
            <span className="text-danger">{currentErrors.title}</span>
          </CFormGroup>
          {/* A voir si on l'ajouter
                <CFormGroup className="justify-content-between">
                  <CRow>
                    <CCol lg={10}>
                      <AsyncPaginate
                        name="route"
                        value={currentRoute !== null ? Object.entries(currentRoute).length === 0 ? null : currentRoute : null}
                        loadOptions={this.loadRoute}
                        isClearable
                        getOptionValue={(option) => option.id}
                        getOptionLabel={(option) => option.frontRoute}
                        onChange={this.onChangeRoute}
                        isSearchable={true}
                        onInputChange={this.onChangeInputRoute}
                        placeholder="Selectionner une route"
                        additional={{
                          page: 0,
                        }}
                      />
                    </CCol>
                    <CCol lg={2}>
                      <CButton color="primary" className={`px-4`} onClick={this.addRoute.bind(this)} >Ajouter</CButton>
                    </CCol>
                  </CRow>
                </CFormGroup>
                <CFormGroup>
                  <table className="table table-hover table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>Chemin de la route</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routes.map(route =>
                        <tr key={route.id}>
                          <td>{route.frontRoute}</td>
                          <td>{<CButton color="danger" onClick={() => { this.deleteItem(route); }}>X</CButton>}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </CFormGroup>*/}
          <CButton type="submit" block color="info" disabled={loading}>
            {loading && <CSpinner size="sm" variant="border" />} Créer un rôle
          </CButton>
          <Link to={"/role/liste"} className="withoutUnderlane">
            <CButton className="mt-1" block color="danger" title="Vous voulez annuler ?">
              Annuler
            </CButton>
          </Link>
        </CForm>
        {ifError != null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
      </div>
    );
  }
}

export default withRouter(CreateRole);