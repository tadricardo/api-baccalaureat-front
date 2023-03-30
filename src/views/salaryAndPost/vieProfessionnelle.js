import React from 'react'
import {
    CCard,
    CCardBody,
    CCol,
    CRow
} from '@coreui/react'
import VieProfessionnelle from '../../component/salaryAndPost/_VieProfessionnelle';

const vieProfessionnelle = (props) => {
    return (
        <div>
            <CRow>
                <CCol>
                    <CCard>
                        <CCardBody>
                            <VieProfessionnelle parametres={props.match.params} />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    );
};

export default vieProfessionnelle;