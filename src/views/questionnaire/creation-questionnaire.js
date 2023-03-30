import React from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react'
import CreateQuestionnaire from 'src/component/Questionnaire/CreateQuestionnaire';

const CreationQuestionnaire = () => {
  return (
    <>
    <CRow>
      <CCol>
        <CCard>
          <CCardBody>
            <CreateQuestionnaire />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </>
  )
}

export default CreationQuestionnaire
