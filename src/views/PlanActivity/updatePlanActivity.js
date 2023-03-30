import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react'
import UpdateActivityPlan from '../../component/PlanActivite/PlanActiviteAnnuel/UpdateActivityPlan';

class updatePlanActivity extends Component {
  render() {
    return(
      <>
        <CRow>
          <CCol lg="12">
            <CCard>
              <CCardBody>
              <UpdateActivityPlan activityPlan={this.props.match.params} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default updatePlanActivity
