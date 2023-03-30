import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
} from '@coreui/react'
/*import CIcon from '@coreui/icons-react'*/
//import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import ListEntretien from '../../component/Entretien/ListEntretien';

class AllEntretiens extends Component {
  render() {
    return(
      <>
        <CRow>
          <CCol lg="12">
            <CCard>
              <CCardBody>
              <CRow className="align-items-right mt-3">
                <CCol xl md={{ span: 2, offset: 10 }}>
                    <CButton className="float-right" block variant="outline" color="info" to="/entretiens/creation">
                      <CIcon name="cil-home" />  Programmer un entretien
                    </CButton>
                </CCol>
              </CRow>
              <ListEntretien />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default AllEntretiens
