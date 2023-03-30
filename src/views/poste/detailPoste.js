import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'
import DetailPoste from "../../component/Poste/DetailPoste";


class detailPosteView extends Component {
  render() {
    return (
      <>
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                Détail du poste
              </CCardHeader>
              <CCardBody>
                <DetailPoste />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default detailPosteView
