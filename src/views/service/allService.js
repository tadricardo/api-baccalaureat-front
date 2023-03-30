import React, { Component } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
} from '@coreui/react'
/*import CIcon from '@coreui/icons-react'*/
//import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import ListService from '../../component/Service/ListService';


class AllService extends Component {
    render() {
      return(
        <>
          <CRow>
            <CCol lg="12">
              <CCard>
                <CCardBody>
                <CRow className="align-items-right mt-3">
                  <CCol xl md={{ span: 2, offset: 10 }}>
                      <CButton to={"/service/creation"} className="float-right" block variant="outline" color="info">
                        <CIcon name="cil-user" />  Ajout d'un service
                      </CButton>
                  </CCol>
                </CRow>
                <ListService />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )
    }
  }
  
  export default AllService