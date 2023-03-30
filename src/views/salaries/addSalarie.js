import React from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react'
import CreateSalarie from '../../component/Salarie/CreateSalarie';

const AddSalarie = () => {
  return (
    <>
    <CRow>
      <CCol>
        <CCard>
          <CCardBody>
            <CreateSalarie />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </>
  )
}

export default AddSalarie
