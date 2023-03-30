import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react'
import CreateVisiteMedicale from 'src/component/salaryAndPost/visiteMedicale/CreateVisiteMedicale';

class addVisiteMedicale extends Component {
  render() {
    return (
      <>
        <CRow>
          <CCol>
            <CCard>
              <CCardBody>
                <CreateVisiteMedicale salarieId={this.props.match.params} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default addVisiteMedicale
