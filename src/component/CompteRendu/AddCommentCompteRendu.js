import { CAlert, CButton, CCol, CForm, CRow, CTextarea } from "@coreui/react";
import React, { Component } from "react";
import { withRouter } from "react-router";
import reponseService from "src/services/reponse.service";
import jwt_decode from 'jwt-decode';


class AddCommentCompteRendu extends Component {
    constructor(props) {
        super(props);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.state = {
            user: {},
            testReponse: [],
            currentInterview: {},
            currentReport: {},
            idManager: 0,
            idSalarie: 0,
            loading: false,
            message: null,
            ifError: null
        }
    }

    componentDidMount() {
        
        const { state } = this.props.location;
        if (!state){
            this.props.history.push("/home");
        }else{
            let participants = state.participants;
            let salarieObj = participants.filter(par => par.fonction === "SALARIE");
            let managerObj = participants.filter(par => par.fonction === "MANAGER");
            this.setState({ currentInterview: state, currentReport: state.compteRendu, idManager: managerObj[0].salarie.id, idSalarie: salarieObj[0].salarie.id })
            const token = JSON.parse(localStorage.getItem('token'));
            this.setState({ user: jwt_decode(token) })
        }
    }

    traitement() {
        this.setState({ loading: true })
        const { idManager, idSalarie, user, currentReport, currentInterview } = this.state;
        let repArray = []
        let text = null;
        let object = {};
        currentReport.reponses.map((reponse) => ((
            text = null,
            text = document.getElementById(`comment${reponse.question.id}`).value && document.getElementById(`comment${reponse.question.id}`).value,
            object = {
                id: reponse.id,
                question: {
                    id: reponse.question.id,
                },
                compteRendu: { id: currentInterview.compteRendu.id },
                reponse: reponse.reponse,
                reponseChoix: reponse.reponseChoix,
                commentaireManager: user.id === idManager ? text : reponse.commentaireManager,
                commentaireSalarie: user.id === idSalarie ? text : reponse.commentaireSalarie,
                version: reponse.version,
            },
            repArray.push(object)
        )));
        if ((user.id === idManager) || (user.id === idSalarie)) {
            reponseService.update(repArray)
                .then(response => {
                    this.setState({
                        message: "Mise en place de vos commentaires ! Redirection vers le compte-rendu.",
                        ifError: false,
                    });
                    window.setTimeout(() => { this.props.history.push("/entretiens/salarie/list"); }, 2000)
                })
                .catch(e => {
                    this.setState({
                        message: e,
                        ifError: true,
                        loading: false
                    });
                });
        } else {
            this.setState({
                message: "Vous n'êtes pas rattachés à ce compte-rendu.",
                ifError: true,
                loading: false
            });
        }

    }

    findChooose(elem, id) {
        return Object.values(elem.question.choix).filter((el, index) => index === id && el);
    }

    componentDidUpdate() {
        let textArea, btn = null;
        this.state.currentReport.reponses && this.state.currentReport.reponses.map((reponse) => ((
            textArea = document.getElementById(`comment${reponse.question.id}`) && document.getElementById(`comment${reponse.question.id}`),
            btn = document.getElementById(`btn${reponse.question.id}`) && document.getElementById(`btn${reponse.question.id}`),
            textArea.value !== "" ? (
                btn.className = "btn btn-danger",
                btn.innerText = "-",
                textArea.hidden = false
            ) : (
                btn.className = "btn btn-success",
                btn.innerText = "+",
                textArea.hidden = true
            )
        )));
    }

    toggle(e) {
        let stateTextarea = document.getElementById(`comment${e.target.name}`);
        if (stateTextarea.hidden === false) {
            e.target.className = "btn btn-success";
            e.target.innerText = "+";
            stateTextarea.hidden = true
        }
        else {
            e.target.className = "btn btn-danger";
            e.target.innerText = "-";
            stateTextarea.hidden = false
        }
        // Si le textarea est rempli l'affiche avec le button danger

    }

    onChangeComment(e) {
        const { idManager, user } = this.state;
        const name = e.target.name;
        //une copie superficielle des éléments
        let reponses = [...this.state.currentReport.reponses];
        //une copie superficielle de l'élément que vous souhaitez modifier.
        let item = { ...reponses[parseInt(name)] };
        //remplacer la propriété qui vous intéresse
        if (user.id === idManager) {
            item.commentaireManager = e.target.value;
        } else {
            item.commentaireSalarie = e.target.value;
        }

        //remettez-le dans notre tableau
        reponses[parseInt(name)] = item;
        this.setState({
            currentReport: {
                reponses: reponses
            }
        });
    }



    addComment(e) {
        e.preventDefault();
        this.traitement();
    }

    render() {
        const { loading, currentReport, idManager, user, ifError, message } = this.state;
        return (
            <>
                <CRow>
                    <CCol xs="12" md="12" className="mb-4">
                        <CForm name="addCommentReport" onSubmit={this.addComment.bind(this)}>
                            {

                                currentReport.reponses && currentReport.reponses.map((reponse, index) => (
                                    <div className="mt-2" key={index}>
                                        <label className="h5" name={`question${reponse.question.id}`}>
                                            {reponse.question.intitule} <CButton id={`btn${reponse.question.id}`} name={reponse.question.id} color="success" onClick={this.toggle} >+</CButton>
                                        </label>
                                        <p>{reponse.reponse || this.findChooose(reponse, reponse.reponseChoix)}</p>
                                        <CTextarea
                                            hidden
                                            name={`${index}`}
                                            id={`comment${reponse.question.id}`}
                                            rows="2"
                                            placeholder="Veuillez saisir votre commentaire"
                                            onChange={this.onChangeComment}
                                            value={user.id === idManager ? reponse.commentaireManager : reponse.commentaireSalarie || ""}

                                        />
                                    </div>

                                ))
                            }
                            <CButton type="submit" block color="success" className="mt-1" disabled={loading}>
                                Sauvegarde les commentaires
                            </CButton>
                        </CForm>
                        {ifError != null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
                    </CCol>
                </CRow>
            </>
        );
    }
}
export default withRouter(AddCommentCompteRendu);