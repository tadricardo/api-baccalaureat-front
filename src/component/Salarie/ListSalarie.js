import React, { Component } from "react";
import { CButton, CSelect } from "@coreui/react";
import { Link } from "react-router-dom";
import SalariesService from "../../services/salaries.service";
import { compareDateStringWithDateCurrent } from "../../utils/fonctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from 'react-paginate';
import { connect } from "react-redux";
import salariesService from "../../services/salaries.service";
import jwt_decode from 'jwt-decode';

class ListSalarie extends Component {
  constructor(props) {
    super(props);
    this.retrieveSalaries = this.retrieveSalaries.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.searchEmployee = this.searchEmployee.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.triPar = this.triPar.bind(this);
    this.state = {
      sortBy: "nom",
      order: "ASC",
      loading: false,
      salaries: [],
      itemsPerPage: 5,
      currentPage: 0,
      pageCount: 0,
      searchExpression: "",
      currentUser: jwt_decode(this.props.user),
      acces: jwt_decode(this.props.acces)
    };
  }

  componentDidMount() {
    this.retrieveSalaries();
  }

  retrieveSalaries() {
    if (this.props.isRole === 3) {
      salariesService.countManager(this.state.currentUser.id,this.state.searchExpression).then((resp) => {
        let nbPage = Math.ceil(resp.data / this.state.itemsPerPage)
        this.setState({ pageCount: nbPage })
      }).catch((e) => { console.log(e) });
      salariesService.getAllSalarieByIdManagerAndLastnamePerPage(this.state.currentPage, this.state.itemsPerPage, this.state.currentUser.id,this.state.searchExpression).then((response) => {
        this.setState({
          salaries: response.data,
        });
      })
        .catch((e) => {
          console.log(e);
        });
    } else {
      SalariesService.count(this.state.searchExpression).then((resp) => {
        let nbPage = Math.ceil(resp.data / this.state.itemsPerPage)
        this.setState({ pageCount: nbPage })
      }).catch((e) => { console.log(e) });
      SalariesService.getAllSalariesByKeywordPerPage(this.state.currentPage, this.state.itemsPerPage, this.state.searchExpression, this.state.order, this.state.sortBy)
        .then((response) => {
          this.setState({
            salaries: response.data,
            loading: false,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }

  }

  handlePageClick = (data) => {
    let selected = data.selected;
    this.setState({ currentPage: selected }, () => {
      this.retrieveSalaries();
    });
  };

  searchEmployee(e) {
    e.preventDefault();
    this.setState({ currentPage: 0 }, () => { this.retrieveSalaries(); });
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "searchExpression") {
      this.setState({ searchExpression: value })
    }
    if (name === "nbPage") {
      this.setState({ loading: true, itemsPerPage: value, currentPage: 0 }, () => { this.retrieveSalaries(); })
    }
  }

  triPar(sort) {
    if (this.state.sortBy === sort) {
      if (this.state.order === "DESC") {
        this.setState({
          order: "ASC"
        });
      } else {
        this.setState({
          order: "DESC"
        });
      }
    } else {
      if (this.state.order === "DESC") {
        this.setState({
          sortBy: sort,
          order: "ASC"
        });
      } else {
        this.setState({
          sortBy: sort,
          order: "DESC"
        });
      }
    }
    this.retrieveSalaries();
  }
 

  render() {
    const { salaries, loading, acces } = this.state;
    
    return (
      <>
        <div className="row justify-content-between mt-4">
          <form name="searchEmployee" onSubmit={this.searchEmployee} className="col-md-8">
            <div className="input-group mb-2">
              <input type="text" id="search-expression" disabled={loading} name="searchExpression" placeholder="Saisir votre recherche.." onChange={this.handleChange} className="form-control" />
              <span className="input-group-prepend">
                <CButton type="submit" block color="info" disabled={loading}>
                  Recherche
                </CButton>
              </span>
            </div>
          </form>
          <form className={"col-md-2"}>
            <CSelect
              custom
              name="nbPage"
              id="nbPage"
              onChange={this.handleChange}
              disabled={loading}>
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
                  <th onClick={() => this.triPar("nom")} >Nom prénom</th>
                  <th onClick={() => this.triPar("typeContrat")} >Type de contrat</th>
                  <th onClick={() => this.triPar("poste")} >Poste</th>
                  <th onClick={() => this.triPar("manager")} >Manager</th>
                  <th onClick={() => this.triPar("lieuTravail")} >Entreprise du poste</th>
                  <th onClick={() => this.triPar("actif")} >Compte actif</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<tr><td colSpan="6" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                  salaries.length !== 0 ?
                    salaries.map((salarie) => (
                      <tr key={salarie.id}>
                        <td>{salarie.nom + " " + salarie.prenom}</td>
                        <td>
                          {salarie.postes.length !== 0
                            ? compareDateStringWithDateCurrent(salarie.postes[0].dateFin) || salarie.postes[0].dateFin === null ? salarie.postes[0].typeContrat.type : ""
                            : ""}
                        </td>
                        <td>
                          {salarie.postes.length !== 0
                            ? compareDateStringWithDateCurrent(
                              salarie.postes[0].dateFin
                            ) || salarie.postes[0].dateFin === null
                              ? salarie.postes[0].titrePoste.intitule
                              : ""
                            : ""}
                        </td>
                        <td>
                          {salarie.postes.length !== 0 ?
                            compareDateStringWithDateCurrent(salarie.postes[0].dateFin) || salarie.postes[0].dateFin === null ?
                              salarie.postes[0].manager === null ? "" :
                                salarie.postes[0].manager.nom + " " + salarie.postes[0].manager.prenom : "" : ""
                          }
                        </td>
                        <td>
                          {salarie.postes.length !== 0
                            ? compareDateStringWithDateCurrent(
                              salarie.postes[0].dateFin
                            ) || salarie.postes[0].dateFin === null
                              ? salarie.postes[salarie.postes.length - 1]
                                .lieuTravail.nom
                              : ""
                            : ""}
                        </td>
                        <td>
                          {salarie.actif ? <span className="text-success">OUI</span> : <span className="text-danger">NON</span>}
                        </td>
                        <td>
                          <Link to={"/salaries/profil/" + salarie.id}>
                            <CButton
                              className="mr-2"
                              color="info"
                              title="Vous voulez voir ce profil ?"
                            >
                              {" "}
                              <FontAwesomeIcon icon={faEye} /> Voir
                            </CButton>
                          </Link>{" "}
                          {
                            acces.acces.some(acces => acces.frontRoute === "/salaries/modification/:id") && (<Link to={"/salaries/modification/" + salarie.id}>
                              <CButton
                                className="mr-2"
                                color="info"
                                title="Vous voulez modifier ce salarie ?"
                              >
                                <FontAwesomeIcon icon={faEdit} /> Modifier
                              </CButton>
                            </Link>)}

                        </td>
                      </tr>
                    )) : (<tr><td colSpan="6" className="text-center font-weight-bold">Aucun salarié</td></tr>))}
              </tbody>
            </table>
            {this.state.pageCount > 1 && (
              <ReactPaginate
                previousLabel={'Précédent'}
                nextLabel={'Suivant'}
                breakLabel={'...'}
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
function mapStateToProps(state) {
  const { isRole, user, acces } = state.authen;
  return {
    isRole,
    user,
    acces
  };
}
export default connect(mapStateToProps)(ListSalarie);
