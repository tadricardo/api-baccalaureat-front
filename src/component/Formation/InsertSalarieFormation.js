import { CButton, CCol, CForm } from '@coreui/react';
import React, { Component } from 'react'
import { withRouter } from 'react-router';
import { AsyncPaginate } from 'react-select-async-paginate';
import formationsService from "src/services/formations.service";
import salariesService from "src/services/salaries.service";
import { connect } from "react-redux";
import jwt_decode from 'jwt-decode';
import swal from 'sweetalert';
import { compareDateCurrentLessOneDay } from 'src/utils/fonctions';
import FormationService from '../../services/formations.service';
// TODO: Vérifier si la formation existe
class InsertSalarieFormation extends Component {

    constructor(props) {
        super(props);
        this.loadSalarie = this.loadSalarie.bind(this);
        this.onChangeSalarie = this.onChangeSalarie.bind(this);
        this.onChangeInputSalarie = this.onChangeInputSalarie.bind(this);
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.state = {
            nomSalarie: "",
            salaries: {},
            employeeFormation: [],
            loadingEmployee: false,
            loading: false,
            idFormation: this.props.formationid,
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
        };
    }

    componentDidMount() {
        this.getAllEmployeeFormation(this.props.formationid);
        this.retrieveFormation(this.props.formationid)
    }

    addItem(e) {
        e.preventDefault();
        let newSalarie = this.state.salaries;
        const result = this.state.employeeFormation.find(e => e.id === newSalarie.id);
        if (result === undefined) {
            if (newSalarie.length !== 0) {
                formationsService.insertSalarieForTrainnig(this.state.idFormation, newSalarie.id).then((response) => {
                    const newItems = [...this.state.employeeFormation, newSalarie];
                    this.setState({
                        employeeFormation: newItems,
                    });
                }).catch((err) => { 
                    swal({
                        text: "Erreur lors de l'ajout du salarie.",
                        icon: "error",
                    })
                    console.log("Erreur lors de l'ajout du salarie",err) 
                })

            }
        } else {
            swal({
                text: "Le salarié est déjà présent pour cette formation.",
                icon: "warning",
            })
        }
    }

    deleteItem(key) {
        const filteredItem = this.state.employeeFormation.filter((item) => { return item.id !== key.id; });
        formationsService.deleteSalarieForTraining(this.state.idFormation, key.id).then((resp) => {
            this.setState({ employeeFormation: filteredItem, });
        }).catch((e) => { console.log('Le salarie n\'est pas supprimé', e) })

    }

    getAllEmployeeFormation(idFormation) {
        this.setState({ loadingEmployee: true })
        formationsService.getSalarieByIdFormation(idFormation).then((response) => {
            this.setState({ employeeFormation: response.data, loadingEmployee: false });
        })
            .catch((e) => { console.log(e); });
    }

    async loadSalarie(search, prevOptions, { page }, e) {
        const { isRole, user } = this.props;
        const userDecode = jwt_decode(user);
        let response = null;
        if (isRole <= 2) {
            response = await salariesService.getAllByPageAndKeywordAndNotListFormation(page, 5, this.state.nomSalarie, "ASC", "id", this.state.idFormation);
        } else {
            response = await salariesService.getAllSalarieByIdManagerPerPageNotListFormation(page, 10, userDecode.id, "ASC", "id", this.state.idFormation);
        }
        const responseJSON = await response.data;
        return {
            options: responseJSON,
            hasMore: responseJSON.length >= 1,
            additional: {
                page: search ? 2 : page + 1,
            }
        };
    };

    retrieveFormation(id) {
        FormationService.getFormationById(id)
            .then(response => {
                this.setState({
                    formation: response.data,
                })
            })
            .catch(e => {
                console.log("erreur update salarie : ", e)
            });
    }

    onChangeInputSalarie(e) {
        this.setState({ nomSalarie: e })
    }

    onChangeSalarie(e) {
        this.setState({ salaries: e });
    }


    render() {
        const { salaries, employeeFormation, loadingEmployee, formation } = this.state;
        const { isRole, user } = this.props;
        const userDecode = jwt_decode(user);
        return (
            <>
                <div className="form-group row">
                    <label className="font-weight-bold col-sm-1 col-form-label" htmlFor="salarie">Salarie :</label>
                    <div className="col-sm-11">
                        <CForm className="form-row justify-content-between" onSubmit={this.addItem}>
                            <CCol>
                                {compareDateCurrentLessOneDay(formation.dateDebut) && (
                                    <AsyncPaginate
                                        name="salarie"
                                        value={salaries !== null ? Object.entries(salaries).length === 0 ? null : salaries : null}
                                        loadOptions={this.loadSalarie}
                                        isClearable
                                        getOptionValue={(option) => option.id}
                                        getOptionLabel={(option) => option.prenom + ' ' + option.nom}
                                        onChange={this.onChangeSalarie}
                                        isSearchable={true}
                                        onInputChange={this.onChangeInputSalarie}
                                        placeholder="Selectionner un salarie"
                                        additional={{
                                            page: 0,
                                        }}
                                    />)}
                            </CCol>
                            <CCol lg={2}>
                                {compareDateCurrentLessOneDay(formation.dateDebut) && (<CButton type="submit" color="primary" className={`px-4`} >Ajouter</CButton>)}
                            </CCol>
                        </CForm>
                    </div>
                </div>
                <div className="row mt-4 table-responsive">
                    <CCol md={12} lg={12}>
                        <table className="table table-hover table-striped table-bordered ">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Prénom</th>
                                    <th></th>
                                </tr>
                            </thead>
                            {loadingEmployee ? (<tbody><tr><td colSpan="3" className="text-center font-weight-bold">Chargement...</td></tr></tbody>) : (
                                employeeFormation.length > 0 ? (
                                    <tbody>
                                        {employeeFormation.map(employee =>
                                            <tr key={employee.id}>
                                                <td>{employee.nom}</td>
                                                <td>{employee.prenom}</td>
                                                <td>{((employee.postes.length !== 0 && employee.manager && userDecode.id === employee.manager.id) || isRole <= 2) && (<CButton color="danger" onClick={() => { this.deleteItem(employee); }}>X</CButton>)} </td>
                                            </tr>
                                        )}
                                    </tbody>
                                ) : (
                                    <tbody>
                                        <tr>
                                            <td colSpan="6" className="text-center font-weight-bold" >Aucun salarie</td>
                                        </tr>
                                    </tbody>
                                ))}
                        </table>
                    </CCol>
                </div>
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
export default withRouter(connect(mapStateToProps)(InsertSalarieFormation));