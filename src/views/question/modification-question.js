import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow
} from '@coreui/react'
import UpdateQuestion from 'src/component/Question/UpdateQuestion';

class ModificationQuestion extends Component {

  render() {
    return(
      <>
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                Modifier une question
              </CCardHeader>
              <CCardBody>
                <UpdateQuestion questionId={this.props.match.params} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default ModificationQuestion
