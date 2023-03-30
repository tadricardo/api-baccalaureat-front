import { CButton, CSelect, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import ServiceService from "../../services/service.service";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

class ListService extends Component {
  constructor(props) {
    super(props);
    this.retrieveService = this.retrieveService.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.ifdelete = this.ifdelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.searchDomain = this.searchDomain.bind(this);
    this.triPar = this.triPar.bind(this);
    this.state = {
      services: [],
      itemsPerPage: 5,
      currentPage: 0,
      pageCount: 0,
      searchExpression: "",
      loading: false,
      order: "ASC",
    };
  }

  componentDidMount() {
    this.retrieveService();
  }

  retrieveService() {
    ServiceService.countService(this.state.searchExpression)
      .then((resp) => {
        let nbPage = Math.ceil(resp.data / this.state.itemsPerPage);
        this.setState({ pageCount: nbPage });
      })
      .catch((e) => {
        console.log(e);
      });
    ServiceService.getAllServiceByPageAndKeyword(
      this.state.currentPage,
      this.state.itemsPerPage,
      this.state.searchExpression,
      this.state.order
    )
      .then((response) => {
        this.setState({
          services: response.data,
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
      this.retrieveService();
    });
  };

  searchDomain(e) {
    e.preventDefault();
    this.setState({ currentPage: 0 }, () => { this.retrieveService(); });
  }

  ifdelete(service) {
    const {currentPage} = this.state;
    swal({
      title: "Êtes-vous sûrs ?",
      text: "Voulez-vous supprimer se service : '" + service.titre + "' ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        ServiceService.delete(service.id)
          .then((resp) => {
            swal("Suppression bien prise en compte !", {
              icon: "success",
            });
            this.setState({
              currentPage: currentPage !== 0  ? currentPage - 1 : currentPage
            });
            this.retrieveService();
          })
          .catch((e) => {
            swal(e.message + "\nCe service est utilisé.", {
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
      this.setState({ loading: true, itemsPerPage: value, currentPage: 0 }, () => { this.retrieveService(); })
    }
  }

  triPar() {
    if (this.state.order === "DESC") {
      this.setState({
        order: "ASC"
      });
    } else {
      this.setState({
        order: "DESC"
      });
    }
    this.retrieveService();
  }

  render() {
    const { services, loading } = this.state;
    return (
      <>
        <div className="row justify-content-between mt-4">
          <form name="searchEmployee" onSubmit={this.searchDomain} className="row col-md-8 ml-1">
            <input type="text" id="search-expression"
                name="searchExpression" placeholder="Saisir votre recherche.." disabled={loading} onChange={this.handleChange} className="form-control col-8 mr-1" />
            <CButton type="submit" className="col-auto" block color="info" disabled={loading}>
              {loading && <CSpinner size="sm" variant="border" />} Recherche
            </CButton> 
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
                  <th onClick={() => this.triPar()} className="cursor-pointer" title="Cliquer pour trier." >Nom</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<tr><td colSpan="6" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                  services.length !== 0 ? (
                    services.map((service) => (
                      <tr key={service.id}>
                        <td>{service.titre}</td>
                        <td>
                          <Link to={"/Service/modification/" + service.id}>
                            <CButton
                              className="mr-2"
                              color="info"
                              title="Vous voulez modifier cette ligne ?"
                            >
                              <FontAwesomeIcon icon={faEdit} /> Modifier
                            </CButton>
                          </Link>
                          <CButton
                            color="danger"
                            onClick={() => this.ifdelete(service)}
                          >
                            <FontAwesomeIcon icon={faTrash} /> Supprimer
                          </CButton>
                        </td>
                      </tr>
                    ))) : (<tr><td colSpan="2" className="text-center font-weight-bold">Aucun service</td></tr>))}
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

export default ListService;
