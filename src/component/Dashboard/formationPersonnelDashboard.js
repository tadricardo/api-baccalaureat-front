import { CCardBody, CCardTitle, CSelect } from "@coreui/react";
import moment from 'moment';
import momentFR from 'moment/locale/fr';
import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import { withRouter } from "react-router";
import salariesService from 'src/services/salaries.service';

class FormationPersonnelDashboard extends Component {
    constructor(props) {
        super(props);
        this.getPaginatedItems = this.getPaginatedItems.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            displayTraining: 0,
            pageCountTraining: 0,
            offsetTraining: 0,
            perPageTraining: 5,
            loading: false,
        };
        moment.updateLocale("fr", momentFR);
    }

    componentDidMount() {
        if (this.props.idUser !== null) {
            this.setState({ idUser: this.props.idUser, });
            this.getFormation(this.props.idUser);
        }
    }

    getFormation(idUser) {
        let displayTraining = null;
        let pageCountTraining = null;
        salariesService.getSalarieById(idUser)
            .then(response => {
                displayTraining = this.getPaginatedItems(response.data.formations)
                pageCountTraining = Math.ceil(response.data.formations.length / this.state.perPageTraining);
                this.setState({
                    displayTraining,
                    pageCountTraining,
                    loading: false,
                });
            })
            .catch(e => {
                if (e.name === "AbortError") {
                    return "Request Aborted ";
                }
                return e;
            });
    }

    getPaginatedItems(items) {
        return items.slice(this.state.offsetTraining, this.state.offsetTraining + this.state.perPageTraining);
    }

    handlePageClickTraining(data) {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPageTraining);
        this.setState({ offsetTraining: offset }, () => {
            const displayTraining = this.getPaginatedItems(this.state.user.formations);
            this.setState({
                displayTraining,
            });
        });
    }

    handleChange(e) {
        const target = e.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        if (name === "nbPage") {
            this.setState({ loading: true, itemsPerPage: value, currentPage: 0 }, () => { this.getFormation(this.state.idUser); })
        }
    }

    render() {
        const { displayTraining, loading } = this.state;
        return (
            <>
                <CCardBody>
                    <CCardTitle>Vos formations personnel</CCardTitle>
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
                                <table className="table table-hover table-striped table-bordered ">
                                    <thead>
                                        <tr>
                                            <th>Titre</th>
                                            <th>Date de début </th>
                                            <th>Date de fin</th>
                                            <th>Volume horaire</th>
                                            <th>Prix <small>(HT)</small></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayTraining &&
                                            displayTraining.length !== 0 ?
                                            displayTraining.map((t,index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{t.titre}</td>
                                                        <td>{moment(t.dateDebut).format("ll")}</td>
                                                        <td>{moment(t.dateFin).format("ll")}</td>
                                                        <td>{t.duree}</td>
                                                        <td>{t.prix}</td>
                                                    </tr>
                                                );
                                            }) : (<tr><td colSpan="5" className="text-center font-weight-bold">Aucune formation</td></tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {this.state.pageCountTraining > 1 && (<ReactPaginate
                            name="test"
                            previousLabel={'Précédent'}
                            nextLabel={'Suivant'}
                            breakLabel={'...'}
                            pageCount={this.state.pageCountTraining}
                            pageRangeDisplayed={5}
                            marginPagesDisplayed={2}
                            onPageChange={this.handlePageClickTraining.bind(this)}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}
                            pageLinkClassName="page-link"
                            breakLinkClassName="page-link"
                            nextLinkClassName="page-link"
                            previousLinkClassName="page-link"
                            pageClassName="page-item"
                            breakClassName="page-item"
                            nextClassName="page-item"
                            previousClassName="page-item"
                        />)}
                    </CCardBody>
                </CCardBody>
            </>
        )
    }
}
export default withRouter(FormationPersonnelDashboard);