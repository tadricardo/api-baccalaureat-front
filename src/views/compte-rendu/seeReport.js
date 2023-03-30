import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'
import ReadCompteRendu from '../../component/CompteRendu/ReadCompteRendu';
//import App from '../../component/CompteRendu/App';

class seeReport extends Component {
  render() {
    return(
      <>
        <CRow>
          <CCol lg="12">
            <CCard>
              <CCardBody>
                <ReadCompteRendu />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default seeReport
