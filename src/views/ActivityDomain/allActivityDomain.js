import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
} from '@coreui/react'
import ListActivityDomain from '../../component/PlanActivite/ActiviteDomaine/ListActivityDomain';

class AllActivityDomain extends Component {
  render() {
    return(
      <>
        <CRow>
          <CCol lg="12">
            <CCard>
              <CCardBody>
              <CRow className="align-items-right mt-3">
                <CCol xl md={{ span: 2, offset: 10 }}>
                    <CButton className="float-right" block variant="outline" color="info" to="/activite-domaine/creation">
                       Ajout d'un domaine activité
                    </CButton>
                </CCol>
              </CRow>
              <ListActivityDomain />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default AllActivityDomain
