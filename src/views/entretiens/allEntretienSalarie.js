import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'
import ListEntretienSalarie from '../../component/Entretien/ListEntretienSalarie';

class AllEntretienSalarie extends Component {
  render() {
    return(
      <>
        <CRow>
          <CCol lg="12">
            <CCard>
              <CCardBody>
              <ListEntretienSalarie />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default AllEntretienSalarie
