import {
  CCard,
  CCardBody, CCol,
  CRow
} from '@coreui/react';
import { Component } from 'react';
import OrganigrammeEntreprise from '../../component/Entreprise/OrganigrammeEntreprise';

class organigrammeEntreprise extends Component {
  render() {
    return (
      <>
        <CRow>
          <CCol>
            <CCard>
              <CCardBody>
                <OrganigrammeEntreprise entrepriseid={this.props.match.params} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default organigrammeEntreprise
