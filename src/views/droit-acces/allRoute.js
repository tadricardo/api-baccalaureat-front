import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
} from '@coreui/react'
import ListDroitAcces from '../../component/DroitAcces/ListDroitAcces';

class AllRoute extends Component {
  render() {
    return(
      <>
        <CRow>
          <CCol lg="12">
            <CCard>
              <CCardBody>
              <CRow className="align-items-right mt-3">
                <CCol xl md={{ span: 2, offset: 10 }}>
                    <CButton className="float-right" block variant="outline" color="info" to="/route/creation">
                       Ajout d'une route
                    </CButton>
                </CCol>
              </CRow>
              <ListDroitAcces />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default AllRoute
