import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react';
import { Component } from 'react';
import UpdateVisiteMedicale from 'src/component/salaryAndPost/visiteMedicale/UpdateVisiteMedicale';

class updateVisiteMedicale extends Component {
  render() {
    return (
      <>
        <CRow>
          <CCol>
            <CCard>
              <CCardBody>
                <UpdateVisiteMedicale parametres={this.props.match.params} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default updateVisiteMedicale
