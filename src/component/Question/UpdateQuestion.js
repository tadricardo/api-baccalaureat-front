import { CAlert, CButton, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import { withRouter } from "react-router";
import QuestionsService from "../../services/question.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { arrayToObject } from "src/utils/fonctions";

class UpdateQuestion extends Component {
    constructor(props) {
        super(props);
        this.onGetQuestion = this.onGetQuestion.bind(this);
        this.onChangeQuestion = this.onChangeQuestion.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.addChoise = this.addChoise.bind(this);
        this.goBack = this.goBack.bind(this);


        this.state = {
            questionId: this.props.questionId.id,
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

    componentDidMount() {
        this.onGetQuestion(this.props.questionId.id);
    }

    onGetQuestion(id) {
        QuestionsService.getQuestionById(id)
            .then(response => {
                this.setState({
                    currentQuestion: response.data,
                }, () => {
                    this.setState({
                        choices: Object.values(this.state.currentQuestion.choix),
                    })
                })
            })
            .catch(e => {
                console.log("erreur : ", e);
            });
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

    updateQuestion(e) {
        e.preventDefault();
        if (!this.state.currentErrors.titleBool) {
            this.setState({ loading: true })
            QuestionsService.getQuestionByIntitule(this.state.currentQuestion.intitule).then(response => {
                console.log(response);
                if (response.data.intitule === undefined) {
                    QuestionsService.updateQuestion(this.state.currentQuestion)
                        .then(response => {
                            this.setState({
                                currentQuestion: response.data,
                                message: "Modification bien prise en compte ! Redirection vers la liste de question.",
                                ifError: false
                            });
                            window.setTimeout(() => { this.props.history.goBack() }, 2500)
                        })
                        .catch(e => {
                            this.setState({
                                message: e.message,
                                ifError: true,
                                loading: false
                            });
                        });
                } else {
                    this.setState({
                        message: "L'intitulé est déjà utilisé.",
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

    goBack(){
        this.props.history.goBack();
    }

    render() {
        const { currentQuestion, currentErrors, ifError, message, loading, choices } = this.state;
        return (
            <>
                <div className="edit-form">
                    <form name="updateQuestion" onSubmit={this.updateQuestion}>
                        <div className="form-group">
                            <label htmlFor="intitule">Modifier la question</label>
                            <input type="text" name="intitule" className="form-control" id="intitule" placeholder="Saisir un intilulé de question" value={currentQuestion.intitule} onChange={this.onChangeQuestion} />
                            <span className="text-danger">{currentErrors.questionNull}</span>
                        </div>

                        <div>
                            <label>Modifier le choix de réponse (non obligatoire)</label>
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
                                        <CButton color="danger" className="btn btn-danger" onClick={this.handleDelete(index)}><FontAwesomeIcon icon={faTrash} /> Supprimer </CButton>
                                    </div>
                                </span>
                            ))}
                            <CButton block color="info" className="mt-1" onClick={this.addChoise}>Ajouter un choix</CButton>
                        </div>
                        <CButton type="submit" block color="success" className="mt-1" disabled={loading}>
                            {loading && <CSpinner size="sm" variant="border" />} Modifier la question
                        </CButton>
                            <CButton onClick={this.goBack} type="submit" block color="danger" className="mt-1">
                                Annuler
                            </CButton>
                    </form>
                    {ifError != null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
                </div>
            </>
        );
    }
}

export default withRouter(UpdateQuestion);