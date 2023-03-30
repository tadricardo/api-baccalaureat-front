import React, { Component } from 'react'
import { registerLocale } from 'react-datepicker';
import fr from "date-fns/locale/fr";
import FormationService from "../../services/formations.service";
import SalarieService from "../../services/salaries.service";
import jwt_decode from 'jwt-decode';
import { CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CNav, CNavItem, CNavLink, CRow, CSelect, CSpinner, CTabContent, CTabPane, CTabs } from '@coreui/react';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import swal from 'sweetalert';
registerLocale("fr", fr);

class RequestFormation extends Component {

    constructor(props) {
        super(props);
        this.retrieveFormation = this.retrieveFormation.bind(this);
        this.retrieveSalarie = this.retrieveSalarie.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.retrieveRequestFormationSalarie = this.retrieveRequestFormationSalarie.bind(this);
        this.searchFormation = this.searchFormation.bind(this);
        this.triPar = this.triPar.bind(this);
        this.requestFormation = this.requestFormation.bind(this);
        this.state = {
            requestFormationSalarie: [{
                id: null,
                formation: {
                    id: null,
                },
                salarie: {
                    id: null,
                },
                salarieValidateur: {
                    id: null,
                    nom: null,
                    prenom: null,
                },
                statut: null
            }],
            offsetTraining: 0,
            perPageTraining: 5,
            pageCountTraining: 0,
            displayTraining: [{
                dateDebut: null,
                dateFin: null,
                domaine: {
                    id: 0,
                    titre: null
                },
                duree: 0,
                prix: 0,
                titre: null,
                competences: [{
                    id: 0,
                    nom: null
                }]
            }],
            formations: [{
                dateDebut: null,
                dateFin: null,
                domaine: {
                    id: 0,
                    titre: null
                },
                duree: 0,
                prix: 0,
                titre: null,
                competences: [{
                    id: 0,
                    nom: null
                }]
            }],
            user: {
                id: null,
                formations: [{
                    id: null,
                }],
            },
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            itemsPerPage: 5,
            currentPage: 0,
            pageCount: 0,
            searchExpression: "",
            sortBy: "id",
            order: "DESC",
            loading: false,
        }
    }
    componentDidMount() {
        const token = JSON.parse(localStorage.getItem('token'));
        this.retrieveFormation();
        this.retrieveSalarie(jwt_decode(token).id);
        this.retrieveRequestFormationSalarie(jwt_decode(token).id);
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

    retrieveSalarie(id) {
        SalarieService.getSalarieById(id)
            .then(response => {
                this.setState({
                    user: response.data,
                });
                const displayTraining = this.getPaginatedItems(this.state.user.formations, 2);
                this.setState({
                    displayTraining,
                });
            })
            .catch(e => {
                console.log("erreur salarie : ", e);
            });
    }

    retrieveRequestFormationSalarie(id) {
        FormationService.getDemandeFormationBySalarie(id)
            .then(response => {
                this.setState({
                    requestFormationSalarie: response.data,
                })
            })
            .catch(e => {
                console.log("erreur request formation : ", e);
            });
    }

    searchFormation(e) {
        e.preventDefault();
        this.setState({ currentPage: 0 }, () => { this.retrieveFormation(); });
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

    getPaginatedItems(items, type) {
        switch (type) {
            case 1:
                return items.slice(this.state.offsetSkill, this.state.offsetSkill + this.state.perPageSkill);
            case 2:
                return items.slice(this.state.offsetTraining, this.state.offsetTraining + this.state.perPageTraining);
            case 3:
                return items.slice(this.state.offsetPoste, this.state.offsetPoste + this.state.perPagePoste);
            default:
                return false;
        }
    }

    handlePageClickTraining(data) {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPageTraining);
        this.setState({ offsetTraining: offset }, () => {
            const displayTraining = this.getPaginatedItems(this.state.currentSalarie.formations, 2);
            this.setState({
                displayTraining,
            });
        });
    }

    requestFormation(formation, isSupp) {
        swal({
            title: "Êtes-vous sûrs ?",
            text: isSupp ? "Voulez-vous supprimer la demande de formation : " + formation.titre + " ?" : "Voulez-vous demander la formation : " + formation.titre + " ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                if (isSupp) {
                    FormationService.deleteDemandeFormation(formation.id, this.state.user.id)
                        .then(resp => {
                            swal("Validé !",
                                "Demande de la formation " + formation.titre + " supprimé.",
                                "success");
                            this.retrieveRequestFormationSalarie(this.state.user.id);
                        }).catch(e => {
                            swal("Erreur !",
                                "Erreur lors de la suppression : " + e.message,
                                "error");
                        })
                } else {
                    FormationService.saveDemandeFormation(formation.id, this.state.user.id)
                        .then(resp => {
                            swal("Validé !",
                                "Demande de la formation " + formation.titre + " faite.",
                                "success");
                            this.retrieveRequestFormationSalarie(this.state.user.id);
                        }).catch(e => {
                            swal("Erreur !",
                                "Erreur lors de la demande : " + e.message,
                                "error");
                        })
                }
            }
        });
    }

    render() {
        const { user, formations, loading, pageCount, requestFormationSalarie, displayTraining } = this.state;
        return (
            <>
                <CRow>
                    <CCol xs="12" md="12" className="mb-4">
                        <CCard>
                            <CCardHeader>
                                <h4> Demande de formation </h4>
                            </CCardHeader>
                            <CCardBody>
                                <CTabs>
                                    <CNav variant="tabs">
                                        <CNavItem>
                                            <CNavLink>
                                                Demander des formations
                                            </CNavLink>
                                        </CNavItem>
                                        <CNavItem>
                                            <CNavLink>
                                                Formation du salarié
                                            </CNavLink>
                                        </CNavItem>
                                    </CNav>
                                    <CTabContent>
                                        <CTabPane>
                                            <div className="form-row justify-content-between mt-4">
                                                <form name="searchEmployee" onSubmit={this.searchFormation} className="col-md-8">
                                                    <div className="input-group mb-2">
                                                        <input type="text" id="search-expression"
                                                            name="searchExpression" placeholder="Saisir votre recherche..." onChange={this.handleChange} disabled={loading} className="form-control" />
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
                                            <div className="row mt-2">
                                                <div className="col-lg-12 table-responsive">
                                                    <table className="table table-hover table-striped table-bordered">
                                                        <thead className="cursor-pointer" title="Cliquer pour trier.">
                                                            <tr>
                                                                <th onClick={() => this.triPar("titre")}>Titre</th>
                                                                <th onClick={() => this.triPar("domaine")}>Service</th>
                                                                <th onClick={() => this.triPar("dateDebut")}>Date de début</th>
                                                                <th onClick={() => this.triPar("dateFin")}>Date de fin</th>
                                                                <th onClick={() => this.triPar("duree")}>Durée <span><small><i>(en heure)</i></small></span></th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {loading ? (<tr><td colSpan="6" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                                                                formations.length !== 0 ? (
                                                                    formations.map((formation,index) =>
                                                                        <tr key={index}>
                                                                            <td>{formation.titre + " - " + formation.id}</td>
                                                                            <td>{formation.domaine.titre}</td>
                                                                            <td>{moment(formation.dateDebut).format('DD/MM/YYYY')}</td>
                                                                            <td>{moment(formation.dateFin).format('DD/MM/YYYY')}</td>
                                                                            <td>{formation.duree}</td>
                                                                            <td>
                                                                                {requestFormationSalarie.length > 0 ? (
                                                                                    requestFormationSalarie.filter(request => request.formation.id === formation.id).length > 0 ? (
                                                                                        requestFormationSalarie.find(request => request.formation.id === formation.id).statut === "EN_ATTENTE" ? (
                                                                                            <CButton
                                                                                                className="mr-2"
                                                                                                color="warning"
                                                                                                title="Annuler la Demande de cette formation"
                                                                                                onClick={() => this.requestFormation(formation, true)}
                                                                                            ><FontAwesomeIcon icon={faTrash} /> Annuler la demande </CButton>
                                                                                        )
                                                                                            : requestFormationSalarie.find(request => request.formation.id === formation.id).statut === "ACCEPTE" ? (
                                                                                                <CAlert color="success">Demande accepté par {requestFormationSalarie.find(request => request.formation.id === formation.id).salarieValidateur.nom + " " + requestFormationSalarie.find(request => request.formation.id === formation.id).salarieValidateur.prenom}</CAlert>
                                                                                            )
                                                                                                : requestFormationSalarie.find(request => request.formation.id === formation.id).statut === "REFUSE" && (
                                                                                                    <CAlert color="danger">Demande refusé par {requestFormationSalarie.find(request => request.formation.id === formation.id).salarieValidateur.nom + " " + requestFormationSalarie.find(request => request.formation.id === formation.id).salarieValidateur.prenom}</CAlert>
                                                                                                )
                                                                                    )
                                                                                        : (
                                                                                            <CButton
                                                                                                className="mr-2"
                                                                                                color="info"
                                                                                                title="Demander cette formation"
                                                                                                onClick={() => this.requestFormation(formation, false)}
                                                                                            ><FontAwesomeIcon icon={faCheck} /> Demander la formation </CButton>
                                                                                        )
                                                                                ) :
                                                                                    user.formations.filter(form => form.id === formation.id).length > 0 ?
                                                                                        <CAlert color="success">Déjà inscript</CAlert>
                                                                                        : <CButton
                                                                                            className="mr-2"
                                                                                            color="info"
                                                                                            title="Demander cette formation"
                                                                                            onClick={() => this.requestFormation(formation, false)}
                                                                                        ><FontAwesomeIcon icon={faCheck} /> Demander la formation </CButton>

                                                                                }

                                                                            </td>
                                                                        </tr>
                                                                    )) : (<tr><td colSpan="6" className="text-center font-weight-bold">Aucune formation</td></tr>))}
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
                                        </CTabPane>
                                        <CTabPane>
                                            <div className="form-row justify-content-between mt-4">
                                                <table className="table table-striped table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>Titre</th>
                                                            <th>Service</th>
                                                            <th>Date de début </th>
                                                            <th>Date de fin</th>
                                                            <th>Volume horaire</th>
                                                            <th>Prix <small>(HT)</small></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {displayTraining &&
                                                            displayTraining.length !== 0 ?
                                                            displayTraining.map((t, key) => {
                                                                return (
                                                                    <tr key={key}>
                                                                        <td>{t.titre}</td>
                                                                        <td>{t.domaine.titre}</td>
                                                                        <td>{moment(t.dateDebut).format("ll")}</td>
                                                                        <td>{moment(t.dateFin).format("ll")}</td>
                                                                        <td>{t.duree}</td>
                                                                        <td>{t.prix}</td>
                                                                    </tr>
                                                                );
                                                            }) : (<tr><td colSpan="6" className="text-center font-weight-bold">Aucune formation</td></tr>)}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CTabPane>
                                    </CTabContent>
                                </CTabs>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>


            </>
        )

    }
}

export default RequestFormation