import React from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow
} from '@coreui/react'
import FormForgotPassword from "../../../component/FormForgotPassword";

const ForgotPassword = () => {
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
              <CCard className="p-4">
                <CCardBody>
                <FormForgotPassword />
                </CCardBody>
              </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ForgotPassword