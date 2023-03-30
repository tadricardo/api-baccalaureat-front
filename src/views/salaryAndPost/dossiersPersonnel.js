import React from 'react'
import {
    CCard,
    CCardBody,
    CCol,
    CRow
} from '@coreui/react'
import DossiersPersonnel from '../../component/salaryAndPost/_DossiersPersonnel';

const dossiersPersonnel = (props) => {
    return (
        <div>
            <CRow>
                <CCol>
                    <CCard>
                        <CCardBody>
                            <DossiersPersonnel parametres={props.match.params} />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    );
};

export default dossiersPersonnel;