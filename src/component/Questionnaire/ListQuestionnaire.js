import { CButton, CSelect, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import QuestionnaireService from "../../services/questionnaire.service";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
import questionnaireService from "../../services/questionnaire.service";

class ListQuestionnaire extends Component {
  order = "ASC";
  col = "";
  constructor(props) {
    super(props);
    this.retrieveQuestionnaire = this.retrieveQuestionnaire.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.searchType = this.searchType.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      questionnaires: [],
      itemsPerPage: 5,
      currentPage: 0,
      pageCount: 0,
      order: "",
      searchExpression: "",
      loading: false,
    };
  }

  componentDidMount() {
    this.retrieveQuestionnaire();
  }

  retrieveQuestionnaire() {
    QuestionnaireService.count(this.state.searchExpression)
      .then((resp) => {
        let nbPage = Math.ceil(resp.data / this.state.itemsPerPage);
        this.setState({ pageCount: nbPage });
      })
      .catch((e) => {
        console.log(e);
      });
    QuestionnaireService.getAllByPageAndKeyword(
      this.state.currentPage,
      this.state.itemsPerPage,
      this.state.searchExpression,
      this.state.order
    )
      .then((response) => {
        this.setState({
          questionnaires: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  handlePageClick = (data) => {
    let selected = data.selected;
    this.setState({ currentPage: selected }, () => {
      this.retrieveQuestionnaire();
    });
  };

  searchType(e) {
    e.preventDefault();
    this.setState({ currentPage: 0 }, () => {
      this.retrieveQuestionnaire();
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
      this.setState({ itemsPerPage: value, currentPage: 0 }, () => { this.retrieveQuestionnaire(); })
    }
  }

  ifdelete(questionnaire) {
    const {currentPage} = this.state;
    swal({
      title: "Êtes-vous sûrs ?",
      text: "Vous voulez supprimer ce questionnaire ?", // TODO: Pourquoi il est utilisé
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        QuestionnaireService.deleteById(questionnaire.id)
          .then((resp) => {
            swal("Suppression bien prise en compte !", {
              icon: "success",
            });
            this.setState({
              currentPage: currentPage !== 0  ? currentPage - 1 : currentPage
            });
            this.retrieveQuestionnaire();
          })
          .catch((e) => {
            swal("Ce questionnaire est utilisée.", {
              icon: "error",
            });
          });
      }
    });
  }

  sort(column){
    this.order = this.order === "ASC" && column === this.col ? "DESC" : "ASC";
    this.col = column;
    questionnaireService.getAllQuestionnaireByPage(this.state.currentPage, this.state.itemsPerPage, this.order, this.col)
      .then((res) => {
        this.setState({
          questionnaires: res.data,
        })
      });
  }

  render() {
    const { questionnaires, loading } = this.state;
    return (
      <>
        <div className="row justify-content-between mt-4">
          <form name="searchEmployee" onSubmit={this.searchType} className="col-md-8">
            <div className="input-group mb-2">
              <input type="text" id="search-expression"
                name="searchExpression" placeholder="Saisir votre recherche.." onChange={this.handleChange} className="form-control" disabled={loading} />
              <span className="input-group-prepend">
                <CButton type="submit" block color="info" disabled={loading}>
                  {loading && <CSpinner size="sm" variant="border" />}  Recherche
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
                  <th onClick={() => this.sort("titre")}>Nom du questionnaire</th>
                  <th onClick={() => this.sort("typeEntretien.titre")}>Type d'entretien</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<tr><td colSpan="6" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                  questionnaires.length !== 0 ?
                    questionnaires.map((questionnaire) => (
                      <tr key={questionnaire.id}>
                        <td>{questionnaire.titre}</td>
                        <td>{questionnaire.typeEntretien.titre}</td>
                        <td>
                          <Link to={"/questionnaire/modification/" + questionnaire.id}>
                            <CButton className="mr-2" color="info" title="Vous voulez modifier le nom de ce questionnaire ?">
                              <FontAwesomeIcon icon={faEdit} /> Modifier
                            </CButton>
                          </Link>
                          <CButton
                            color="danger"
                            onClick={() => this.ifdelete(questionnaire)}
                            title="Vous voulez supprimer cette ligne ?"
                          >
                            <FontAwesomeIcon icon={faTrash} /> Supprimer
                          </CButton>
                        </td>
                      </tr>
                    )) : (<tr><td colSpan="2" className="text-center font-weight-bold">Aucun questionnaire</td></tr>))}
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

export default ListQuestionnaire;
