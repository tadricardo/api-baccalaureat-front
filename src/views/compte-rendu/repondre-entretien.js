import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow
} from '@coreui/react'
import AnswerInterview from 'src/component/CompteRendu/AnswerInterview';

class RepondreEntretien extends Component {

  render() {
    return(
      <>
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                repondre entretien
              </CCardHeader>
              <CCardBody>
                <AnswerInterview/>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default RepondreEntretien
