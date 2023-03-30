import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react'
import MyListActivityPlan from '../../component/PlanActivite/PlanActiviteAnnuel/MyListActivityPlan';

class myAllPlanActivity extends Component {
  render() {
    return(
      <>
        <CRow>
          <CCol lg="12">
            <CCard>
              <CCardBody>
              <MyListActivityPlan />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default myAllPlanActivity
