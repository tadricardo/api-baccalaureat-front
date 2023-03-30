import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react'
import AddCommentCompteRendu from '../../component/CompteRendu/AddCommentCompteRendu';

class addCommmentReport extends Component {

  render() {
    return(
      <>
        <CRow>
          <CCol>
            <CCard>
              <CCardBody>
                <AddCommentCompteRendu/>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default addCommmentReport
