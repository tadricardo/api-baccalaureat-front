import { CButton, CSelect, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import QuestionService from "../../services/question.service";
import ReactPaginate from "react-paginate";
import { faEdit, faSync, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import swal from "sweetalert";

class ListQuestion extends Component {
  
  constructor(props) {
    super(props);
    this.retrieveQuestion = this.retrieveQuestion.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.searchType = this.searchType.bind(this);
    this.ifdelete = this.ifdelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.refresh = this.refresh.bind(this);
    this.state = {
      questions: [],
      itemsPerPage: 5,
      currentPage: 0,
      pageCount: 0,
      order: "ASC",
      sortBy: "id",
      searchExpression: "",
      loading: false,
    };
  }

  componentDidMount() {
    this.retrieveQuestion();
  }

  refresh(){
    this.retrieveQuestion();
  }

  retrieveQuestion() {
    QuestionService.count(this.state.searchExpression)
      .then((resp) => {
        let nbPage = Math.ceil(resp.data / this.state.itemsPerPage);
        this.setState({ pageCount: nbPage });
      })
      .catch((e) => {
        console.log(e);
      });
    QuestionService.getAllByPageAndKeyword(
      this.state.currentPage,
      this.state.itemsPerPage,
      this.state.searchExpression,
      this.state.order,
      this.state.sortBy,

    )
      .then((response) => {
        this.setState({
          questions: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  handlePageClick = (data) => {
    let selected = data.selected;
    this.setState({ currentPage: selected }, () => {
      this.retrieveQuestion();
    });
  };

  searchType(e) {
    e.preventDefault();
    this.setState({ currentPage: 0 }, () => {
      this.retrieveQuestion();
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
      this.setState({ itemsPerPage: value, currentPage: 0 }, () => { this.retrieveQuestion(); })
    }
  }

  ifdelete(question) {
    const {currentPage} = this.state;
    swal({
      title: "Êtes-vous sûrs ?",
      text: "Vous voulez supprimer cette question ?", // TODO: Faire une liste des questionnaires qui utilise cette question
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        QuestionService.deleteQuestionById(question.id)
          .then((resp) => {
            swal("Suppression bien prise en compte !", {
              icon: "success",
            });
            this.setState({
              currentPage: currentPage !== 0  ? currentPage - 1 : currentPage
            });
            this.retrieveQuestion();
          })
          .catch((e) => {
            swal("Cette question est utilisée.", {
              icon: "error",
            });
          });
      }
    });
  }

  render() {
    const { questions, loading } = this.state;
    return (
      <>
        <div className="row justify-content-between mt-4">
          <form name="searchEmployee" onSubmit={this.searchType} className="col-md-8">
            <div className="input-group mb-2">
              <input type="text" id="search-expression"
                name="searchExpression" placeholder="Saisir votre recherche.." onChange={this.handleChange} className="form-control" disabled={loading} />
              <span className="input-group-prepend">
                <CButton type="submit" block color="info" disabled={loading}>
                  {loading && <CSpinner size="sm" variant="border" />} Recherche
                </CButton>
              </span>
            </div>
          </form>

          <form name="nbPageForm" className="col-md-2 p-0">
            <CSelect
              custom
              className="ml-5"
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
          <div  className="col-md-1 p-0">
          <CButton className="ml-3" color="success" onClick={this.refresh} title="Vous voulez ré-actualiser le tableau ?">
              <FontAwesomeIcon icon={faSync} />
          </CButton>
          </div>
          
        </div>
        <div className="row mt-4">
          <div className="col-lg-12 table-responsive">
            <table className="table table-hover table-striped table-bordered">
              <thead>
                <tr>
                  <th>Intitulé de la question</th>
                  <th>Choix de réponse</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<tr><td colSpan="6" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                  questions.length !== 0 ?
                    questions.map((question) => (
                      <tr key={question.id}>
                        <td>{question.intitule}</td>
                        <td> {/*Object.keys(question.choix).length*/}
                          {
                            Object.keys(question.choix).length > 0 ?
                              <ul>
                                {
                                  Object.keys(question.choix).map((item, i) => (
                                    <li key={i}>
                                      {question.choix[item]}
                                    </li>
                                  ))
                                }
                              </ul>
                              : ""
                          }
                        </td>
                        <td>
                          <Link to={"/question/modification/" + question.id}>
                            <CButton className="mr-2" color="info" title="Vous voulez modifier le nom de cette question ?">
                              <FontAwesomeIcon icon={faEdit} /> Modifier
                            </CButton>
                          </Link>
                          <CButton
                            color="danger"
                            onClick={() => this.ifdelete(question)}
                            title="Vous voulez supprimer cette ligne ?"
                          >
                            <FontAwesomeIcon icon={faTrash} /> Supprimer
                          </CButton>
                        </td>
                      </tr>
                    )) : (<tr><td colSpan="2" className="text-center font-weight-bold">Aucune question</td></tr>))}
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

export default ListQuestion;
