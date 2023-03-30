import { CButton, CCardBody, CCardTitle, CSelect } from "@coreui/react";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { Component } from 'react';
import ReactPaginate from "react-paginate";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import FormationService from "../../services/formations.service";

class FormationDashboard extends Component {
    constructor(props) {
        super(props);
        this.retrieveFormation = this.retrieveFormation.bind(this);
        this.salarieByFormationId = this.salarieByFormationId.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.triPar = this.triPar.bind(this);
        this.state = {
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
                }],
                salaries: [{
                    id: null,
                    nom: null,
                    prenom: null,
                }],
            }],
            formationSalarie: [{
                salarie: {
                    id: null,
                    nom: null,
                    prenom: null,
                },
                idFormation: null,
            }],
            user: this.props.user,
            userRole: this.props.userRole,
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
        this.retrieveFormation();
    }

    retrieveFormation() {
        FormationService.countFormation("", this.state.startDate, this.state.endDate).then((resp) => {
            let nbPage = Math.ceil(resp.data / this.state.itemsPerPage)
            this.setState({ pageCount: nbPage })
        }).catch((e) => { 
            if (e.name === "AbortError") {
                return "Request Aborted ";
            }
            return e;
         });
        FormationService.getFormationPeriodByPage(this.state.currentPage, this.state.itemsPerPage, "", this.state.startDate, this.state.endDate, this.state.sortBy, this.state.order)
            .then(response => {
                this.setState({
                    formations: response.data,
                    loading: false
                })
                response.data.map(f => this.salarieByFormationId(f.id))
            })
            .catch(e => {
                if (e.name === "AbortError") {
                    return "Request Aborted ";
                }
                return e;
            });
    }

    salarieByFormationId(idFormation) {
        FormationService.getSalarieByIdFormation(idFormation)
            .then(response => {
                this.setState((prevState) => ({
                    formationSalarie: {
                        ...prevState.formationSalarie,
                        salarie: response.data,
                        idFormation: idFormation,
                    },
                }));
            })
            .catch(e => {
                if (e.name === "AbortError") {
                    return "Request Aborted ";
                }
                return e;
            });
    }

    handleChange(e) {
        const target = e.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
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

    render() {
        const { formations, loading, pageCount } = this.state;
        return (
            <>
                <CCardBody>
                    <CCardTitle>Les formations à venir</CCardTitle>
                    <CCardBody>
                        <div className="form-row justify-content-between mt-4">
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
                                            <th onClick={() => this.triPar("dateDebut")}>Date</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (<tr><td colSpan="6" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                                            formations.length !== 0 ? (
                                                formations.map((formation,index) =>
                                                    <tr key={index}>
                                                        <td>{formation.titre}</td>
                                                        <td>{moment(formation.dateDebut).format('DD/MM/YYYY') + " - " + moment(formation.dateFin).format('DD/MM/YYYY')}</td>
                                                        <td><Link to={"/formations/voir/" + formation.id}><CButton
                                                            className="mr-2"
                                                            color="info"
                                                            title="Vous voulez voir cette ligne ?"
                                                        ><FontAwesomeIcon icon={faEye} /> Voir</CButton></Link></td>
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
                    </CCardBody>
                </CCardBody>
            </>
        )
    }
}
export default withRouter(FormationDashboard);