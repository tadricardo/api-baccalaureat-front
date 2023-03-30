import React from 'react';
import {
    CCard,
    CCardBody,
    CCol,
    CRow
} from '@coreui/react'
import ListeOrganisme from 'src/component/Organisme/ListeOrganisme';
const listeOrganisme = () => {
    return (
        <div>
            <CRow>
            <CCol>
                <CCard>
                    <CCardBody>
                        <ListeOrganisme />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
            
        </div>
    );
};

export default listeOrganisme;