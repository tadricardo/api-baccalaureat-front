import React from 'react';
import {
    CCard,
    CCardBody,
    CCol,
    CRow
} from '@coreui/react'
import OrganismeDeFormation from 'src/component/Organisme/OrganismeDeFormation';


const organismeDeFormation = () => {
    return (
        <div>
        <CRow>
            <CCol>
                <CCard>
                    <CCardBody>
                        <OrganismeDeFormation />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    </div>
    );
};

export default organismeDeFormation;