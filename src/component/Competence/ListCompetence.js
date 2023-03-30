import { CButton, CSelect, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import CompetenceService from "../../services/competence.service";
import ReactPaginate from "react-paginate";
import jwt_decode from 'jwt-decode';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

class ListCompetence extends Component {
  constructor(props) {
    super(props);
    this.retrieveCompetence = this.retrieveCompetence.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.ifdelete = this.ifdelete.bind(this);
    this.searchCompetence = this.searchCompetence.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      user: null,
      competences: [],
      itemsPerPage: 5,
      currentPage: 0,
      pageCount: 0,
      searchExpression: "",
      loading: false,
      sortBy: "nom",
      order: "ASC",
    };
  }

  componentDidMount() {
    const token = JSON.parse(localStorage.getItem('token'));
    const user = jwt_decode(token);
    this.setState({ user: user })
    
    if(user.roles === "MANAGER"){
      this.props.history.push("/competence/organigramme")
    } else {
      this.retrieveCompetence();
    }
  }

  retrieveCompetence() {
    CompetenceService.countCompetence(this.state.searchExpression)
      .then((resp) => {
        let nbPage = Math.ceil(resp.data / this.state.itemsPerPage);
        this.setState({ pageCount: nbPage });
      })
      .catch((e) => {
        console.log(e);
      });
    CompetenceService.getAllComptenceByPageAndKeyword(
      this.state.currentPage,
      this.state.itemsPerPage,
      this.state.searchExpression,
      this.state.order,
      this.state.sortBy
    )
      .then((response) => {
        this.setState({
          competences: response.data,
          loading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  handlePageClick = (data) => {
    let selected = data.selected;
    this.setState({ currentPage: selected }, () => {
      this.retrieveCompetence();
    });
  };

  searchCompetence(e) {
    e.preventDefault();
    this.setState({ currentPage: 0 }, () => {
      this.retrieveCompetence();
    });
  }

  ifdelete(competence) {
    const { currentPage } = this.state;
    swal({
      title: "Êtes-vous sûrs ?",
      text: `Voulez-vous supprimer cette compétence : ${
        competence.nom
      } appartenant au(x) service(s) : ${competence.domaines.map(
        (domaine) => domaine.titre + ", "
      )} ?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        CompetenceService.deleteById(competence.id)
          .then((resp) => {
            swal("Suppression bien prise en compte !", {
              icon: "success",
            });
            this.setState({
              currentPage: currentPage !== 0 ? currentPage - 1 : currentPage,
            });
            this.retrieveCompetence();
          })
          .catch((e) => {
            swal(e.message + "\nCette compétence est utilisée.", {
              icon: "error",
            });
            this.setState({
              message: e.message,
            });
          });
      }
    });
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "searchExpression") {
      this.setState({ searchExpression: value });
    }
    if (name === "nbPage") {
      this.setState(
        { loading: true, itemsPerPage: value, currentPage: 0 },
        () => {
          this.retrieveCompetence();
        }
      );
    }
  }

  triPar(sort) {
    if (this.state.sortBy === sort) {
      if (this.state.order === "DESC") {
        this.setState({
          order: "ASC",
        });
      } else {
        this.setState({
          order: "DESC",
        });
      }
    } else {
      if (this.state.order === "DESC") {
        this.setState({
          sortBy: sort,
          order: "ASC",
        });
      } else {
        this.setState({
          sortBy: sort,
          order: "DESC",
        });
      }
    }
    this.retrieveCompetence();
  }

  render() {
    const { competences, loading } = this.state;
    return (
      <>
        <div className="row justify-content-between mt-4">
          <form
            name="searchEmployee"
            onSubmit={this.searchCompetence}
            className="col-md-8"
          >
            <div className="input-group mb-2">
              <input
                type="text"
                id="search-expression"
                name="searchExpression"
                placeholder="Saisir votre recherche.."
                disabled={loading}
                onChange={this.handleChange}
                className="form-control"
              />
              <span className="input-group-prepend">
                <CButton type="submit" block color="info" disabled={loading}>
                  {loading && <CSpinner size="sm" variant="border" />} Recherche
                </CButton>
              </span>
            </div>
          </form>
          <form className="col-md-2 ">
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
              <thead className="cursor-pointer" title="Cliquer pour trier.">
                <tr>
                  <th onClick={() => this.triPar("nom")}>Compétence</th>
                  <th>Service</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center font-weight-bold">
                      Chargement...
                    </td>
                  </tr>
                ) : competences.length !== 0 ? (
                  competences.map((competence) => (
                    <tr key={competence.id}>
                      <td>{competence.nom}</td>
                      <td>
                        {competence.domaines.map((domaine, index) => {
                          if (competence.domaines.length === index + 1) {
                            return domaine.titre;
                          } else {
                            return `${domaine.titre}, `;
                          }
                        })}
                      </td>
                      <td>
                        <Link to={`/competence/modification/${competence.id}`}>
                          <CButton
                            className="mr-2"
                            color="info"
                            title="Vous voulez modifier cette compétence ?"
                          >
                            <FontAwesomeIcon icon={faEdit} /> Modifier
                          </CButton>
                        </Link>
                        <CButton
                          color="danger"
                          onClick={() => this.ifdelete(competence)}
                          title="Vous voulez supprimer cette compétence ?"
                        >
                          <FontAwesomeIcon icon={faTrash} /> Supprimer
                        </CButton>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center font-weight-bold">
                      Aucune compétence
                    </td>
                  </tr>
                )}
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
              />
            )}
          </div>
        </div>
      </>
    );
  }
}
export default withRouter(ListCompetence);