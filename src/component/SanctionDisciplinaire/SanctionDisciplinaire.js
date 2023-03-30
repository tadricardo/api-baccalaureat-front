import { CButton, CCard, CCardBody, CCardHeader, CRow } from '@coreui/react';
import {React} from 'react';
import { Link, withRouter } from 'react-router-dom';


const SanctionDisciplinaire = (props) => {
    
    const idSalarie = props.idSalarie;

    return (
        <>
            <CCard>
                <CCardHeader>
                    <h4> Liste des sanction disciplinaires</h4>
                    <CButton className='btn btn-outline-primary float-right mb-2'>+ Ajouter une type de sanction disciplinaire</CButton>
                </CCardHeader>

                <CCardBody>


                    <Link to={`/salaries/vie-professionnelle/${idSalarie}/creation-sanction`}>
                        <CButton className='btn btn-outline-primary float-right mb-3'>Donner une Sanction Disciplinaire à un salarié</CButton>
                    </Link>
                    <div className="table-responsive col-10 m-auto">
                        <table className="table table-hover table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th className='col-8'>Type de sanction</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='float-center'>
                                <tr>
                                    <td><strong>Sanction1</strong></td>
                                    <td >
                                        <CRow>
                                           
                                                <CButton className='btn btn-primary mx-2'>Détail</CButton>
                                            
                                                <CButton className='btn btn-primary mx-2'>Modifier</CButton>
                                            

                                            
                                                <CButton className='btn btn-primary'>Supprimer</CButton>
                                            
                                        </CRow>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CCardBody>
            </CCard>

        </>
    );
};

export default withRouter(SanctionDisciplinaire);