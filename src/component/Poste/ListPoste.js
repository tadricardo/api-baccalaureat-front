import { CButton, CCol, CRow, CSelect } from "@coreui/react";
import React, { Component } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import PosteService from "../../services/poste.service";

/*function compareDateStringWithDateCurrent(string){
  let datePoste = new Date(string).getTime();
  let dateCurrent = new Date().getTime();
  if(datePoste < dateCurrent){
    return false;
  }else{
    return true;
  }
}*/

class ListPoste extends Component {
  constructor(props) {
    super(props);
    this.getPoste = this.getPoste.bind(this);
    this.getCurrentPoste = this.getCurrentPoste.bind(this);
    this.onchangeAllPoste = this.onchangeAllPoste.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.triPar = this.triPar.bind(this);

    this.state = {
      postes: [],
      sortBy: "nom",
      order: "ASC",
      itemsPerPage: 5,
      currentPage: 0,
      pageCount: 0,
      searchExpression: "",
    };
  }

  componentDidMount() {
    this.getCurrentPoste();
  }

  getPoste() {
    PosteService.countPoste().then((resp) => {
      let nbPage = Math.ceil(resp.data / this.state.itemsPerPage);
      this.setState({ pageCount: nbPage });
    }).catch((e) => {
      console.log(e);
    });
    PosteService.getAllPosteByPage(
      this.state.currentPage,
      this.state.itemsPerPage,
      this.state.order,
      this.state.sortBy
    ).then(response => {
      this.setState({
        postes: response.data
      });
    })
      .catch(e => {
        console.log(e);
      });
  }

  getCurrentPoste() {
    PosteService.countCurrentPoste().then((resp) => {
      let nbPage = Math.ceil(resp.data / this.state.itemsPerPage);
      this.setState({ pageCount: nbPage });
    }).catch(e => { console.log(e.response.data.message) })
    PosteService.getAllCurrentPoste(
      this.state.currentPage,
      this.state.itemsPerPage,
      this.state.order,
      this.state.sortBy
    ).then(response => {
      this.setState({
        postes: response.data
      });
    })
      .catch(e => {
        console.log(e);
      });
  }

  onchangeAllPoste() {
    if (document.getElementById("allPosteCurrentPoste").checked) {
      this.getPoste();
    } else {
      this.getCurrentPoste();
    }
  }

  handlePageClick = (data) => {
    let selected = data.selected;
    this.setState({ currentPage: selected }, () => {
      this.onchangeAllPoste();
    });
  };

  handleChange(e) {
    const value = e.target.value;
    this.setState({ itemsPerPage: value, currentPage: 0 }, () => { this.onchangeAllPoste(); })
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
    this.onchangeAllPoste();

  }

  render() {
    const { postes, pageCount } = this.state;
    return (
      <>
        <div className="row mt-4">
          <div className="col-lg-12">
            <div className="form-group form-check">
              <CRow>
                <CCol>
                  <input type="checkbox" value="1" className="form-check-input" id="allPosteCurrentPoste" onChange={this.onchangeAllPoste} />
                  <label className="form-check-label" htmlFor="allPosteCurrentPoste">Afficher l'historique des postes</label>
                </CCol>
                <CCol md="2" className="form-group">
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
                </CCol>
              </CRow>
            </div>
            <div className="table-responsive">
              <table className="table table-hover table-striped table-bordered">
                <thead className="cursor-pointer" title="Cliquer pour trier.">
                  <tr>
                    <th onClick={() => this.triPar("nom")}>Nom prénom</th>
                    <th onClick={() => this.triPar("intitulePoste")}>Poste</th>
                    <th onClick={() => this.triPar("typeContrat")}>Type de contrat</th>
                    <th onClick={() => this.triPar("domaine")}>Service</th>
                    <th onClick={() => this.triPar("manager")}>Manager</th>
                    <th onClick={() => this.triPar("lieuTravail")}>Lieu de travail</th>
                    <th onClick={() => this.triPar("maitreAppretissage")}>Maitre d'apprentissage</th>
                    <th onClick={() => this.triPar("dateDebut")}>Période</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {postes.length === 0 ?
                    <tr><td colSpan="9" className="text-center font-weight-bold">Aucun poste</td></tr> :
                    postes.map(poste =>
                      <tr key={poste.id}>
                        <td>{<Link id={poste.salarie.id} to={"/salaries/profil/" + poste.salarie.id} onClick={this.changeProfil}>{poste.salarie.nom + " " + poste.salarie.prenom}
                        </Link>}</td>
                        <td>{poste.titrePoste.intitule}</td>
                        <td>{poste.typeContrat.type}</td>
                        <td>{poste.domaine.titre}</td>
                        <td>{poste.manager !== null ? (
                                  <Link id={poste.manager.id} to={"/salaries/profil/" + poste.manager.id}>{poste.manager.prenom +
                                    " " + poste.manager.nom}
                                  </Link>
                                ):("Aucun(e)")}</td>
                        <td>{poste.salarie.entreprise.nom}</td>
                        <td>{poste.maitreApprentissage !== null ? (
                                  <Link id={poste.maitreApprentissage.id} to={"/salaries/profil/" + poste.maitreApprentissage.id}>{poste.maitreApprentissage.prenom +
                                    " " + poste.maitreApprentissage.nom}
                                  </Link>
                                ):("Aucun(e)")}</td>
                        <td>{poste.dateDebut + (poste.dateFin !== null ? " - " + poste.dateFin : "")}</td>
                        <td><Link to={{ pathname: "/salaries/profil/" + poste.salarie.id + "/poste/detail", state: poste }}><CButton type="button" color="info" className="mb-2">Détail du poste</CButton></Link></td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            {pageCount > 1 ?
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
              : null}
          </div>
        </div>
      </>
    );

  }
}

export default ListPoste;