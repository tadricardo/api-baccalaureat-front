import { CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CSelect } from '@coreui/react';
import fr from "date-fns/locale/fr";
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import React, { Component } from 'react';
import { registerLocale } from 'react-datepicker';
import ReactPaginate from 'react-paginate';
import swal from 'sweetalert';
import FormationService from "../../services/formations.service";
import SalarieService from "../../services/salaries.service";
import FileSaver from 'file-saver';
registerLocale("fr", fr);

class ValidateRequestFormation extends Component {

    constructor(props) {
        super(props);
        this.retrieveSalarie = this.retrieveSalarie.bind(this);
        this.retrieveFormation = this.retrieveFormation.bind(this);
        this.triPar = this.triPar.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            user: {
                id: null,
                nom: null,
                prenom: null,
                role: null,
            },
            requestFormation: [{
                id: null,
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
                        nom: null
                    }]
                },
                salarie: {
                    id: null,
                    nom: null,
                    prenom: null,
                },
                salarieValidateur: {
                    id: null,
                    nom: null,
                    prenom: null,
                },
                statut: null,
            }],
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            itemsPerPage: 5,
            currentPage: 0,
            pageCount: 0,
            statut: "EN_ATTENTE",
            sortBy: "formation.dateDebut",
            order: "DESC",
            loading: false,
            userRole: null,
        }
    }
    componentDidMount() {
        const token = JSON.parse(localStorage.getItem('token'));
        this.retrieveSalarie(jwt_decode(token).id);
        //envoyer : jwt_decode(token).roles
        this.retrieveFormation(jwt_decode(token).roles, jwt_decode(token).id);
        this.setState({ userRole: jwt_decode(token).roles, });
    }

    retrieveSalarie(id) {
        SalarieService.getSalarieById(id)
            .then(response => {
                this.setState({
                    user: response.data,
                });
            })
            .catch(e => {
                console.log("erreur salarie : ", e);
            });
    }

    retrieveFormation(role, idUser) {
        if (role === "ADMIN" || role === "RH") {
            FormationService.countDemandeFormationByType(this.state.statut).then((resp) => {
                let nbPage = Math.ceil(resp.data / this.state.itemsPerPage)
                this.setState({ pageCount: nbPage })
            }).catch((e) => { console.log(e.message) });
            FormationService.getAllDemandeFormationByType(this.state.currentPage, this.state.itemsPerPage, this.state.sortBy, this.state.order, this.state.statut)
                .then(response => {
                    this.setState({
                        requestFormation: response.data,
                        loading: false
                    });
                })
                .catch(e => {
                    console.log(e.message);
                });
        } else if (role === "MANAGER") {
            FormationService.countDemandeFormationByTypeForManager(this.state.statut, idUser).then((resp) => {
                let nbPage = Math.ceil(resp.data / this.state.itemsPerPage)
                this.setState({ pageCount: nbPage })
            }).catch((e) => { console.log(e.message) });
            FormationService.getAllDemandeFormationByTypeForManager(this.state.currentPage, this.state.itemsPerPage, this.state.sortBy, this.state.order, this.state.statut, idUser)
                .then(response => {
                    this.setState({
                        requestFormation: response.data,
                        loading: false
                    })
                })
                .catch(e => {
                    console.log(e.message);
                });
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
        this.retrieveFormation(this.state.userRole, this.state.user.id);
    }

    handleChange(e) {
        const target = e.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        if (name === "statut") {
            this.setState({ statut: value }, () => { this.retrieveFormation(this.state.userRole, this.state.user.id); })
        }
        if (name === "nbPage") {
            this.setState({ loading: true, itemsPerPage: value, currentPage: 0 }, () => { this.retrieveFormation(this.state.userRole, this.state.user.id); })
        }
    }

    acceptDenyFormation(statut, demande, idSalarieValidateur) {
        let texte = null;
        let texteOk = null;
        if (statut === "ACCEPTE") {
            texte = "Accepter la demande de formation '" + demande.formation.titre + "' pour le salarié " + demande.salarie.nom + " " + demande.salarie.prenom + ".";
            texteOk = "La demande du formation '" + demande.formation.titre + "' pour le salarié " + demande.salarie.nom + " " + demande.salarie.prenom + " à était accepté.";
        }
        else if (statut === "REFUSE") {
            texte = "Refuser la demande de formation '" + demande.formation.titre + "' pour le salarié " + demande.salarie.nom + " " + demande.salarie.prenom + ".";
            texteOk = "La demande du formation '" + demande.formation.titre + "' pour le salarié " + demande.salarie.nom + " " + demande.salarie.prenom + " à était refusé.";
        }

        swal({
            title: "Êtes-vous sûrs ?",
            text: texte,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    FormationService.ReponseDemandeFormation(statut, idSalarieValidateur, demande.id)
                        .then(resp => {
                            swal("Validé !",
                                texteOk,
                                "success");
                            this.retrieveFormation(this.state.userRole, this.state.user.id)
                        }).catch(e => {
                            swal("Erreur !",
                                "Erreur lors de la suppression : " + e.message,
                                "error");
                        })
                }
            });
    }

    telechargerPdf(){
      FormationService.telechargerFormationEnAttente().then(res => {
        const blob = new Blob([res.data]);
        FileSaver.saveAs(blob,"formations-en-attentes.pdf");
      })
    }

    render() {
        const { user, loading, requestFormation, pageCount, statut } = this.state;
        return (
            <>
                <CRow>
                    <CCol xs="12" md="12" className="mb-4">
                        <CCard>
                            <CCardHeader>
                                <h4> Demande de formation en attente </h4>
                            </CCardHeader>
                            <CCardBody>

                                <div className="form-row justify-content-between mt-4">
                                    <form name="statutForm" className="col-md-2 ">
                                        <CSelect
                                            custom
                                            name="statut"
                                            id="statut"
                                            onChange={this.handleChange}
                                            disabled={loading}
                                        >
                                            <option value="EN_ATTENTE">Demande en attente</option>
                                            <option value="ACCEPTE">Demande accepté</option>
                                            <option value="REFUSE">Demande refusé</option>
                                        </CSelect>
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
                                                    <th onClick={() => this.triPar("salarie.nom")}>salarie</th>
                                                    <th onClick={() => this.triPar("formation.titre")}>Titre</th>
                                                    <th onClick={() => this.triPar("formation.domaine.titre")}>Service</th>
                                                    <th onClick={() => this.triPar("formation.dateDebut")}>Date de début</th>
                                                    <th onClick={() => this.triPar("formation.dateFin")}>Date de fin</th>
                                                    <th onClick={() => this.triPar("formation.duree")}>Durée <span><small><i>(en heure)</i></small></span></th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading ? (<tr><td colSpan="7" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                                                    requestFormation && requestFormation.length !== 0 ? requestFormation.map(rf =>
                                                        <tr key={rf.id}>
                                                            <td>{rf.salarie.nom + " " + rf.salarie.prenom}</td>
                                                            <td>{rf.formation.titre}</td>
                                                            <td>{rf.formation.domaine.titre}</td>
                                                            <td>{moment(rf.formation.dateDebut).format('DD/MM/YYYY')}</td>
                                                            <td>{moment(rf.formation.dateFin).format('DD/MM/YYYY')}</td>
                                                            <td>{rf.formation.duree}</td>
                                                            <td>
                                                                {statut === "EN_ATTENTE" ?
                                                                    <div>
                                                                        <CButton
                                                                            className="mr-2"
                                                                            color="success"
                                                                            title="Accepter la demande de formation."
                                                                            onClick={() => this.acceptDenyFormation("ACCEPTE", rf, user.id)}
                                                                        > Accepter la demande </CButton>
                                                                        <CButton
                                                                            className="mr-2"
                                                                            color="danger"
                                                                            title="Refuser la demande de formation."
                                                                            onClick={() => this.acceptDenyFormation("REFUSE", rf, user.id)}
                                                                        > Refuser la demande </CButton>
                                                                    </div>
                                                                    : statut === "ACCEPTE" & rf.salarieValidateur !== null ?
                                                                        <CAlert color="success">Demande accepté par {rf.salarieValidateur.nom + " " + rf.salarieValidateur.prenom}</CAlert>
                                                                        : statut === "REFUSE" & rf.salarieValidateur !== null &&
                                                                        <CAlert color="danger">Demande refusé par {rf.salarieValidateur.nom + " " + rf.salarieValidateur.prenom}</CAlert>
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                        : (<tr><td colSpan="7" className="text-center font-weight-bold">Aucune formation</td></tr>))}
                                            </tbody>
                                        </table>
                                      <div className="form-row justify-content-between mt-4">
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
                                        <div>
                                          <button className="btn btn-primary py-1" onClick={() => this.telechargerPdf()}>Telecharger les demandes</button>
                                        </div>

                                      </div>

                                    </div>
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>


            </>
        )

    }
}

export default ValidateRequestFormation
