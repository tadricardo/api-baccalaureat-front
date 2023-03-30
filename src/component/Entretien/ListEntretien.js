import React, { Component } from "react";
import EntretienService from "../../services/entretien.service";
import salariesService from "src/services/salaries.service";
import moment from 'moment';
import momentFR from 'moment/locale/fr';
import { Link } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import { AsyncPaginate } from "react-select-async-paginate";
import { CButton } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { compareDateCurrentLessOneDay } from "src/utils/fonctions";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
class ListEntretien extends Component {
  constructor(props) {
    super(props);
    this.retrieveEntretien = this.retrieveEntretien.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.loadSalarie = this.loadSalarie.bind(this);
    this.loadSalarieManager = this.loadSalarieManager.bind(this);
    this.onChangeInputSalarie = this.onChangeInputSalarie.bind(this);
    this.onChangeInputSalarieManager = this.onChangeInputSalarieManager.bind(this);
    this.onChangeSalarie = this.onChangeSalarie.bind(this);
    this.onChangeManagerEntretien = this.onChangeManagerEntretien.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeLastDate = this.onChangeLastDate.bind(this);
    this.state = {
      nomSalarie: "",
      nomManager: "",
      entretiens: [],
      salaries: {},
      managers: {},
      itemsPerPage: 5,
      currentPage: 0,
      pageCount: 0,
      searchExpression: "",
      loading: false,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    };
    moment.updateLocale("fr", momentFR);
  }

  componentDidMount() {
    this.retrieveEntretien();
  }
  onChangeSalarie(e) {
    this.setState({ salaries: e });
  }

  onChangeManagerEntretien(e) {
    this.setState({ managers: e });
  }

  retrieveEntretien() {
    EntretienService.count(this.state.salaries === null ? undefined : this.state.salaries.id, this.state.managers === null ? undefined : this.state.managers.id, this.state.startDate, this.state.endDate).then((resp) => {
      let nbPage = Math.ceil(resp.data / this.state.itemsPerPage)
      this.setState({ pageCount: nbPage })
    }).catch((e) => { console.log(e) });
    EntretienService.getAllEntretiensByPage(this.state.currentPage, this.state.itemsPerPage, this.state.salaries === null ? undefined : this.state.salaries.id, this.state.managers === null ? undefined : this.state.managers.id, this.state.startDate, this.state.endDate)
      .then(response => {
        this.setState({
          entretiens: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  handlePageClick = (data) => {
    let selected = data.selected;
    this.setState({ currentPage: selected }, () => {
      this.retrieveEntretien();
    });
  };

  onChangeInputSalarie(e) {
    this.setState({ nomSalarie: e }, () => { this.retrieveEntretien() })
  }

  onChangeInputSalarieManager(e) {
    this.setState({ nomManager: e }, () => { this.retrieveEntretien() })
  }

  async loadSalarie(search, prevOptions, { page }, e) {
    const response = await salariesService.getAllSalariesByKeywordPerPage(page, 10, this.state.nomSalarie);
    const responseJSON = await response.data;
    return {
      options: responseJSON,
      hasMore: responseJSON.length >= 1,
      additional: {
        page: search ? 2 : page + 1,
      }
    };
  };

  async loadSalarieManager(search, prevOptions, { page }, e) {
    const response = await salariesService.getAllSalariesByKeywordPerPage(page, 10, this.state.nomManager);
    const responseJSON = await response.data;
    return {
      options: responseJSON,
      hasMore: responseJSON.length >= 1,
      additional: {
        page: search ? 2 : page + 1,
      }
    };
  };

  findStatut(statut) {
    switch (statut) {
      case "ATTENTE_ENTRETIEN":
        return "En attente de l'entretien";
      case "QUESTION_OUVERTE":
        return "Ouvert";
      case "QUESTION_FERME_COMMENTAIRE_OUVERT":
        return "Questionnaire répondu / Commentaire ouvert";
      case "COMMENTAIRE_FERME_SIGNATURE_OUVERTE":
        return "Commentaire ferme / Signature ouvert";
      case "FERME":
        return "Ferme";
      default:
        return "En attente de l'entretien";
    }
  }

  onChangeStartDate(e) {
    this.setState({ startDate: new Date(e) }, () => { this.retrieveEntretien() })
  }

  onChangeLastDate(e) {
    this.setState({ endDate: new Date(e) }, () => { this.retrieveEntretien() })
  }

  ifdelete(entretien) {
    const { currentPage } = this.state;
    swal({
      title: "Êtes-vous sûrs ?",
      text: "Voulez-vous supprimer cet entretien ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        EntretienService.delete(entretien.id)
          .then((resp) => {
            swal("Suppression bien prise en compte !", {
              icon: "success",
            });
            this.setState({
              currentPage: currentPage !== 0 ? currentPage - 1 : currentPage
            });
            this.retrieveEntretien();
          })
          .catch((e) => {
            this.setState({
              message: e.message,
            });
          });
      }
    });
  }

  render() {
    const { entretiens, salaries, managers, loading, startDate, endDate } = this.state;
    return (
      <>
        <div className="form-row justify-content-between mt-4">
          <div className="col-md-6">
            <label className="font-weight-bold" htmlFor="salarie">Salarie :</label>
            <AsyncPaginate
              name="salarie"
              value={salaries !== null ? Object.entries(salaries).length === 0 ? null : salaries : null}
              loadOptions={this.loadSalarie}
              isClearable
              getOptionValue={(option) => option.id}
              getOptionLabel={(option) => `${option.prenom} ${option.nom}`}
              onChange={this.onChangeSalarie}
              isSearchable={true}
              onInputChange={this.onChangeInputSalarie}
              placeholder="Selectionner un salarie"
              additional={{
                page: 0,
              }}
            />
          </div>
          <div className="col-md-6 ">
            <label className="font-weight-bold" htmlFor="manager">Manager :</label>
            <AsyncPaginate
              name="manager"
              isClearable
              value={managers !== null ? Object.entries(managers).length === 0 ? null : managers : null}
              loadOptions={this.loadSalarieManager}
              getOptionValue={(option) => option.id}
              getOptionLabel={(option) => `${option.prenom} ${option.nom}`}
              onChange={this.onChangeManagerEntretien}
              isSearchable={true}
              onInputChange={this.onChangeInputSalarieManager}
              placeholder="Selectionner un manager"
              additional={{
                page: 0,
              }}
            />
          </div>
        </div>
        <div className="form-row mt-3">
          <label className="font-weight-bold col-md-1 mt-2"> Trier par date : </label>
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
        <div className="row mt-4">
          <div className="col-lg-12 table-responsive">
            <table className="table table-hover table-striped table-bordered ">
              <thead>
                <tr>
                  <th>Date / heure</th>
                  <th>Salarie (Prenom-Nom)</th>
                  <th>Manager  (Prenom-Nom)</th>
                  <th>Type d'entretien</th>
                  <th>Status</th>
                  <th>Compte rendu</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {entretiens.length > 0 ? (
                  entretiens.map(entretien =>
                    <tr key={entretien.id}>
                      <td>{moment(entretien.dateEntretien).format("llll")}</td>
                      <td>
                        {entretien.participants.map(participant => participant.fonction === 'SALARIE' ? `${participant.salarie.prenom} ${participant.salarie.nom}` : "")}
                      </td>
                      <td>
                        {entretien.participants.map(participant => participant.fonction === 'MANAGER' ? `${participant.salarie.prenom} ${participant.salarie.nom}` : "")}
                      </td>
                      <td>{entretien.typeEntretien.titre}</td>
                      <td>{this.findStatut(entretien.compteRendu.statut)}</td>
                      <td>{entretien.compteRendu === null ? "Aucun" : (
                        <Link to={{ pathname: "/compterendu/read", state: entretien }}>
                          <FontAwesomeIcon icon={faSearch} /> Voir le compte-rendu
                        </Link>
                      )}</td>
                      <td>{entretien.compteRendu.statut === "ATTENTE_ENTRETIEN" && (compareDateCurrentLessOneDay(entretien.dateEntretien) && <Link to={`/entretiens/modification/${entretien.id}`}><CButton className="mr-2" color="info" title="Voir le compte rendu"><FontAwesomeIcon icon={["fas", "edit"]} /> Modifier</CButton></Link>)}
                        {entretien.compteRendu.statut === "ATTENTE_ENTRETIEN" &&
                          <CButton color="danger" onClick={() => this.ifdelete(entretien)} title="Vous voulez supprimer cette ligne ?">
                            <FontAwesomeIcon icon={faTrash} /> Supprimer
                          </CButton>
                        }</td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center font-weight-bold" >Aucun entretien</td>
                  </tr>
                )}
              </tbody>
            </table>
            {this.state.pageCount > 1 && (<ReactPaginate
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

export default ListEntretien;