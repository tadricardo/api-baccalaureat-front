import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from "@coreui/react";
import React, { Component } from "react";
import Formation from "../../component/Formation/Formation";

export class listFormation extends Component {
  render() {
    return (
      <>
        <CRow>
          <CCol lg="12">
            <CCard>
              <CCardBody>
                <Formation formationId={this.props.match.params} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}

export default listFormation;
