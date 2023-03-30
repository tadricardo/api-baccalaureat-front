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
import ListPoste from '../../component/Poste/ListPoste';

class AllPoste extends Component {
  render() {
    return (
      <>
        <CRow>
          <CCol>
            <CCard>
              <CCardBody>
                <CRow className="align-items-right mt-3">
                  <CCol xl md={{ span: 2, offset: 10 }}>
                    <CButton className="float-right" block variant="outline" color="info" to="/salaries/liste">
                      <CIcon name="cil-user" />  Retour liste des salariés
                    </CButton>
                  </CCol>
                </CRow>
                <ListPoste />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default AllPoste
