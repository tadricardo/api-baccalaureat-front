import { CButton, CSelect, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import RoleService from "../../services/role.service";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

class ListRole extends Component {
  order = "ASC";
  constructor(props) {
    super(props);
    this.retrieveRole = this.retrieveRole.bind(this);
    this.ifdelete = this.ifdelete.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.searchRole = this.searchRole.bind(this);
    this.state = {
      roles: [],
      itemsPerPage: 5,
      currentPage: 0,
      pageCount: 0,
      searchExpression: "",
      loading: false
    };
  }

  componentDidMount() {
    this.retrieveRole();
  }

  retrieveRole() {
    RoleService.countRole(this.state.searchExpression)
      .then((resp) => {
        let nbPage = Math.ceil(resp.data / this.state.itemsPerPage);
        this.setState({ pageCount: nbPage });
      })
      .catch((e) => {
        console.log(e);
      });
    RoleService.getAllRolesPageAndKeyword(this.state.currentPage, this.state.itemsPerPage, this.state.searchExpression, this.order)
      .then((response) => {
        this.setState({
          roles: response.data,
          loading: false
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  handlePageClick = (data) => {
    let selected = data.selected;
    this.setState({ currentPage: selected }, () => {
      this.retrieveRole();
    });
  };

  searchRole(e) {
    e.preventDefault();
    this.setState({ currentPage: 0 }, () => { this.retrieveRole(); });
  }

  ifdelete(role) {
    const {currentPage} = this.state;
    swal({
      title: "Êtes-vous sûrs ?",
      text: "Voulez-vous supprimer se rôle : '" + role.titre + "' ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        RoleService.deleteById(role.id)
          .then((resp) => {
            swal("Suppression bien prise en compte !", {
              icon: "success",
            });
            this.setState({
              currentPage: currentPage !== 0  ? currentPage - 1 : currentPage
            });
            this.retrieveRole();
          })
          .catch((e) => {
            swal(e.message + "\nCe rôle est utilisé.", {
              icon: "error",
            });
            this.setState({
              message: e.message,
            });
          });
        swal("Suppression bien prise en compte !", {
          icon: "success",
        });
      }
    });
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "searchExpression") {
      this.setState({ searchExpression: value })
    }
    if (name === "nbPage") {
      this.setState({ loading: true, itemsPerPage: value, currentPage: 0 }, () => { this.retrieveRole(); })
    }
  }

  render() {
    const { roles, loading } = this.state;
    return (
      <>
        <div className="row justify-content-between mt-4">
          <form name="searchEmployee" onSubmit={this.searchRole} className="col-md-8">
            <div className="input-group mb-2">
              <input type="text" id="search-expression"
                name="searchExpression" placeholder="Saisir votre recherche.." onChange={this.handleChange} disabled={loading} className="form-control" />
              <span className="input-group-prepend">
                <CButton type="submit" block color="info" disabled={loading}>
                  {loading && <CSpinner size="sm" variant="border" />} Recherche
                </CButton>
              </span>
            </div>
          </form>
          <form name="nbPageForm" className="col-md-2 ">
            <CSelect
              custom
              name="nbPage"
              id="nbPage"
              onChange={this.handleChange}
              disabled={loading}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </CSelect>
          </form>
        </div>
        <div className="row mt-4">
          <div className="col-lg-12 table-responsive">
            <table className="table table-hover table-striped table-bordered">
              <thead>
                <tr>
                  <th onClick={() => {this.order = this.order === "ASC" ? "DESC" : "ASC"; this.retrieveRole()}}>Nom</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<tr><td colSpan="2" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                  roles.length !== 0 ? (
                    roles.map((role) => (
                      <tr key={role.id}>
                        <td>{role.titre}</td>
                        <td>
                          <Link to={"/role/modification/" + role.id}>
                            <CButton
                              className="mr-2"
                              color="info"
                              title="Vous voulez modifier cette ligne ?"
                            >
                              <FontAwesomeIcon icon={faEdit} /> Modifier
                            </CButton>
                          </Link>
                          {/*<CButton
                        color="danger"
                        onClick={() => this.ifdelete(role)}
                      >
                       <FontAwesomeIcon icon={faTrash} /> Supprimer
                      </CButton>*/}
                        </td>
                      </tr>
                    ))) : (<tr><td colSpan="2" className="text-center font-weight-bold">Aucun rôle</td></tr>))}
              </tbody>
            </table>
            {this.state.pageCount > 1 && (
              <ReactPaginate
                previousLabel={"Précédent"}
                nextLabel={"Suivant"}
                breakLabel={"..."}
                pageCount={this.state.pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={4}
                onPageChange={this.handlePageClick}
                containerClassName="pagination"
                activeClassName="active"
                pageLinkClassName="page-link"
                breakLinkClassName="page-link"
                nextLinkClassName="page-link"
                previousLinkClassName="page-link"
                pageClassName="page-item"
                breakClassName="page-item"
                nextClassName="page-item"
                previousClassName="page-item"
                forcePage={this.state.currentPage}
              />)}
          </div>
        </div>
      </>
    );
  }
}

export default ListRole;
