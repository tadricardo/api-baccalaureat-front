import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react'
import UpdatePassword from '../../component/Salarie/UpdatePassword';

class updatePassword extends Component {

  render() {
    return(
      <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <UpdatePassword/>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
    )
  }
}

export default updatePassword
