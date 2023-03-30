import React from 'react'
import {
    CCard,
    CCardBody,
    CCol,
    CRow
} from '@coreui/react'
import CreatedSalaryAndPost from '../../component/salaryAndPost/CreatedSalaryAndPost';


const createdSalaryAndPost = () => {
    return (
        <div>
            <CRow>
                <CCol>
                    <CCard>
                        <CCardBody>
                            <CreatedSalaryAndPost />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    );
};

export default createdSalaryAndPost;