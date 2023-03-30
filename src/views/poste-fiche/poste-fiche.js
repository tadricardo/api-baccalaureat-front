import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow
} from '@coreui/react';
import PosteFiche from '../../component/PosteFiche/PosteFiche';

const PosteFiches = () => {
  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <CRow className="d-flex justify-content-end">
                <CCol xs={2}>
                  <CButton to={"/titre-poste/liste"} className="float-right" block variant="outline" color="info">
                    <CIcon name="cil-user" />  Retour aux intulés de poste
                  </CButton>
                </CCol>
              </CRow>
              <PosteFiche />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default PosteFiches
