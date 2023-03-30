import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react'
import ListActivityPlan from '../../component/PlanActivite/PlanActiviteAnnuel/ListActivityPlan';

class allPlanActivity extends Component {
  render() {
    return(
      <>
        <CRow>
          <CCol lg="12">
            <CCard>
              <CCardBody>
              <ListActivityPlan />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default allPlanActivity
