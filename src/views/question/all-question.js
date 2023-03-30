import React from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react'
import ListQuestion from 'src/component/Question/ListQuestion';

const Question = () => {
  return (
    <>
    <CRow>
      <CCol>
        <CCard>
          <CCardBody>
            <ListQuestion />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </>
  )
}

export default Question
