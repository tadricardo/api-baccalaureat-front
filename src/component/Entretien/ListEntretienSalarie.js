import React, { Component } from "react";
import EntretienService from "../../services/entretien.service";
import moment from 'moment';
import momentFR from 'moment/locale/fr';
import { Link } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css'


class ListEntretien extends Component {
  constructor(props) {
    super(props);
    this.retrieveEntretien = this.retrieveEntretien.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeLastDate = this.onChangeLastDate.bind(this);
    this.state = {
      nomSalarie: "",
      nomManager: "",
      entretiens: [{
        id: null,
        dateEntretien: null,
        compteRendu: {
          id: null,
          compteRendu: null,
          dateCreation: null,
          signatureManager: false,
          dateSigntureManager: null,
          signatureSalarie: false,
          dateSigntureSalarie: null,
          reponses: [],
          questionnaire: {
            id: null,
            titre: null,
            typeEntretien: {
              id: null,
              titre: null,
              version: null,
            },
            questions: [
              {
                id: null,
                intitule: null,
                choix: {},
                version: null,
              },
            ],
            version: null,
          },
          version: null,
        },
        participants: [{
          id: null,
          salarie: {
            id: null,
            nom: null,
            prenom: null,
            email: null,
            domaine: {},
            roles: [],
            entreprise: {
              id: null,
              nom: null,
              adresse: {},
              version: null,
            },
            version: null,
          },
          fonction: null,
          dateSignature: null,
          signature: null,
          signatureObligatoire: null,
          dateNotificationParticipant: null,
          notificationParticipant: null,
          version: null,
        }],
        dateNotificationManager: null,
        notificationManager: false,
        dateNotificationSalarie: null,
        notificationSalarie: false,
        typeEntretien: {
          id: null,
          titre: null,
          version: null,
        },
        version: null,
      }],
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

  retrieveEntretien() {
    EntretienService.count(this.props.idUser, undefined, this.state.startDate, this.state.endDate).then((resp) => {
      let nbPage = Math.ceil(resp.data / this.state.itemsPerPage)
      this.setState({ pageCount: nbPage })
    }).catch((e) => { console.log(e) });
    EntretienService.getAllEntretiensByPage(this.state.currentPage, this.state.itemsPerPage, this.props.idUser, undefined, this.state.startDate, this.state.endDate)
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

  render() {
    const { entretiens, loading, startDate, endDate } = this.state;
    return (
      <>
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
                  <th>Manager  (Prenom-Nom)</th>
                  <th>Type d'entretien</th>
                  <th>Status</th>
                  <th>Compte rendu</th>
                </tr>
              </thead>
              {entretiens.length > 0 ? (
                <tbody>
                  {entretiens.map(entretien =>
                    <tr key={entretien.id}>
                      <td>{moment(entretien.dateEntretien).format("llll")}</td>
                      <td>
                        {entretien.participants && entretien.participants.map(participant => participant.fonction === 'MANAGER' ? `${participant.salarie.prenom} ${participant.salarie.nom}` : "")}
                      </td>
                      <td>{entretien.typeEntretien.titre}</td>
                      <td>{this.findStatut(entretien.compteRendu.statut)}</td>
                      <td>{entretien.compteRendu === null ? "Aucun" : (
                        <Link to={{ pathname: "/compterendu/read", state: entretien }}>
                          <FontAwesomeIcon icon={["fas", "search"]} /> Voir le compte-rendu
                        </Link>
                      )}</td>
                    </tr>
                  )}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="6" className="text-center font-weight-bold" >Aucun entretien</td>
                  </tr>
                </tbody>
              )}
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
  const { isRole, idUser } = state.authen;
  return {
    isRole,
    idUser
  };
}

export default connect(mapStateToProps)(ListEntretien);