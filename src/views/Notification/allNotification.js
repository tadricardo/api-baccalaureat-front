import React, { Component } from 'react'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import AllNotification from '../../component/Notification/AllNotification';

class AllNotificationView extends Component {
  render() {
    return(
      <>
        <CRow>
          <CCol lg="12">
            <CCard>
              <CCardBody>
                <AllNotification />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default AllNotificationView
