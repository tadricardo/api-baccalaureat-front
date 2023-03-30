import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react';
import { faBriefcase, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
//import { Link } from 'react-router-dom'
import ListSalarie from '../../component/Salarie/ListSalarie';

class AllSalaries extends Component {

  render() {
    return (
      <>
        <CRow>
          <CCol>
            <CCard>
              <CCardBody>
                <CRow className="d-flex justify-content-end">
                  <CCol xs={2}>
                    <CButton className="float-right" block variant="outline" color="info" to="/salaries/postes/liste">
                      <FontAwesomeIcon icon={faBriefcase} className="mr-1" />  Liste des postes
                    </CButton>
                  </CCol>
                  {/* <CCol xs={2}>
                    <CButton className="float-right" block variant="outline" color="info" to="/salaries/creation">
                    <FontAwesomeIcon icon={faUser} className="mr-1" /> Ajout d'un salarié
                    </CButton>
                  </CCol> */}
                  <CCol xs={2}>
                    <CButton className="float-right" block variant="outline" color="info" to="/salaries/salarie-poste">
                    <FontAwesomeIcon icon={faUser} className="mr-1" /> Ajout d'un salarié
                    </CButton>
                  </CCol>
                </CRow>
                <ListSalarie />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default AllSalaries
