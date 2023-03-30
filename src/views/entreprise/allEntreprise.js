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
import ListEntreprise from '../../component/Entreprise/ListEntreprise';

class AllEntreprise extends Component {
  render() {
    return(
      <>
        <CRow>
          <CCol lg="12">
            <CCard>
              <CCardBody>
              <CRow className="align-items-right mt-3">
                <CCol xl md={{ span: 2, offset: 10 }}>
                    <CButton className="float-right" block variant="outline" color="info" to="/entreprises/creation">
                      <CIcon name="cil-home" />  Ajout d'une entreprise
                    </CButton>
                </CCol>
              </CRow>
              <ListEntreprise />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default AllEntreprise
