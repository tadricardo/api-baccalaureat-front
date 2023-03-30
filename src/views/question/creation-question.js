import React from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react'
import CreateQuestion from 'src/component/Question/CreateQuestion';
//import App from 'src/component/Question/App'; //add input dynamically with state

const CreationQuestion = () => {
  return (
    <>
    <CRow>
      <CCol>
        <CCard>
          <CCardBody>
            <CreateQuestion />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </>
  )
}

export default CreationQuestion
