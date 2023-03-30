import { CCardBody, CCol, CButton, CInput, CLabel, CRow, CCard, CCardHeader} from '@coreui/react';
import { React, useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import salariesService from 'src/services/salaries.service';



const CreateSantionDisciplinaire = () => {
    const [salaries, setSalaries] = useState([]);
 

    useEffect(() => {
        salariesService.getAll().then((res) => {
            setSalaries(res.data);
        })

    }, []);



    return (
        <>
            <CCard>
                <CCardHeader>
                    <CLabel><h4>Sanction Disciplinaire</h4></CLabel>
                    
                </CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol lg={4} className='w-100'>
                            <CLabel>Nom et prenom du salarié
                                <select className='form-control mt-3'>
                                    {
                                        salaries.map(sal => {

                                            return <option key={sal.id} value={sal.id}>{sal.prenom + " " + sal.nom}</option>
                                        })
                                    }

                                </select>

                            </CLabel>
                        </CCol>

                        <CCol lg={4}>
                            <CLabel>Date
                                <CInput type='date' className='mt-3' />
                            </CLabel>
                        </CCol>

                        <CCol lg={4}>
                            <CLabel>Type de Sanction
                                <select className='form-control mt-3'>
                                    <option>Sanction 1</option>
                                    <option>Sanction 2</option>
                                    <option>Sanction 3</option>
                                </select>
                            </CLabel>


                        </CCol>
                    </CRow>


                    <CRow className='mt-5'>
                        <CCol lg={6}>
                            <CButton className='btn btn-outline-primary btn-block'>Sauvegarder</CButton>
                        </CCol>
                        <CCol lg={6}>
                            <CButton className='btn btn-outline-danger btn-block'>Annuler</CButton>
                        </CCol>
                    </CRow>

                </CCardBody>

            </CCard>

            
                

            




        </>
    );
};

export default withRouter(CreateSantionDisciplinaire) ;

