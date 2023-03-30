import { CAlert, CButton, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import { withRouter } from "react-router";
import QuestionsService from "../../services/question.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

import { arrayToObject } from "src/utils/fonctions";
import questionnaireService from "src/services/questionnaire.service";

class CreateQuestion extends Component {
    constructor(props) {
        super(props);
        this.onChangeQuestion = this.onChangeQuestion.bind(this);
        this.createQuestion = this.createQuestion.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.addChoise = this.addChoise.bind(this);
        this.state = {
            choices: [],
            currentErrors: {
                questionNull: null,
            },
            currentQuestion: {
                intitule: "",
                choix: {},
                questionnaire: []
            },
            message: null,
            ifError: null,
            loading: false,
        };
    }

    onChangeQuestion(e) {
        const question = e.target.value;
        if (question != null) {
            this.setState((prevState) => ({
                currentQuestion: {
                    ...prevState.currentQuestion,
                    intitule: question
                },
                currentErrors: {
                    ...prevState.currentErrors,
                    questionNull: "",
                }
            }))
        } else {
            this.setState((prevState) => ({
                currentQuestion: {
                    ...prevState.currentQuestion,
                    intitule: ""
                },
                currentErrors: {
                    ...prevState.currentErrors,
                    questionNull: "Le champ est requis.",
                }
            }));
        }
    }

    createQuestion(e) {
        e.preventDefault();
        if (!this.state.currentErrors.titleBool) {
            this.setState({ loading: true })
            QuestionsService.getQuestionByIntitule(this.state.currentQuestion.intitule).then(response => {
                if (response.data === "") {
                    QuestionsService.saveQuestion(this.state.currentQuestion)
                        .then(response => {
                            this.setState({
                                currentQuestion: response.data,
                                message: "Création bien prise en compte ! ",
                                ifError: false,
                                loading: false,
                            });

                            questionnaireService.insertQuestionForQuestionnaire(this.props.idQuestionnaire, this.state.currentQuestion.id).then((responce) => {
                              this.props.updateQuestionnaire(0);
                            });

                            window.setTimeout(() => {
                                this.setState({
                                    currentQuestion: {
                                        intitule: "",
                                        choix: {},
                                        questionnaire: []
                                    },
                                    message: null,
                                    ifError: null,
                                    loading: false,
                                });

                            }, 2000);
                        })
                        .catch(e => {
                            this.setState({
                                message: "Cette question existe déjà.",
                                ifError: true,
                                loading: false
                            });
                        });
                } else {
                    this.setState({
                        message: "Une erreur est présente dans votre formulaire.",
                        ifError: true,
                        loading: false
                    });
                }
            })

        } else {
            this.setState({
                message: "Une erreur est présente dans votre formulaire.",
                ifError: true,
                loading: false
            });
        }

    }

    handleText = i => e => {
        let choices = [...this.state.choices];
        choices[i] = e.target.value;
        if (e.target.value.length > 0) {
            this.setState({
                choices,
            }, () => {
                this.setState((prevState) => ({
                    currentQuestion: {
                        ...prevState.currentQuestion,
                        choix: arrayToObject(choices)
                    },

                }));
            })
        }
    }

    handleDelete = i => e => {
        e.preventDefault()
        let choices = [
            ...this.state.choices.slice(0, i),
            ...this.state.choices.slice(i + 1),
        ]
        this.setState({
            choices,
        }, () => {
            this.setState((prevState) => ({
                currentQuestion: {
                    ...prevState.currentQuestion,
                    choix: arrayToObject(choices)
                },

            }));
        })
    }

    addChoise = e => {
        e.preventDefault()
        let choices = this.state.choices.concat([''])
        this.setState({
            choices
        })
    }

    render() {
        const { currentQuestion, currentErrors, ifError, message, loading, choices } = this.state;
        return (
            <>
                <div className="edit-form mt-3">
                    <form name="createQuestion" onSubmit={this.createQuestion}>
                        <div className="form-group">
                            <label htmlFor="intitule">Créer une question</label>
                            <input type="text" name="intitule" className="form-control" id="intitule" placeholder="Saisir un intilulé de question" value={currentQuestion.intitule} onChange={this.onChangeQuestion} />
                            <span className="text-danger">{currentErrors.questionNull}</span>
                        </div>

                        <div>
                            <label>Ajouter des choix de réponse (non obligatoire)</label>
                            {choices.map((choice, index) => (
                                <span key={index} className="form-row">
                                    <div className="form-group col-md-11">
                                        <input
                                            type="text"
                                            onChange={this.handleText(index)}
                                            value={choice}
                                            className="form-control mt-1"
                                            placeholder="Intitulé du choix"
                                        />
                                    </div>
                                    <div className="form-group col-md-1">
                                        <CButton color="danger" className="btn btn-danger"
                                        onClick={this.handleDelete(index)}><FontAwesomeIcon icon={faWindowClose} /></CButton>
                                    </div>
                                </span>
                            ))}
                            <CButton block color="info" className="mt-1" onClick={this.addChoise}>Ajouter un choix</CButton>
                        </div>
                        <CButton type="submit" block color="success" className="mt-1" disabled={loading}>
                            {loading && <CSpinner size="sm" variant="border" />} Créer une question
                        </CButton>
                    </form>
                    {ifError !== null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
                </div>
            </>
        );
    }
}

export default withRouter(CreateQuestion);
