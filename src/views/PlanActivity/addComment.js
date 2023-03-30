import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react'
import AddComment from '../../component/PlanActivite/PlanActiviteAnnuel/AddComment';

class addComment extends Component {
  render() {
    return(
      <>
        <CRow>
          <CCol lg="12">
            <CCard>
              <CCardBody>
              <AddComment />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default addComment
