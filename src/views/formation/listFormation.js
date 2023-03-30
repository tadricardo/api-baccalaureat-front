import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
} from "@coreui/react";
import React, { Component } from "react";
import ListFormation from "../../component/Formation/ListFormation";

export class listFormation extends Component {
  render() {
    return (
      <>
        <CRow>
          <CCol lg="12">
            <CCard>
              <CCardBody>
                <CRow className="align-items-right mt-3">
                  <CCol xl md={{ span: 2, offset: 10 }}>
                    <CButton
                      to={"/formations/creation"}
                      className="float-right"
                      block
                      variant="outline"
                      color="info"
                    >
                      <CIcon name="cil-user" /> Ajout d'une formation
                    </CButton>
                  </CCol>
                </CRow>
                <ListFormation />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}

export default listFormation;
