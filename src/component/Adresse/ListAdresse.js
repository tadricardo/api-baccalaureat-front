import { CButton, CSelect } from "@coreui/react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import ReactPaginate from 'react-paginate';
import { Link } from "react-router-dom";
import swal from "sweetalert";
import AdressesService from "../../services/adresses.service";

class ListAdresse extends Component {
  constructor(props) {
    super(props);
    this.retrieveAdresses = this.retrieveAdresses.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.searchAddress = this.searchAddress.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.triPar = this.triPar.bind(this);
    this.state = {
      adresses: [],
      itemsPerPage: 5,
      currentPage: 0,
      pageCount: 0,
      searchExpression: "",
      loading: false,
      sortBy: "ville",
      order: "ASC",
    };
  }

  componentDidMount() {
    this.retrieveAdresses();
  }

  retrieveAdresses() {
    AdressesService.count(this.state.searchExpression).then((resp) => {
      let nbPage = Math.ceil(resp.data / this.state.itemsPerPage)
      this.setState({ pageCount: nbPage })
    }).catch((e) => { console.log(e) });
    AdressesService.getAllAdresseByPageAndKeyword(this.state.currentPage, this.state.itemsPerPage, this.state.searchExpression, this.state.sortBy, this.state.order)
      .then(response => {
        this.setState({
          adresses: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchAddress(e) {
    e.preventDefault();
    this.setState({ currentPage: 0 }, () => { this.retrieveAdresses(); });
  }

  handlePageClick = (data) => {
    let selected = data.selected;
    this.setState({ currentPage: selected }, () => {
      this.retrieveAdresses();
    });
  };

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "searchExpression") {
      this.setState({ searchExpression: value })
    }
    if (name === "nbPage") {
      this.setState({ loading: true, itemsPerPage: value, currentPage: 0 }, () => { this.retrieveAdresses(); })
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
    this.retrieveAdresses();
  }

  ifdelete(adresse) {
    const {currentPage} = this.state;
    swal({
      title: "Êtes-vous sûrs ?",
      text: `Voulez-vous supprimer cette adresse : ${adresse.numero} ${adresse.voie} ${adresse.ville} ${adresse.codePostal} ${adresse.pays} ?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        AdressesService.delete(adresse.id)
          .then((resp) => {
            swal("Suppression bien prise en compte !", {
              icon: "success",
            });
            this.setState({
              currentPage: currentPage !== 0  ? currentPage - 1 : currentPage
            });
            this.retrieveAdresses();
          })
          .catch((e) => {
            AdressesService.isAdresseUsed(adresse.id).then((resp) => {
              if(resp.data){
                swal("Cette adresse est utilisée, impossible de la supprimer.", {
                  icon: "error",
                });
              }
            }).catch((e)=>{
              swal("Erreur lors de la suppression.", {
                icon: "error",
              });
            })
          });
      }
    });
  }

  render() {
    const { adresses, loading } = this.state;
    return (
      <>
        {adresses.length !== 0 && (
          <div className="row justify-content-between mt-4">
            <form name="searchEmployee" onSubmit={this.searchAddress} className="col-md-8">
              <div className="input-group mb-2">
                <input type="text" id="search-expression" disabled={loading}
                  name="searchExpression" placeholder="Saisir votre recherche.." onChange={this.handleChange} className="form-control" />
                <span className="input-group-prepend">
                  <CButton type="submit" block color="info" disabled={loading}>
                    Recherche
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
        )}
        <div className="row mt-4">
          <div className="col-lg-12 table-responsive">
            <table className="table table-hover table-striped table-bordered ">
              <thead className="cursor-pointer" title="Cliquer pour trier.">
                <tr>
                  <th onClick={() => this.triPar("numero")} >Numéro</th>
                  <th onClick={() => this.triPar("voie")} >Voie</th>
                  <th onClick={() => this.triPar("complementAdresse")} >Complément</th>
                  <th onClick={() => this.triPar("ville")} >Ville</th>
                  <th onClick={() => this.triPar("codePostal")} >Code Postal</th>
                  <th onClick={() => this.triPar("pays")} >Pays</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<tr><td colSpan="6" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                  adresses.length !== 0 ?
                    adresses.map(adresse =>
                      <tr key={adresse.id}>
                        <td>{adresse.numero}</td>
                        <td>{adresse.voie}</td>
                        <td>{adresse.complementAdresse !== null ? adresse.complementAdresse : " "}</td>
                        <td>{adresse.ville}</td>
                        <td>{adresse.codePostal}</td>
                        <td>{adresse.pays}</td>
                        <td>
                          <Link to={`/adresses/modification/${adresse.id}`}><CButton className="mr-2" color="info" title="Vous voulez modifier cette ligne ?"><FontAwesomeIcon icon={faEdit} /> Modifier </CButton></Link>
                          <CButton
                            color="danger"
                            onClick={() => this.ifdelete(adresse)}
                            title="Vous voulez supprimer cette ligne ?"
                          >
                            <FontAwesomeIcon icon={faTrash} /> Supprimer
                          </CButton>
                        </td>
                      </tr>
                    ) : (<tr><td colSpan="7" className="text-center font-weight-bold">Aucun adresse</td></tr>))}
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

export default ListAdresse;