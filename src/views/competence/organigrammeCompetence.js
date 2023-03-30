import {
  CCard,
  CCardBody, CCol,
  CRow
} from '@coreui/react';
import { Component } from 'react';
import OrganigrammeCompetence from 'src/component/Competence/OrganigrammeCompetence';


class organigrammeCompetence extends Component {
  render() {
    return (
      <>
        <CRow>
          <CCol>
            <CCard>
              <CCardBody>
                <OrganigrammeCompetence />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default organigrammeCompetence
