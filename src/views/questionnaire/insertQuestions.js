import {
    CCard,
    CCardBody,
    CCol,
    CRow,
} from "@coreui/react";
import React, { Component } from "react";
import InsertQuestionToQuestionnaire from "../../component/Questionnaire/InsertQuestionToQuestionnaire";

export class insertQuestions extends Component {
    render() {
        return (
            <>
                <CRow>
                    <CCol lg="12">
                        <CCard>
                            <CCardBody>
                                <InsertQuestionToQuestionnaire questionnaireId={this.props.match.params} />
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </>
        );
    }
}

export default insertQuestions;
