import {
    CCard,
    CCardBody,
    CCol,
    CRow,
} from "@coreui/react";
import React, { Component } from "react";
import InsertSalarieFormation from "../../component/Formation/InsertSalarieFormation";

export class insertSalarie extends Component {
    render() {
        return (
            <>
                <CRow>
                    <CCol lg="12">
                        <CCard>
                            <CCardBody>
                                <InsertSalarieFormation formationid={this.props.match.params} />
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </>
        );
    }
}

export default insertSalarie;
