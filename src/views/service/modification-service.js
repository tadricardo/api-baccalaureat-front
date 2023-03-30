import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react'
/*import CIcon from '@coreui/icons-react'*/
//import { Link } from 'react-router-dom'
import UpdateService from '../../component/Service/UpdateService';

class updateService extends Component {

  render() {
    return(
      <>
        <CRow>
          <CCol>
            <CCard>
              <CCardBody>
                <UpdateService serviceId={this.props.match.params} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default updateService
