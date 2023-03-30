import React from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react'
import CreatePoste from '../../component/Poste/CreatePoste';

const CreationPoste = () => {
  return (
    <>
    <CRow>
      <CCol>
        <CCard>
          <CCardBody>
            <CreatePoste />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </>
  )
}

export default CreationPoste
