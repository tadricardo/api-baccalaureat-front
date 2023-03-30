import { CButton, CSelect } from '@coreui/react';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import ReactPaginate from 'react-paginate';
import { withRouter } from 'react-router';
import swal from 'sweetalert';
import ActivityDomainService from '../../../services/activityDomain.service'

class ListActivityDomain extends Component {
  order = ""
  constructor(props) {
    super(props);
    this.retrieveActivityDomain = this.retrieveActivityDomain.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.search = this.search.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.ifdelete = this.ifdelete.bind(this);
    this.state = {
      activityDomain: [],
      itemsPerPage: 5,
      currentPage: 0,
      pageCount: 0,
      searchExpression: "",
      message: "",
      ifError: null,
      loading: false
    };
  }

  componentDidMount() {
    this.retrieveActivityDomain();
  }

  retrieveActivityDomain() {
    ActivityDomainService.count()
      .then((resp) => {
        let nbPage = Math.ceil(resp.data / this.state.itemsPerPage);
        this.setState({ pageCount: nbPage });
      })
      .catch((e) => {
        console.log(e);
      });
    ActivityDomainService.getAllAnnualDomainByPage(this.state.currentPage, this.state.itemsPerPage)
      .then((response) => {
        this.setState({
          activityDomain: response.data,
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
      this.retrieveActivityDomain();
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
      this.setState({ loading: true, itemsPerPage: value, currentPage: 0 }, () => { this.retrieveActivityDomain(); })
    }
  }

  search(e) {
    e.preventDefault();
    this.setState({ loading: true, currentPage: 0 }, () => { this.retrieveActivityDomain(); });
  }

  ifdelete(domain){
    const {currentPage} = this.state;
    swal({
      title: "Êtes-vous sûrs ?",
      text: "Voulez-vous supprimer ce domaine de plan d'activité ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        ActivityDomainService.delete(domain.id)
          .then((resp) => {
            swal("Suppression bien prise en compte !", {
              icon: "success",
            });
            this.setState({
              currentPage: currentPage !== 0  ? currentPage - 1 : currentPage
            });
            this.retrieveActivityDomain();
          })
          .catch((e) => {
            this.setState({
              message: e.message,
            });
          });
      }
    });
  }

  sort() {
    this.order = this.order === "ASC" ? "DESC" : "ASC";
    let comp = this.order === "ASC" ? 1 : -1;
    this.setState({
      activityDomain: this.state.activityDomain.sort((a1, a2) => (a1 > a2 ? comp : -comp))
    })
  }

  render() {
    const { activityDomain, loading, pageCount, currentPage } = this.state;
    return (
      <>
        <div className="row justify-content-between mt-4">
          {/*<form name="searchEmployee" onSubmit={this.search} className="col-md-8">
            <div className="input-group mb-2">
              <input type="text" id="search-expression"
                name="searchExpression" placeholder="Saisir votre recherche.." disabled={loading} onChange={this.handleChange} className="form-control" />
              <span className="input-group-prepend">
                <CButton type="submit" block color="info" disabled={loading}>
                  {loading && <CSpinner size="sm" variant="border" />} Recherche
                </CButton>
              </span>
            </div>
    </form>*/}
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
          <div className="col-lg-12">
            <table className="table table-hover table-striped table-bordered">
              <thead className="cursor-pointer" title="Cliquer pour trier.">
                <tr>
                  <th onClick={() => this.sort()}>Titre du domaine</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<tr><td colSpan="6" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                  activityDomain.length !== 0 ?
                    activityDomain.map(domain =>
                      <tr key={domain.id}>
                        <td>{domain.titre}</td>
                        <td>
                          <CButton className="mr-2" to={"/activite-domaine/modification/" + domain.id} color="info" title="Vous voulez modifier cette ligne ?"><FontAwesomeIcon icon={faEdit} /> Modifier</CButton>
                          <CButton color="danger" onClick={() => this.ifdelete(domain)}><FontAwesomeIcon icon={faTrash} /> Supprimer</CButton>
                        </td>
                      </tr>
                    ) : (<tr><td colSpan="6" className="text-center font-weight-bold">Aucun domaine activité</td></tr>))}
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

export default withRouter(ListActivityDomain);
