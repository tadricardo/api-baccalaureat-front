import React from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow
} from '@coreui/react'
import FormUpdatePassword from "../../../component/FormUpdatePassword";

const UpdatePassword = () => {
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
              <CCard className="p-4">
                <CCardBody>
                <FormUpdatePassword />
                </CCardBody>
              </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default UpdatePassword