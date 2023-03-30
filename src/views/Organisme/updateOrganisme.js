import React from 'react';
import {
    CCard,
    CCardBody,
    CCol,
    CRow
} from '@coreui/react'

import UpdateOrganisme from 'src/component/Organisme/UpdateOrganisme';

const updateOrganisme = () => {
    return (
        <div>
             <div>
        <CRow>
            <CCol>
                <CCard>
                    <CCardBody>
                        <UpdateOrganisme/>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    </div>
        </div>
    );
};

export default updateOrganisme;