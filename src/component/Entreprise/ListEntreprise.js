import React, { Component } from "react";
import { CButton, CSelect, CSpinner } from "@coreui/react";
import { Link } from "react-router-dom";
import EntreprisesService from "../../services/entreprises.service";
import ReactPaginate from 'react-paginate';
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import swal from "sweetalert";
class ListEntreprise extends Component {
  constructor(props) {
    super(props);
    this.retrieveEntreprise = this.retrieveEntreprise.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.searchEntreprise = this.searchEntreprise.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.triPar = this.triPar.bind(this);
    this.state = {
      entreprises: [],
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
    this.retrieveEntreprise();
  }

  retrieveEntreprise() {
    EntreprisesService.count(this.state.searchExpression).then((resp) => {
      let nbPage = Math.ceil(resp.data / this.state.itemsPerPage);
      this.setState({ pageCount: nbPage })
    }).catch((e) => { console.log(e) });
    EntreprisesService.getAllEntreprisesPageAndKeyword(this.state.currentPage, this.state.itemsPerPage, this.state.searchExpression, this.state.order, this.state.sortBy)
      .then(response => {
        this.setState({
          entreprises: response.data,
          loading: false,
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  handlePageClick = (data) => {
    let selected = data.selected;
    this.setState({ currentPage: selected }, () => {
      this.retrieveEntreprise();
    });
  };

  searchEntreprise(e) {
    e.preventDefault();
    this.setState({ loading: true, currentPage: 0 }, () => { this.retrieveEntreprise(); });
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "searchExpression") {
      this.setState({ searchExpression: value })
    }
    if (name === "nbPage") {
      this.setState({ loading: true, itemsPerPage: value, currentPage: 0 }, () => { this.retrieveEntreprise(); })
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
    this.retrieveEntreprise();
  }

  ifdelete(entreprise) {
    const { currentPage } = this.state;
    swal({
      title: "Êtes-vous sûrs ?",
      text:
        "Voulez-vous supprimer cette entreprise : " + entreprise.nom + " située au " + entreprise.adresse.numero + " " + entreprise.adresse.voie + " " + entreprise.adresse.ville + ", " + entreprise.adresse.codePostal + " " + entreprise.adresse.pays + " ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        EntreprisesService.delete(entreprise.id)
          .then((resp) => {
            swal("Suppression bien prise en compte !", {
              icon: "success",
            });
            this.setState({
              currentPage: currentPage !== 0 ? currentPage - 1 : currentPage
            });
            this.retrieveEntreprise();
          })
          .catch((e) => {
            EntreprisesService.isEntrepriseUsed(entreprise.id).then((resp) => {
              if (resp.data) {
                swal("Cette entreprise est utilisée, impossible de la supprimer.", {
                  icon: "error",
                });
              }
            }).catch((e) => {
              swal("Erreur lors de la suppression.", {
                icon: "error",
              });
            })
          });
      }
    });
  }


  render() {
    const { entreprises, loading } = this.state;
    return (
      <>
        <div className="row justify-content-between mt-4">
          <form name="searchEmployee" onSubmit={this.searchEntreprise} className="col-md-8">
            <div className="input-group mb-2">
              <input type="text" id="search-expression"
                name="searchExpression" placeholder="Saisir votre recherche.." disabled={loading} onChange={this.handleChange} className="form-control" />
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
                  <th onClick={() => this.triPar("nom")} >Nom</th>
                  <th onClick={() => this.triPar("adresse.voie")} >Adresse</th>
                  <th onClick={() => this.triPar("adresse.complementAdresse")} >Complément</th>
                  <th onClick={() => this.triPar("adresse.ville")} >Ville</th>
                  <th onClick={() => this.triPar("adresse.pays")} >Pays</th>
                  <th onClick={() => this.triPar("conventionCollective")} >Convention collective</th>
                  <th onClick={() => this.triPar("numeroSIRET")} >SIRET</th>
                  <th onClick={() => this.triPar("actif")} >Actif</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<tr><td colSpan="6" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                  entreprises.length !== 0 ?
                    entreprises.map(entreprises =>
                      <tr key={entreprises.id}>
                        <td>{entreprises.nom}</td>
                        <td>{entreprises.adresse.numero + " " + entreprises.adresse.voie}</td>
                        <td>{entreprises.adresse.complementAdresse}</td>
                        <td>{entreprises.adresse.ville + " " + entreprises.adresse.codePostal}</td>
                        <td>{entreprises.adresse.pays}</td>
                        <td>{entreprises.conventionCollective}</td>
                        <td>{entreprises.numeroSIRET}</td>
                        <td>{entreprises.actif ? <span className="text-success">Actif</span> : <span className="text-danger">Inactif</span>}</td>
                        <td>
                          <div className="row">
                            <div className="col-3">
                              <Link to={"/entreprises/modification/" + entreprises.id}><CButton className="mr-2" color="info" title="Vous voulez modifier cette entreprise ?"><FontAwesomeIcon icon={faEdit} /> Modifier</CButton></Link>

                            </div>

                            <div className="col-3">
                              <CButton
                                color="danger"
                                onClick={() => this.ifdelete(entreprises)}
                                title="Vous voulez supprimer cette entreprise ?">
                                <FontAwesomeIcon icon={faTrash} /> Supprimer
                              </CButton>
                            </div>
                            <div className="col-6">
                              <Link to={"/entreprises/organigramme/" + entreprises.id}><CButton className="ml-2" color="info" title="Organigramme de l'entreprise"> Organigramme </CButton></Link>

                            </div>

                          </div>

                        </td>
                      </tr>
                    ) : (<tr><td colSpan="6" className="text-center font-weight-bold">Aucune entreprise</td></tr>))}
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

export default ListEntreprise;