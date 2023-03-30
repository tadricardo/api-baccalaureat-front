import { CButton, CSelect, CSpinner } from '@coreui/react';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import ReactPaginate from 'react-paginate';
import { withRouter } from 'react-router'
import swal from 'sweetalert';
import droitAccesService from '../../services/droit-acces.service';
import DroitAccesService from '../../services/droit-acces.service';

class ListDroitAcces extends Component {
  constructor(props) {
    super(props)
    this.retrieveDroitAcces = this.retrieveDroitAcces.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.searchRoute = this.searchRoute.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      routes: [{
        id: 0,
        description: "",
        frontRoute: "",
        version: 0
      }],
      itemsPerPage: 5,
      currentPage: 0,
      pageCount: 0,
      searchExpression: "",
      loading: false,
      sortBy: "id",
      order: "ASC",
    }
  }

  componentDidMount() {
    this.retrieveDroitAcces();
  }

  retrieveDroitAcces() {
    DroitAccesService.count(this.state.searchExpression).then((resp) => {
      let nbPage = Math.ceil(resp.data / this.state.itemsPerPage);
      this.setState({ pageCount: nbPage })
    }).catch((e) => { console.log(e) });
    DroitAccesService.getAllByPageAndKeyword(this.state.currentPage, this.state.itemsPerPage, this.state.searchExpression, this.state.order, this.state.sortBy)
      .then(response => {
        this.setState({
          routes: response.data,
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
      this.retrieveDroitAcces();
    });
  };

  searchRoute(e) {
    e.preventDefault();
    this.setState({ loading: true, currentPage: 0 }, () => { this.retrieveDroitAcces(); });
  }

  ifdelete(route) {
    const {currentPage} = this.state;
    swal({
      title: "Êtes-vous sûrs ?",
      text: `Voulez-vous supprimer cette route : ${route.frontRoute} | ${route.description} ?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        droitAccesService.deleteDAById(route.id)
          .then((resp) => {
            swal("Suppression bien prise en compte !", {
              icon: "success",
            });
            this.setState({
              currentPage: currentPage !== 0  ? currentPage - 1 : currentPage
            });
            this.retrieveDroitAcces();
          })
          .catch((e) => {
            swal(e.message + "\nCette route est utilisé.", {
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
      this.setState({ loading: true, itemsPerPage: value, currentPage: 0 }, () => { this.retrieveEntreprise(); })
    }
  }

  render() {
    const { routes, loading, pageCount, currentPage } = this.state;
    return (
      <>
        <div className="row justify-content-between mt-4">
          <form name="searchEmployee" onSubmit={this.searchRoute} className="col-md-8">
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
                  <th>Description</th>
                  <th>Chemin</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<tr><td colSpan="6" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                  routes.length !== 0 ?
                    routes.map(route =>
                      <tr key={route.id}>
                        <td>{route.description}</td>
                        <td>{route.frontRoute}</td>
                        <td>
                          <CButton className="mr-2" to={"/route/modification/" + route.id} color="info" title="Vous voulez modifier cette ligne ?"><FontAwesomeIcon icon={faEdit} /> Modifier</CButton>
                          <CButton color="danger" onClick={() => this.ifdelete(route)}><FontAwesomeIcon icon={faTrash} /> Supprimer</CButton>
                        </td>
                      </tr>
                    ) : (<tr><td colSpan="6" className="text-center font-weight-bold">Aucune route</td></tr>))}
              </tbody>
            </table>
            {pageCount > 1 && (
              <ReactPaginate
                previousLabel={'Précédent'}
                nextLabel={'Suivant'}
                breakLabel={'...'}
                pageCount={pageCount}
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
                forcePage={currentPage}
              />)}
          </div>
        </div>
      </>
    )
  }
}
export default withRouter(ListDroitAcces)