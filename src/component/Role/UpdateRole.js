import { CAlert, CButton, CCol, CForm, CFormGroup, CNav, CNavItem, CNavLink, CRow, CSpinner, CTabContent, CTabPane, CTabs } from "@coreui/react";
import { faEdit, faLink, faList, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import ReactPaginate from "react-paginate";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { AsyncPaginate } from "react-select-async-paginate";
import droitAccesService from "src/services/droit-acces.service";
import swal from "sweetalert";
import roleService from "../../services/role.service";
import RoleService from "../../services/role.service";
import CreateDroitAcces from "../DroitAcces/CreateDroitAcces";
import ListDroitAcces from "../DroitAcces/ListDroitAcces";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class UpdateRole extends Component {
  constructor(props) {
    super(props);
    this.onChangeRole = this.onChangeRole.bind(this);
    this.updateRole = this.updateRole.bind(this);
    this.getRole = this.getRole.bind(this);
    this.loadRoute = this.loadRoute.bind(this);
    this.onChangeInputRoute = this.onChangeInputRoute.bind(this);
    this.onChangeRoute = this.onChangeRoute.bind(this);
    this.addRoute = this.addRoute.bind(this);
    this.state = {
      nameRoute: "",
      pageCountRoutes: 0,
      offsetRoute: 0,
      perPageRoute: 10,
      currentErrors: {
        title: null,
        titleBool: false
      },
      currentRole: {
        id: 0,
        titre: ""
      },
      routes: [],
      displayRoute: [],
      currentRoute: {
        id: 0,
        description: "",
        frontRoute: "",
        version: 0

      },
      message: "",
      ifError: null,
      loading: false
    };
  }

  componentDidMount() {
    this.getRole(this.props.roleId.id);
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

  getRole(id) {
    RoleService.getRoleById(id)
      .then(response => {
        const displayRoute = this.getPaginatedItems(response.data.droitAcces);
        const pageCountRoutes = Math.ceil(response.data.droitAcces.length / this.state.perPageRoute);
        this.setState({
          currentRole: response.data,
          routes: response.data.droitAcces,
          displayRoute: displayRoute,
          pageCountRoutes: pageCountRoutes
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  getPaginatedItems(items) {
    return items.slice(this.state.offsetRoute, this.state.offsetRoute + this.state.perPageRoute);
  }

  async loadRoute(search, prevOptions, { page }, e) {
    let response = await droitAccesService.getAllByPageAndKeywordAndNotListRole(page, 10, this.state.nameRoute, "ASC", "id", this.state.currentRole.id);
    let responseJSON = await response.data;
    return {
      options: responseJSON,
      hasMore: responseJSON.length >= 1,
      additional: {
        page: search ? 2 : page + 1,
      }
    };
  }

  onChangeInputRoute(e) {
    this.setState({ nameRoute: e })
  }

  onChangeRoute(e) {
    this.setState({ currentRoute: e });
  }

  addRoute(e) {
    e.preventDefault();
    let newRoute = this.state.currentRoute;
    const result = this.state.routes.find(e => e.id === newRoute.id);
    if (result === undefined) {
      if (newRoute.length !== 0) {
        roleService.insertDroitAccesByRole(this.state.currentRole.id, newRoute.id).then((response) => {
          const newItems = [...this.state.routes, newRoute];
          toast.success("Ajout de la route !", {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.setState({
            routes: newItems,
            displayRoute: newItems,
            currentRoute: {
              id: 0,
              description: "",
              frontRoute: "",
              version: 0
            }
          }, () => this.getRole(this.state.currentRole.id));
        }).catch((err) => { console.log("Erreur lors de l'ajout du droit d'acces") })
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
    roleService.deleteDroitAccesByRole(this.state.currentRole.id, key.id).then((resp) => {
      this.setState({ routes: filteredItem }, () => this.getRole(this.state.currentRole.id));
    }).catch((e) => { console.log('Le droit d\'acces n\'est pas supprime', e) })
  }

  handlePageClickRoute(data) {
    let selected = data.selected;
    let offset = Math.ceil(selected * this.state.perPageRoute);
    this.setState({ offsetRoute: offset }, () => {
      const displayRoute = this.getPaginatedItems(this.state.routes);
      this.setState({
        displayRoute: displayRoute,
      });
    });
  }

  updateRole(e) {
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
          RoleService.updateRole(RoleAndRoute)
            .then(response => {
              this.setState({
                currentRole: response.data,
                message: 'Modification bien prise en compte ! Redirection vers la liste de role.',
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
            message: "Ce role existe déjà.",
            ifError: true,
            loading: false
          });
        }
      })
    }
  }


  render() {
    const { currentRole, currentErrors, ifError, message, loading, currentRoute, pageCountRoutes, displayRoute } = this.state;
    return (
      <>
        <CTabs>
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink>
                <FontAwesomeIcon icon={faEdit} /> Modification du rôle
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink>
                <FontAwesomeIcon icon={faLink} /> Lier des routes
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink>
                <FontAwesomeIcon icon={faPlus} /> Créer une route
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink>
                <FontAwesomeIcon icon={faList} /> Liste des routes
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane>
              <CForm name="updateRole" className="mt-3" onSubmit={this.updateRole}>
                <CFormGroup>
                  <label htmlFor="role">Nom du rôle</label>
                  <input type="text" name="role" className="form-control" id="role" placeholder="Saisir un nom de role" value={currentRole.titre} onChange={this.onChangeRole} />
                  <span className="text-danger">{currentErrors.title}</span>
                </CFormGroup>
                <CButton type="submit" block color="info" disabled={loading}>
                  {loading && <CSpinner size="sm" variant="border" />} Modifier ce rôle
                </CButton>
                <Link to={"/role/liste"} className="withoutUnderlane">
                  <CButton className="mt-1" block color="danger" title="Vous voulez annuler ?">
                    Annuler
                  </CButton>
                </Link>
              </CForm>
              {ifError != null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
            </CTabPane>
            <CTabPane>
              <CForm className="justify-content-between mt-3" onSubmit={this.addRoute}>
                <CRow>
                  <CCol lg={10}>
                    <AsyncPaginate
                      name="route"
                      value={currentRoute && currentRoute}
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
                    <CButton color="primary" type="submit" className={`px-4`}  >Ajouter</CButton>
                  </CCol>
                </CRow>
                <CRow className="mt-4">
                  <CCol lg={12}>
                    <table className="table table-hover table-striped table-bordered ">
                      <thead>
                        <tr>
                          <th>Chemin de la route</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayRoute && displayRoute.length > 0 ? (
                          displayRoute.map(route =>
                            <tr key={route.id}>
                              <td>{route.frontRoute}</td>
                              <td>{<CButton color="danger" onClick={() => { this.deleteItem(route); }}>X</CButton>}</td>
                            </tr>
                          )
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center font-weight-bold" >Aucune route</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {pageCountRoutes > 1 && (<ReactPaginate
                      name="test"
                      previousLabel={'Précédent'}
                      nextLabel={'Suivant'}
                      breakLabel={'...'}
                      pageCount={this.state.pageCountRoutes}
                      pageRangeDisplayed={5}
                      marginPagesDisplayed={2}
                      onPageChange={this.handlePageClickRoute.bind(this)}
                      containerClassName={"pagination"}
                      subContainerClassName={"pages pagination"}
                      activeClassName={"active"}
                      pageLinkClassName="page-link"
                      breakLinkClassName="page-link"
                      nextLinkClassName="page-link"
                      previousLinkClassName="page-link"
                      pageClassName="page-item"
                      breakClassName="page-item"
                      nextClassName="page-item"
                      previousClassName="page-item"
                    />)}
                  </CCol>
                </CRow>
              </CForm>
            </CTabPane>
            <CTabPane>
              <CreateDroitAcces />
            </CTabPane>
            <CTabPane>
              <ListDroitAcces />
            </CTabPane>
          </CTabContent>
        </CTabs>
        <ToastContainer role="alert" delay={3000} limit={3} />
      </>
    );
  }
}

export default withRouter(UpdateRole)