import { CButton, CCol, CForm } from '@coreui/react';
import React, { Component } from 'react'
import { AsyncPaginate } from 'react-select-async-paginate';
import questionnaireService from 'src/services/questionnaire.service';
import questionService from 'src/services/question.service';
import swal from 'sweetalert';

class InsertQuestionToQuestionnaire extends Component {

    constructor(props) {
        super(props);
        this.loadQuestions = this.loadQuestions.bind(this);
        this.getQuestionnaire = this.getQuestionnaire.bind(this);
        this.onChangeQuestion = this.onChangeQuestion.bind(this);
        this.onChangeInputQuestion = this.onChangeInputQuestion.bind(this);
        this.addItem = this.addItem.bind(this);
        this.state = {
            titleQuest: "",
            question: {},
            questionsQuestionnaire: [],
            questions: [],
            idQuestionnaire: this.props.questionnaireId,
            loadingQuestions: false,
            loading: false,
            offsetQuest: 0,
            perPageQuest: 5,
            pageCountQuest: 0,
        }
    }

    componentDidMount() {
        this.getQuestionnaire();
    }

    getQuestionnaire() {
        this.setState({ loadingEmployee: true })
        questionnaireService.getQuestionByIdQuestionnaire(this.state.idQuestionnaire).then((response) => {
            const displayQuest = this.getPaginatedItems(response.data);
            const pageCountQuest = Math.ceil(response.data.length / this.state.perPageQuest);
            this.setState({ questionsQuestionnaire: response.data, displayQuest: displayQuest, loadingQuestions: false, pageCountQuest: pageCountQuest });
        })
            .catch((e) => { console.log(e); });
    }

    addItem(e) {
        e.preventDefault();
        let newQuestion = this.state.question;
        const result = this.state.questionsQuestionnaire.find(e => e.id === newQuestion.id);
        if (result === undefined) {
            if (newQuestion.length !== 0) {
                questionnaireService.insertQuestionForQuestionnaire(this.state.idQuestionnaire, newQuestion.id).then((response) => {
                    const newItems = [...this.state.questionsQuestionnaire, newQuestion];
                    this.setState({
                        questionsQuestionnaire: newItems,
                    }, () => {
                        this.getQuestionnaire();
                    });
                    this.props.updateQuestionnaire(0)
                }).catch((err) => { console.log("Erreur lors de l'ajout de la question") })

            }
        } else {
            swal({
                text: "La question est déjà présent.",
                icon: "warning",
            })
        }
    }

    deleteItem(key) {
        const filteredItem = this.state.questionsQuestionnaire.filter((item) => { return item.id !== key.id; });
        questionnaireService.deleteQuestionForQuestionnaire(this.state.idQuestionnaire, key.id).then((resp) => {
            this.setState({ questionsQuestionnaire: filteredItem, }, () => this.getQuestionnaire());
        }).catch((e) => { console.log('La question n\'est pas supp', e) })

    }

    async loadQuestions(search, prevOptions, { page }, e) {
        let response = await questionService.getAllByPageAndKeywordAndNotInQuestionnaire(page, 1, this.state.titleQuest, "ASC", "id", this.state.idQuestionnaire);
        let responseJSON = response.data;
        return {
            options: responseJSON,
            hasMore: responseJSON.length >= 1,
            additional: {
                page: search ? 2 : page + 1,
            }
        };
    };

    onChangeInputQuestion(e) {
        this.setState({ titleQuest: e })
    }

    onChangeQuestion(e) {
        this.setState({ question: e });
    }

    getPaginatedItems(items) {
        return items.slice(this.state.offsetQuest, this.state.offsetQuest + this.state.perPageQuest);
    }

    handlePageClickQuest(data) {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPageQuest);
        this.setState({ offsetQuest: offset }, () => {
            const displayQuest = this.getPaginatedItems(this.state.questionsQuestionnaire);
            this.setState({
                displayQuest: displayQuest,
            });
        });
    }

    render() {
        const {question} = this.state;
        return (
            <>
                <div className="form-row mt-3">
                    <div className="col-md-12">
                        <label className="font-weight-bold" htmlFor="question">Question :</label>
                        <CForm className="form-row justify-content-between" onSubmit={this.addItem} >
                            <CCol lg={10}>
                                <AsyncPaginate
                                    name="question"
                                    value={question !== null ? Object.entries(question).length === 0 ? null : question : null}
                                    options={this.state.questions}
                                    loadOptions={this.loadQuestions}
                                    isClearable
                                    getOptionValue={(option) => option.id}
                                    getOptionLabel={(option) => option.intitule}
                                    onChange={this.onChangeQuestion}
                                    isSearchable={true}
                                    onInputChange={this.onChangeInputQuestion}
                                    placeholder="Selectionner une question"
                                    cacheOptions={false}
                                    additional={{
                                        page: 0,
                                    }}
                                />
                            </CCol>
                            <CCol lg={2}>
                                <CButton type="submit" color="primary" className={`px-4`} >Ajouter</CButton>
                            </CCol>
                        </CForm>
                    </div>
                </div>

            </>
        )
    }
}
export default InsertQuestionToQuestionnaire
