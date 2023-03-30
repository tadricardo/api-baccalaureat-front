import React, { Component } from "react";
import EntretienService from "../../services/entretien.service";
import salariesService from "src/services/salaries.service";
import moment from 'moment';
import momentFR from 'moment/locale/fr';
import { Link } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import { connect } from "react-redux";
import { CButton } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLockOpen } from "@fortawesome/free-solid-svg-icons";
import compteRenduService from "src/services/compte-rendu.service";
import { compareDateCurrentLessOneDay } from "src/utils/fonctions";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import { AsyncPaginate } from "react-select-async-paginate";

class ListEntretien extends Component {
  constructor(props) {
    super(props);
    this.retrieveEntretien = this.retrieveEntretien.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeLastDate = this.onChangeLastDate.bind(this);
    this.loadSalarie = this.loadSalarie.bind(this);
    this.onChangeInputSalarie = this.onChangeInputSalarie.bind(this);
    this.onChangeSalarie = this.onChangeSalarie.bind(this);
    this.state = {
      nomSalarie: "",
      entretiens: [],
      salaries: {},
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

  retrieveEntretien() {
    EntretienService.countEntretiensManager(this.state.salaries.id, this.props.idUser, this.state.startDate, this.state.endDate).then((resp) => {
      let nbPage = Math.ceil(resp.data / this.state.itemsPerPage)
      this.setState({ pageCount: nbPage })
    }).catch((e) => { console.log(e) });
    EntretienService.getAllEntretiensManagerByPage(this.state.currentPage, this.state.itemsPerPage, this.state.salaries.id, this.props.idUser, this.state.startDate, this.state.endDate)
      .then(response => {
        this.setState({
          entretiens: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  findStatut(cr) {
    switch (cr.statut) {
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

  openQuest(cr) {
    //TODO: Récuperer le compte rendu 
    if (cr.questionnaire !== null) {
      compteRenduService.changeStatut("QUESTION_OUVERTE", cr.id).then(() => { this.retrieveEntretien(); }).catch(e => { console.log(e) })
    } else {
      compteRenduService.changeStatut("QUESTION_FERME_COMMENTAIRE_OUVERT", cr.id).then(() => { this.retrieveEntretien(); }).catch(e => { console.log(e) })
    }

  }

  onChangeStartDate(e) {
    this.setState({ startDate: new Date(e) }, () => { this.retrieveEntretien() })
  }

  onChangeLastDate(e) {
    this.setState({ endDate: new Date(e) }, () => { this.retrieveEntretien() })
  }

  onChangeSalarie(e) {
    this.setState({ salaries: e });
  }



  

  onChangeInputSalarie(e) {
    this.setState({ nomSalarie: e }, () => { this.retrieveEntretien() })
  }

  async loadSalarie(search, prevOptions, { page }, e) {
    const response = await salariesService.getAllSalarieByIdManagerAndLastnamePerPage(page, 10, this.props.idUser);
    const responseJSON = await response.data;
    return {
      options: responseJSON,
      hasMore: responseJSON.length >= 1,
      additional: {
        page: search ? 2 : page + 1,
      }
    };
  };


  render() {
    const { entretiens, salaries, loading, startDate, endDate } = this.state;
    return (
      <>
        <div className="form-row justify-content-between mt-4">
          <label className="font-weight-bold col-md-1  mt-2" htmlFor="salarie">Salarie :</label>
          <div className="col-md-11">
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
                  <th>Date/heure</th>
                  <th>Salarie  (Prenom-Nom)</th>
                  <th>Type d'entretien</th>
                  <th>Status</th>
                  <th>Compte rendu</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {entretiens.length > 0 ? (
                  entretiens.map(entretien =>
                    <tr key={entretien.id}>
                      <td>{moment(entretien.dateEntretien).format("llll")}</td>
                      <td>{entretien.participants.map(participant => participant.fonction === 'SALARIE' ? `${participant.salarie.prenom} ${participant.salarie.nom}` : "")}</td>
                      <td>{entretien.typeEntretien.titre}</td>
                      <td>{this.findStatut(entretien.compteRendu)}</td>
                      <td>{entretien.compteRendu === null ? "Aucun" : (
                        <Link to={{ pathname: "/compterendu/read", state: entretien }}>
                          <FontAwesomeIcon icon={["fas", "search"]} /> Voir le compte-rendu
                        </Link>
                      )}</td>
                      <td>
                        {entretien.compteRendu.statut === "ATTENTE_ENTRETIEN" && (
                          <CButton type="button" block color="warning" className="mt-2" onClick={() => { this.openQuest(entretien.compteRendu) }}>
                            <FontAwesomeIcon icon={faLockOpen} /> Ouvrir le questionnaire
                          </CButton>
                        )}

                      </td>
                      <td>{compareDateCurrentLessOneDay(entretien.dateEntretien) && <Link to={`/entretiens/modification/${entretien.id}`}><CButton className="mr-2" color="info" title="Voir le compte rendu"><FontAwesomeIcon icon={["fas", "edit"]} /> Modifier</CButton></Link>}</td>
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

function mapStateToProps(state) {
  const { idUser } = state.authen;
  return {
    idUser
  };
}

export default connect(mapStateToProps)(ListEntretien);