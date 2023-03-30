import React, { Component } from 'react';
import { withRouter } from "react-router";
import FormationService from '../../services/formations.service';
import moment from 'moment';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ReactPaginate from 'react-paginate';
import InsertSalarieFormation from './InsertSalarieFormation';
class Formation extends Component {
    constructor(props) {
        super(props);
        this.getAllEmployeeFormation = this.getAllEmployeeFormation.bind(this);
        this.state = {
            idFormation: this.props.formationId.id,
            competences: [{
                id: 0,
                competence: {
                  id: 0,
                  nom: null,
                  domaine: [{
                    id: 0,
                    titre: null,
                  }]
                },
                formation: {
                  id: 0,
                }
              }],
            employeeFormation: [],
            formation: {
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
                    competence: {
                      id: 0,
                      nom: null,
                      domaine: [{
                        id: 0,
                        titre: null,
                      }]
                    },
                    formation: {
                      id: 0,
                    }
                  }]
            },
            perPage: 3,
            offset: 0,
            pageCountCompetence: 0,
            currentPage: 0,
            employeePerPage: 10,
            pageCountEmployee: 0
        }
    }

    componentDidMount() {
        const { idFormation } = this.state
        this.retrieveFormation(idFormation);
        this.getAllEmployeeFormation(idFormation);
    }

    getPaginatedItems(items) {
        return items.slice(this.state.offset, this.state.offset + this.state.perPage);
    }

    handlePageClick(data) {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);

        this.setState({ offset: offset }, () => {
            const currentCompentence = this.getPaginatedItems(this.state.formation.competences);
            this.setState({
                competences: currentCompentence,
            });
        });
    };

    handlePageClickEmployee = (data) => {
        let selected = data.selected;
        this.setState({ currentPage: selected }, () => {
            this.getAllEmployeeFormation(this.state.idFormation);
        });
    };

    retrieveFormation(id) {
        FormationService.getFormationById(id)
            .then(response => {
                this.setState({
                    formation: response.data,
                    pageCountCompetence: Math.ceil(response.data.competences.length / this.state.perPage),
                })
                const currentCompentence = this.getPaginatedItems(response.data.competences);
                this.setState({
                    competences: currentCompentence,
                });
            })
            .catch(e => {
                // Aucune formation trouvée
                this.props.history.goBack();
            });
    }

    getAllEmployeeFormation(idFormation) {
        const { employeePerPage, currentPage } = this.state;
        FormationService.countSalarieByFormation(idFormation).then((resp) => {
            let nbPage = Math.ceil(resp.data / employeePerPage)
            this.setState({ pageCountEmployee: nbPage })
        }).catch((e) => { console.log(e.message) });
        FormationService.getSalarieByIdFormationPerPage(idFormation, currentPage, employeePerPage).then((response) => {
            this.setState({ employeeFormation: response.data });
        }).catch((e) => {
            console.log(e);
        });
    }

    render() {
        const { formation, competences, pageCountCompetence, pageCountEmployee } = this.state;
        //const { isRole, user } = this.props;
        //const userDecode = jwt_decode(user);
        return (
            <>
                <CRow>
                    <CCol lg={6}>
                        <CCard>
                            <CCardHeader>{formation.titre}</CCardHeader>
                            <CCardBody>
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <tbody >
                                            <tr>
                                                <td className="font-weight-bold">Date de début</td>
                                                <td>{moment(formation.dateDebut).format('DD/MM/YYYY')}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-weight-bold">Date de fin</td>
                                                <td>{moment(formation.dateFin).format('DD/MM/YYYY')}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-weight-bold">Prix <small>(HT)</small></td>
                                                <td>{formation.prix} €</td>
                                            </tr>
                                            <tr>
                                                <td className="font-weight-bold">Durée</td>
                                                <td>{formation.duree}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-weight-bold">Service</td>
                                                <td>{formation.domaine.titre}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol lg={6}>
                        <CRow>
                            <CCol lg={12}>
                                <CCard>
                                    <CCardHeader>Compétences visées lors cette formation</CCardHeader>
                                    <CCardBody>
                                        <div className="table-responsive">
                                            <table className="table table-striped table-hover">
                                                <tbody>
                                                    {competences && competences.map(comp =>
                                                        <tr key={comp.id}>
                                                            <td>{comp.competence.nom}</td>
                                                            <td>{comp.note}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        {pageCountCompetence > 1 && (<ReactPaginate previousLabel={"Précédent"}
                                            nextLabel={"Suivant"}
                                            breakLabel={"..."}
                                            breakClassName={"break-me"}
                                            pageCount={pageCountCompetence}
                                            marginPagesDisplayed={1}
                                            pageRangeDisplayed={4}
                                            onPageChange={this.handlePageClick.bind(this)}
                                            containerClassName="pagination"
                                            activeClassName="active"
                                            pageLinkClassName="page-link"
                                            breakLinkClassName="page-link"
                                            nextLinkClassName="page-link"
                                            previousLinkClassName="page-link"
                                            pageClassName="page-item"
                                            nextClassName="page-item"
                                            previousClassName="page-item"
                                        />)}
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        </CRow>
                    </CCol>
                </CRow>

                <CRow>
                    <CCol>
                        <CCard>
                            <CCardHeader>Liste des salariés participants à la formation</CCardHeader>

                            <CCardBody>

                                {/*<table className="table table-striped table-hover">
                                    <tbody >
                                        {
                                            employeeFormation.length !== 0 ? (
                                                employeeFormation.map(employee =>
                                                    <tr key={employee.id}>
                                                        {(employee.postes.length !== 0 && employee.manager && (userDecode.id === employee.manager.id)) || isRole <= 2 ? (<td><Link to={`/salaries/profil/${employee.id}`}>{employee.nom + " " + employee.prenom}</Link></td>) : (<td>{employee.nom + " " + employee.prenom}</td>)}
                                                    </tr>
                                                )

                                            ) : (<tr className="text-center font-weight-bold"><td>Aucun participants</td></tr>)}
                                    </tbody>
                                </table>*/}

                                <InsertSalarieFormation formationid={this.state.idFormation}/>

                                {pageCountEmployee > 1 && (<ReactPaginate
                                    previousLabel={'Précédent'}
                                    nextLabel={'Suivant'}
                                    breakLabel={'...'}
                                    pageCount={pageCountEmployee}
                                    marginPagesDisplayed={1}
                                    pageRangeDisplayed={4}
                                    onPageChange={this.handlePageClickEmployee.bind(this)}
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
                                    forcePage={this.state.currentPage} />)}
                            </CCardBody>
                        </CCard>
                        <Link to={"/formations"} className="withoutUnderlane"><CButton type="button" block color="info" title="Retour à la liste des formations"> Retour a la liste des formations</CButton></Link>
                    </CCol>
                </CRow>
            </>
        )
    }
}
function mapStateToProps(state) {
    const { isRole, user } = state.authen;
    return {
        isRole,
        user
    };
}
export default withRouter(connect(mapStateToProps)(Formation));
