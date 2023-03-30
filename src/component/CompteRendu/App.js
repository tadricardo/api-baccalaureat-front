
import React, { Component } from "react";
import { Fragment } from "react";
import { withRouter } from "react-router";
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader } from '@coreui/react';

class App extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            questions: ['hello'],
            modal: false,
        }
    }
    handleText = i => e => {
        let questions = [...this.state.questions]
        questions[i] = e.target.value
        this.setState({
            questions
        })
    }

    handleDelete = i => e => {
        e.preventDefault()
        let questions = [
            ...this.state.questions.slice(0, i),
            ...this.state.questions.slice(i + 1)
        ]
        this.setState({
            questions
        })
    }

    addQuestion = e => {
        e.preventDefault()
        let questions = this.state.questions.concat([''])
        this.setState({
            questions
        })
    }

    toggle() {
        this.setState({ modal: this.state.modal ? false : true });
    };


    render() {
        return (
            <>
                <Fragment>
                    {this.state.questions.map((question, index) => (
                        <span key={index}>
                            <input
                                type="text"
                                onChange={this.handleText(index)}
                                value={question}
                            />
                            <button onClick={this.handleDelete(index)}>X</button>
                        </span>
                    ))}
                    <button onClick={this.addQuestion}>Add New Question</button>
                </Fragment>
                <br /><br />
                <CButton
                    onClick={this.toggle}
                    className="mr-1"
                >Launch demo modal</CButton>
                <CModal
                    show={this.state.modal}
                    onClose={this.toggle}
                >
                    <CModalHeader closeButton>Modal title</CModalHeader>
                    <CModalBody>
                        Lorem ipsum dolor...
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="primary">Do Something</CButton>{' '}
                        <CButton
                            color="secondary"
                            onClick={this.toggle}
                        >Cancel</CButton>
                    </CModalFooter>
                </CModal>
                <br /><br />

            </>
        )
    }
}
export default withRouter(App);