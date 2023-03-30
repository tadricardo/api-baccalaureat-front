import {
  CButton, CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react';
import { Component } from 'react';
/*import CIcon from '@coreui/icons-react'*/
//import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react';
import ListCompetence from '../../component/Competence/ListCompetence';

class AllCompetence extends Component {
  render() {
    return (
      <>
        <CRow>
          <CCol lg="12">
            <CCard>
              <CCardBody>
                <CRow className="justify-content-end mt-3">
                  <CCol xs={6} md={2}>
                    <CButton to={"/competence/organigramme"} className="float-right" block variant="outline" color="info" title="Organigramme des compétences"> Organigramme </CButton>
                  </CCol>
                  <CCol xs={6} md={2}>
                    <CButton to={"/competence/creation"} className="float-right" block variant="outline" color="info">
                      <CIcon name="cil-user" />  Ajout d'une compétence
                    </CButton>
                  </CCol>
                </CRow>
                <ListCompetence />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default AllCompetence