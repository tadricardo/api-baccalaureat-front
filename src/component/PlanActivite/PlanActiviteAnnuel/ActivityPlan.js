import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { faFileAlt, faFolderOpen } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import activityDomainService from 'src/services/activityDomain.service';
import planActivityService from 'src/services/planActivity.service';

export class ActivityPlan extends Component {
    constructor(props) {
        super(props);
        this.getPlanAnnuel = this.getPlanAnnuel.bind(this);
        this.getDomain = this.getDomain.bind(this);
        this.state = {
            idPlan: this.props.activityPlan.id,
            currentPlan: {
                id: 0,
                lstActivity: [],
                salarie: {},
                year: 0
            },
            lstDomain: []
        };
    }

    componentDidMount() {
        this.getPlanAnnuel(this.state.idPlan);
        this.getDomain();
    }

    getDomain() {
        activityDomainService.getAll().then(response => { this.setState({ lstDomain: response.data }) })
            .catch(e => console.log(e))
    }
    getPlanAnnuel(id) {
        planActivityService.getById(id).then(response => {
            const data = response.data;
            this.setState({
                currentPlan: data
            });
        }).catch(e => { console.log(e) })
    }

    toggle(e) {
        let stateCardBody = document.getElementById(`domain${e.target.name}`);
        if (stateCardBody.hidden === false) {
            e.target.className = "btn btn-success";
            e.target.innerText = "+";
            stateCardBody.hidden = true
        }
        else {
            e.target.className = "btn btn-danger";
            e.target.innerText = "-";
            stateCardBody.hidden = false
        }

    }

    render() {
        const { currentPlan, lstDomain } = this.state;
        return (
            <>
                <h3>Plan d'activité annuel {currentPlan.year} de {currentPlan.salarie.nom} {currentPlan.salarie.prenom}</h3>
                <CRow className="mt-4">
                    <CCol lg={12}>
                        <CCard>
                            <CCardHeader>
                                <h4><FontAwesomeIcon icon={faFolderOpen} /> Liste des activités</h4>
                            </CCardHeader>
                            <CCardBody>
                                {lstDomain.map((domain, key) =>
                                    <CRow key={key} >
                                        <CCol lg={12}>
                                            <CCard>
                                                <CCardHeader className="d-flex justify-content-between">
                                                    <h4><FontAwesomeIcon icon={faFileAlt} /> {domain.titre} ({currentPlan.lstActivity.filter((activity, key) => activity.domain.id === domain.id).length}) </h4>
                                                    <CButton className="btn btn-success" name={domain.id} onClick={this.toggle}> + </CButton>
                                                </CCardHeader>
                                                <CCardBody id={`domain${domain.id}`} hidden={true}>
                                                    <div className="col-lg-12 table-responsive">
                                                        <table className="table table-hover table-striped ">
                                                            <thead>
                                                                <tr>
                                                                    <th>Titre</th>
                                                                    <th>Durée en jours</th>
                                                                    <th>Date désire</th>
                                                                    <th>Date programmé</th>
                                                                    <th>Observations collaborateur</th>
                                                                    <th>Observations manager</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {currentPlan.lstActivity.filter((activity) => activity.domain.id === domain.id).map((activity, key) => {
                                                                    return (
                                                                        <tr key={key}>
                                                                            <td>{activity.title}</td>
                                                                            <td>{activity.duration}</td>
                                                                            <td>{moment(activity.desiredDate).format("LL")}</td>
                                                                            <td>{activity.scheduledDate && moment(activity.scheduledDate).format("LL")}</td>
                                                                            <td>{activity.commentaryEmployee}</td>
                                                                            <td>{activity.commentaryManager}</td>
                                                                        </tr>

                                                                    )
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </CCardBody>
                                            </CCard>
                                        </CCol>
                                    </CRow>
                                )}
                                <CRow>
                                    <CCol className="text-right">
                                    <CButton className="mt-1 " to={"/plan-annuel/ma-liste"}  color="link" title="Vous voulez annuler ?">
                                        Retour en arrière
                                    </CButton>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </>
        )
    }
}

export default withRouter(ActivityPlan)
