import React, { Component } from 'react'
import { CButton, CSelect, CSpinner } from "@coreui/react";
import { Link } from 'react-router-dom';
import FormationService from '../../services/formations.service';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import fr from "date-fns/locale/fr";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { compareDateCurrentLessOneDay } from 'src/utils/fonctions';
import swal from 'sweetalert';
registerLocale("fr", fr);

class ListFormation extends Component {

  constructor(props) {
    super(props);
    this.retrieveFormation = this.retrieveFormation.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeLastDate = this.onChangeLastDate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.searchFormation = this.searchFormation.bind(this);
    this.triPar = this.triPar.bind(this);
    this.ifdelete = this.ifdelete.bind(this);
    this.state = {
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      formations: [],
      itemsPerPage: 5,
      currentPage: 0,
      pageCount: 0,
      searchExpression: "",
      sortBy: "id",
      order: "DESC",
      loading: false
    }
  }

  componentDidMount() {
    this.retrieveFormation();
  }

  retrieveFormation() {
    FormationService.countFormation(this.state.searchExpression, this.state.startDate, this.state.endDate).then((resp) => {
      let nbPage = Math.ceil(resp.data / this.state.itemsPerPage)
      this.setState({ pageCount: nbPage })
    }).catch((e) => { console.log(e.message) });
    FormationService.getFormationPeriodByPage(this.state.currentPage, this.state.itemsPerPage, this.state.searchExpression, this.state.startDate, this.state.endDate, this.state.sortBy, this.state.order)
      .then(response => {
        this.setState({
          formations: response.data,
          loading: false
        })
      })
      .catch(e => {
        console.log(e.message);
      });
  }

  handlePageClick = (data) => {
    let selected = data.selected;
    this.setState({ currentPage: selected }, () => {
      this.retrieveFormation();
    });
  };

  searchFormation(e) {
    e.preventDefault();
    this.setState({ currentPage: 0 }, () => { this.retrieveFormation(); });
  }

  onChangeStartDate(e) {
    this.setState({ startDate: new Date(e) }, () => { this.retrieveFormation() })
  }

  onChangeLastDate(e) {
    this.setState({ endDate: new Date(e) }, () => { this.retrieveFormation() })
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "searchExpression") {
      this.setState({ searchExpression: value })
    }
    if (name === "nbPage") {
      this.setState({ loading: true, itemsPerPage: value, currentPage: 0 }, () => { this.retrieveFormation(); })
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
    this.retrieveFormation();
  }

  ifdelete(formation) {
    const {currentPage} = this.state;
    swal({
      title: "Êtes-vous sûrs ?",
      text: `Voulez-vous supprimer cette formation ?` ,
      icon: "warning",
      buttons: ["Non", "Oui"],
      dangerMode: true,
    }).then((willAccept) => {
      if (willAccept) {
        FormationService.countSalarieByFormation(formation.id).then(resp =>{
          if(resp.data > 0){
            swal({
              title: "Problème rencontré ?",
              text: `Des salariés sont inscrits à la formation "${formation.titre}", voulez-vous continuer ?`,
              icon: "warning",
              buttons: ["Non", "Oui"],
              dangerMode: true,
            }).then((willDelete) => {
              if(willDelete){
                FormationService.delete(formation.id)
                .then((resp) => {
                  swal("Suppression bien prise en compte !", {
                    icon: "success",
                  });
                  this.setState({
                    currentPage: currentPage !== 0  ? currentPage - 1 : currentPage
                  });
                  this.retrieveFormation();
                }).catch(e => console.log(e))
              }
            })
          }else{
            FormationService.delete(formation.id)
            .then((resp) => {
              swal("Suppression bien prise en compte !", {
                icon: "success",
              });
              this.setState({
                currentPage: currentPage !== 0  ? currentPage - 1 : currentPage
              });
              this.retrieveFormation();
            })
          }
        });
      }
    });
  }

  render() {
    const { formations, startDate, endDate, pageCount, loading } = this.state;
    return (
      <>
        <div className="form-row justify-content-between mt-4">
          <form name="searchEmployee" onSubmit={this.searchFormation} className="col-md-8">
            <div className="input-group mb-2">
              <input type="text" id="search-expression"
                name="searchExpression" placeholder="Saisir votre recherche.." onChange={this.handleChange} disabled={loading} className="form-control" />
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
              disabled={loading}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </CSelect>
          </form>
        </div>
        <div className="form-row">
          <div className="mt-2">
            <p className="font-weight-bold">Trier par date </p>
          </div>
          <div className="col-md-2">
            <DatePicker
              disabled={loading}
              className="form-control"
              name="startDate"
              dateFormat="dd/MM/yyyy"
              selected={startDate}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              onChange={this.onChangeStartDate}
              showYearDropdown
              dateFormatCalendar="MMMM"
              yearDropdownItemNumber={5}
              scrollableYearDropdown
              todayButton="Aujourd'hui"
              placeholderText="Sélectionner une date"
              locale="fr"

            />
          </div>
          <div className="col-md-2">
            <DatePicker
              disabled={loading}
              className="form-control"
              name="lastDate"
              dateFormat="dd/MM/yyyy"
              selected={endDate}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              onChange={this.onChangeLastDate}
              showYearDropdown
              dateFormatCalendar="MMMM"
              yearDropdownItemNumber={5}
              scrollableYearDropdown
              todayButton="Aujourd'hui"
              placeholderText="Date de fin"
              locale="fr"
            />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-lg-12 table-responsive">
            <table className="table table-hover table-striped table-bordered">
              <thead className="cursor-pointer" title="Cliquer pour trier.">
                <tr>
                  <th onClick={() => this.triPar("titre")}>Titre</th>
                  <th onClick={() => this.triPar("dateDebut")}>Date de début</th>
                  <th onClick={() => this.triPar("dateFin")}>Date de fin</th>
                  <th onClick={() => this.triPar("duree")}>Durée<span><small><i>(en heure)</i></small></span></th>
                  <th onClick={() => this.triPar("prix")}>Prix<span><small><i>(HT)</i></small></span></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<tr><td colSpan="6" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                  formations.length !== 0 ? (
                    formations.map(formation =>
                      <tr key={formation.id}>
                        <td>{formation.titre}</td>
                        <td>{moment(formation.dateDebut).format('DD/MM/YYYY')}</td>
                        <td>{moment(formation.dateFin).format('DD/MM/YYYY')}</td>
                        <td>{formation.duree}</td>
                        <td>{formation.prix} €</td>
                        <td>
                          <Link to={"/formations/voir/" + formation.id}>
                            <CButton className="mr-2" color="info" title="Vous voulez voir cette formation ?">
                              <FontAwesomeIcon icon={faEye} /> Voir
                            </CButton>
                          </Link>
                          {/* {compareDateCurrentLessOneDay(formation.dateDebut) &&} */}
                            <Link to={"/formations/modification/" + formation.id}>
                              <CButton className="mr-2" color="info" title="Vous voulez Modifier cette formation ?"><FontAwesomeIcon icon={faEdit} /> Modifier</CButton>
                            </Link>
                            {/* {compareDateCurrentLessOneDay(formation.dateDebut) &&} */}
                          <CButton color="danger" onClick={() => this.ifdelete(formation)} title="Vous voulez supprimer cette formation ?">
                            <FontAwesomeIcon icon={faTrash} /> Supprimer
                          </CButton>
                        </td>
                      </tr>
                    )) : (<tr><td colSpan="7" className="text-center font-weight-bold">Aucune formation</td></tr>))}
              </tbody>
            </table>
            {pageCount > 1 ?
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
              />
              : null}
          </div>
        </div>
      </>
    )
  }
}

export default ListFormation
