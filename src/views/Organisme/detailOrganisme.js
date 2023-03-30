import React from 'react';
import {
    CCard,
    CCardBody,
    CCol,
    CRow
} from '@coreui/react'
import DetailOrganisme from 'src/component/Organisme/DetailOrganisme';

const detailOrganisme = () => {
    return (
        <div>
            <CRow>
            <CCol>
                <CCard>
                    <CCardBody>
                        <DetailOrganisme />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
        </div>
    );
};

export default detailOrganisme;