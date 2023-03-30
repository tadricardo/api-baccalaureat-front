import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react'
import UpdateSalarie from '../../component/Salarie/UpdateSalarie';

class updateSalarie extends Component {

  render() {
    return(
      <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <UpdateSalarie salarieId={this.props.match.params} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
    )
  }
}

export default updateSalarie
