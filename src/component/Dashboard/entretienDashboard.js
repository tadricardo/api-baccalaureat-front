import { CCardBody, CCardTitle, CSelect } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from 'moment';
import momentFR from 'moment/locale/fr';
import React, { Component } from 'react';
import ReactPaginate from "react-paginate";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import EntretienService from "../../services/entretien.service";

class EntretienDashboard extends Component {
    constructor(props) {
        super(props);
        this.retrieveEntretien = this.retrieveEntretien.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            entretiens: [{
                id: null,
                compteRendu: {
                    id: null,
                    statut: null,
                },
                participants: [{
                    id: null,
                    salarie: {
                        id: null,
                        nom: null,
                        prenom: null,
                    },
                    fonction: null,
                }],
                typeEntretien: {
                    id: null,
                    titre: null
                },
                dateEntretien: null,
            }],
            user: this.props.user,
            userRole: this.props.userRole,
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            itemsPerPage: 5,
            currentPage: 0,
            pageCount: 0,
            searchExpression: "",
            loading: false,
        };
        moment.updateLocale("fr", momentFR);
    }

    componentDidMount() {
        this.retrieveEntretien();
    }
    retrieveEntretien() {
        EntretienService.count(null, null, this.state.startDate, this.state.endDate).then((resp) => {
            let nbPage = Math.ceil(resp.data / this.state.itemsPerPage)
            this.setState({ pageCount: nbPage })
        }).catch((e) => {
            if (e.name === "AbortError") {
                return "Request Aborted ";
            }
            return e;
        });
        EntretienService.getAllEntretiensByPage(this.state.currentPage, this.state.itemsPerPage, null, null, this.state.startDate, this.state.endDate)
            .then(response => {
                this.setState({
                    entretiens: response.data,
                    loading: false
                });
            })
            .catch(e => {
                if (e.name === "AbortError") {
                    return "Request Aborted ";
                }
                return e;;
            });
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        this.setState({ currentPage: selected }, () => {
            this.retrieveEntretien();
        });
    };

    handleChange(e) {
        const target = e.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        if (name === "nbPage") {
            this.setState({ loading: true, itemsPerPage: value, currentPage: 0 }, () => { this.retrieveEntretien(); })
        }
    }

    findStatus(statut) {
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

    render() {
        const { entretiens, loading } = this.state;
        return (
            <div>
                <CCardBody>
                    <CCardTitle>Les entretiens à venir</CCardTitle>
                    <CCardBody>
                        <div className="form-row justify-content-between mt-4">
                            <form name="nbPageForm" className="col-md-2 ">
                                <CSelect custom name="nbPage" id="nbPage" onChange={this.handleChange} disabled={loading}>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </CSelect>
                            </form>
                        </div>
                        <div className="row mt-4">
                            <div className="col-lg-12 table-responsive">
                                <table className="table table-hover table-striped table-bordered ">
                                    <thead>
                                        <tr>
                                            <th>Date / heure</th>
                                            <th>Type d'entretien</th>
                                            <th>Participants</th>
                                            <th>Status</th>
                                            <th>Compte rendu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entretiens.length > 0 ? (
                                            entretiens.map(entretien =>
                                                <tr key={entretien.id}>
                                                    <td>{moment(entretien.dateEntretien).format("llll")}</td>
                                                    <td>{entretien.typeEntretien.titre}</td>
                                                    <td>
                                                        <ul>
                                                            {entretien.participants.length > 0 && entretien.participants.map((participant, index) => <li key={index}>{participant.salarie.nom + " " + participant.salarie.prenom + " (" + participant.fonction + ")"}</li>)}
                                                        </ul>
                                                    </td>
                                                    <td>{this.findStatus(entretien.compteRendu.statut)}</td>
                                                    <td>{entretien.compteRendu === null ? "Aucun" : (
                                                        <Link to={{ pathname: "/compterendu/read", state: entretien }}>
                                                            <FontAwesomeIcon icon={["fas", "search"]} /> Voir le compte-rendu
                                                        </Link>
                                                    )}</td>
                                                </tr>
                                            )
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center font-weight-bold" >Aucun entretien</td>
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
                    </CCardBody>
                </CCardBody>
            </div>
        )
    }
}
export default withRouter(EntretienDashboard);