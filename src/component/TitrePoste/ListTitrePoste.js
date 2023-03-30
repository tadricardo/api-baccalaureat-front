import { CButton, CSelect, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import TitrePosteService from "../../services/titre-poste.service";
import posteFicheService from "../../services/poste-fiche.service";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import FileSaver from 'file-saver';
class ListTitrePoste extends Component {
  constructor(props) {
    super(props);
    this.retrieveTitrePoste = this.retrieveTitrePoste.bind(this);
    this.ifdelete = this.ifdelete.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.searchTitle = this.searchTitle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.triPar = this.triPar.bind(this);
    this.state = {
      titresPostes: [],
      itemsPerPage: 5,
      currentPage: 0,
      pageCount: 0,
      searchExpression: "",
      loading: false,
      order: "ASC",
      sortBy: "intitule",
    };
  }

  componentDidMount() {
    this.retrieveTitrePoste();
  }

  retrieveTitrePoste() {
    TitrePosteService.countTitrePoste(this.state.searchExpression)
      .then((resp) => {
        let nbPage = Math.ceil(resp.data / this.state.itemsPerPage);
        this.setState({ pageCount: nbPage });
      })
      .catch((e) => {
        console.log(e);
      });
    TitrePosteService.getAllTitrePosteByPageAndKeyword(this.state.currentPage, this.state.itemsPerPage, this.state.searchExpression, this.state.order, this.state.sortBy)
      .then((response) => {
        this.setState({
          titresPostes: response.data,
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
      this.retrieveTitrePoste();
    });
  };

  searchTitle(e) {
    e.preventDefault();
    this.setState({ currentPage: 0 }, () => {
      this.retrieveTitrePoste();
    });
  }

  ifdelete(titrePoste) {
    const { currentPage } = this.state;
    swal({
      title: "Êtes-vous sûrs ?",
      text:
        "Voulez-vous supprimer cet intitulé de poste : '" +
        titrePoste.intitule +
        "' du service " + titrePoste.domaine.titre + " ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        TitrePosteService.deleteTitrePosteById(titrePoste.id)
          .then((resp) => {
            swal("Suppression bien prise en compte !", {
              icon: "success",
            });
            this.setState({
              currentPage: currentPage !== 0 ? currentPage - 1 : currentPage
            });
            this.retrieveTitrePoste();
          })
          .catch((e) => {
            swal(e.message + "\nCet intitulé de poste est utilisé.", {
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
      this.setState({ searchExpression: value })
    }
    if (name === "nbPage") {
      this.setState({ loading: true, itemsPerPage: value, currentPage: 0 }, () => { this.retrieveTitrePoste(); })
    }
  }

  downloadFile = (id) => {
    posteFicheService.getFile(id).then(res => {
      const filename = res.headers['content-disposition'].split('filename=')[1];
      const blob = new Blob([res.data]);
      FileSaver.saveAs(blob, `${filename}`);
    }).catch(e =>
      console.log("Erreur lors du téléchargement : ", e),
    );
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
    this.retrieveTitrePoste();
  }

  render() {
    const { titresPostes, loading } = this.state;
    return (
      <>
        <div className="row justify-content-between mt-4">
          <form name="searchEmployee" onSubmit={this.searchTitle} className="col-md-8">
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
              <thead>
                <tr>
                  <th onClick={() => this.triPar("intitule")} className="cursor-pointer" title="Cliquer pour trier." >Intitulé</th>
                  <th onClick={() => this.triPar("domaine.titre")} className="cursor-pointer" title="Cliquer pour trier." >Service</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<tr><td colSpan="2" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                  titresPostes.length !== 0 ? (
                    titresPostes.map((titrePoste) => (
                      <tr key={titrePoste.id}>
                        <td>{titrePoste.intitule}</td>
                        <td>{titrePoste.domaine.titre}</td>
                        <td>
                          <Link to={"/titre-poste/modification/" + titrePoste.id}>
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
                            onClick={() => this.ifdelete(titrePoste)}
                          >
                            <FontAwesomeIcon icon={faTrash} /> Supprimer
                          </CButton>
                          <CButton color="info" className="ml-2" onClick={() => this.downloadFile(titrePoste.posteFiche.id)}>Telecharger la Fiche de Poste</CButton>
                        </td>
                      </tr>
                    ))) : (<tr><td colSpan="3" className="text-center font-weight-bold">Aucune compétence</td></tr>))}
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

export default ListTitrePoste;
