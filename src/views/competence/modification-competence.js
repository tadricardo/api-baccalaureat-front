import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react'
/*import CIcon from '@coreui/icons-react'*/
//import { Link } from 'react-router-dom'
import UpdateCompetence from '../../component/Competence/UpdateCompetence';

class updateCompetence extends Component {

  render() {
    return(
      <>
        <CRow>
          <CCol>
            <CCard>

              <CCardBody>
                <UpdateCompetence competenceId={this.props.match.params} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default updateCompetence
