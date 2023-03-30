import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react'
import Entretien from '../../component/Entretien/Entretien';

class entretien extends Component {

  render() {
    return(
      <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <Entretien/>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
    )
  }
}

export default entretien