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
import ListTitrePoste from '../../component/TitrePoste/ListTitrePoste';


class AllTitrePoste extends Component {
  render() {
    return (
      <>
        <CRow>
          <CCol lg="12">
            <CCard>
              <CCardBody>
                <CRow className="d-flex justify-content-end">
                  <CCol xs={2}>
                    <CButton to={"/titre-poste/fiche-poste"} className="float-right" block variant="outline" color="info">
                      <CIcon name="cil-user" />  Fiches de poste
                    </CButton>
                  </CCol>
                  <CCol xs={2}>
                    <CButton to={"/titre-poste/creation"} className="float-right" block variant="outline" color="info">
                      <CIcon name="cil-user" />  Ajout d'un intitulé de poste
                    </CButton>
                  </CCol>
                </CRow>
                <ListTitrePoste />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default AllTitrePoste