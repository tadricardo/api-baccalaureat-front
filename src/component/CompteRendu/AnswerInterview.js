import { CButton, CSpinner } from "@coreui/react";
import jwt_decode from 'jwt-decode';
import React, { Component } from "react";
import { withRouter } from "react-router";
import swal from "sweetalert";
import QuestionnairesService from "../../services/questionnaire.service";
import ReponsesService from "../../services/reponse.service";
//TODO : AnswerInterview : Répondre questionnaire : Erreur 500 pour l update => quand radio button ne prend pas en compte le choix à cause de l'actualisation
class AnswerInterview extends Component {
  constructor(props) {
    super(props);
    this.getQuestionnaireById = this.getQuestionnaireById.bind(this);
    this.AnswierInterview = this.AnswierInterview.bind(this);
    this.state = {
      questionnaireId: null,
      currentInterview: null,
      user: {},
      manager: [{
        id: null,
        fonction: null,
        salarie: {
          id: null,
          nom: null,
          prenom: null,
        }
      }],
      salarie: [{
        id: null,
        fonction: null,
        salarie: {
          id: null,
          nom: null,
          prenom: null,
        }
      }],
      currentQuestionnaire: {
        id: null,
        titre: null,
        typeEntretien: {
          id: null,
          titre: null,
          version: null,
        },
        questions: [
          {
            id: null,
            intitule: null,
            choix: {},
            version: null,
          },
        ],
        version: null,
      },
      reponses: [{
        id: null,
        question: {
          id: null,
          intitule: null,
          choix: {},
          version: null,
        },
        compteRendu: { id: null, statut: null, },
        reponseSalarie: null,
        reponseChoixSalarie: null,
        reponseManager: null,
        reponseChoixManager: null,
        commentaireManager: null,
        commentaireSalarie: null,
        version: null,
      }],
      loading: false,
    };
  }

  componentDidMount() {
    const { state } = this.props.location;
    this.setState({ currentInterview: state })
    if (state === undefined)
      this.props.history.push("/home");
    else {
      this.getQuestionnaireById(state.compteRendu.questionnaire.id);
      this.getReponseByIdCompteRendu(state.compteRendu.id);
      const participants = state.participants;
      const salarieObj = participants.filter(par => par.fonction === "SALARIE");
      const managerObj = participants.filter(par => par.fonction === "MANAGER");
      const token = JSON.parse(localStorage.getItem('token'));
      this.setState({ user: jwt_decode(token), manager: managerObj, salarie: salarieObj });
    }
  }

  getQuestionnaireById(id) {
    QuestionnairesService.getQuestionnaireById(id)
      .then(response => {
        this.setState({
          currentQuestionnaire: response.data,
        })
      })
      .catch(e => {
        console.log("erreur : ", e);
      });
  }

  getReponseByIdCompteRendu(id) {
    ReponsesService.getReponseByIdCompteRendu(id)
      .then(response => {
        this.setState({
          reponses: response.data,
        })
      })
      .catch(e => {
        console.log("erreur : ", e);
      });
  }

  AnswierInterview(e) {
    e.preventDefault();
    this.setState({
      loading: true,
    })
    let repArray = []
    let choses = null;
    let answier = null;
    let object = {};
    let errors = [];
    let formOK = false;
    let repOk = false;
    this.state.currentQuestionnaire.questions.map((question, index) => ((
      choses = null,
      answier = null,
      object = null,
      Object.keys(question.choix).length > 0 ?
        (
          repOk = false,
          Object.keys(question.choix).map((item) => (
            document.getElementById(`reponseChoix${question.id}_${item}`).checked ? (
              choses = document.getElementById(`reponseChoix${question.id}_${item}`).value,
              repOk = true
            ) : ("")
          )),
          repOk ? (
            document.getElementById(`erreurReponseChoix${question.id}`).className = "invisible d-none",
            errors[index] = false
          ) : (
            document.getElementById(`erreurReponseChoix${question.id}`).className = "alert alert-danger",
            errors[index] = true
          )
        ) : (
          document.getElementById(`reponseQuestion${question.id}`).value === null || document.getElementById(`reponseQuestion${question.id}`).value === "" ? (
            answier = null,
            document.getElementById(`erreurReponseQuestion${question.id}`).className = "alert alert-danger",
            errors[index] = true
          ) : (
            answier = document.getElementById(`reponseQuestion${question.id}`).value,
            document.getElementById(`erreurReponseQuestion${question.id}`).className = "invisible d-none",
            errors[index] = false
          )
        ),
      //console.log("question (" + question.id + ") : ", question.intitule, " || answier : ", answier, " || choses : ", choses),
      object = {
        id: this.state.reponses ? this.state.reponses.map(r => {
          if (question.id === r.question.id) {
            return r.id;
          } else
            return null;
        }).join().replace(',', '') : null,
        question: {
          id: question.id,
          intitule: null,
          choix: {},
          version: null,
        },
        compteRendu: { id: this.state.currentInterview.compteRendu.id, statut: "QUESTION_FERME_COMMENTAIRE_OUVERT", },
        reponseSalarie: this.state.user.id === this.state.salarie[0].salarie.id ? answier : null,
        reponseChoixSalarie: this.state.user.id === this.state.salarie[0].salarie.id ? choses : null,
        reponseManager: this.state.user.id === this.state.manager[0].salarie.id ? answier : null,
        reponseChoixManager: this.state.user.id === this.state.manager[0].salarie.id ? choses : null,
        commentaireManager: null,
        commentaireSalarie: null,
        version: null,
      },
      repArray.push(object)
    )));
    for (let index = 0; index < errors.length; index++) {
      if (errors[index] === true) {
        formOK = false;
        break;
      } else {
        formOK = true;
      }
    }

    if (formOK === true) {
      const typeSave = true;//compareDateHighestOrEqualDateCurrent(this.state.currentInterview.dateEntretien);
      swal(typeSave ? "Sauvegarder, vous pourrez toujours modifier vos réponses ultérieurement." : "La sauvegarde est définitive, vous ne pourrez plus modifier vos réponses et ceci ouvre les commentaires.", {
        buttons: typeSave ? { save: { text: "Sauvegarder", value: "save", } } : { savedef: { text: "Sauvegarder définitivement", value: "saveDef", } }
      })
        .then((value) => {
          switch (value) {
            case "save":
              if (this.state.reponses) {
                //put
                ReponsesService.update(repArray)
                  .then(response => {
                    this.setState({
                      reponses: response.data,
                      loading: false,
                    })
                    swal("Mise à jour effectuée.", {
                      icon: "success",
                    });
                    window.setTimeout(() => { this.props.history.goBack() }, 1000)
                  })
                  .catch(e => {
                    swal(`Erreur lors de la mise à jour : ${e.message}.`, {
                      icon: "error",
                    });
                    this.setState({
                      loading: false,
                    })
                  });
              } else {
                //post
                ReponsesService.saveSansChangeStatut(repArray)
                  .then(response => {
                    this.setState({
                      reponses: response.data,
                      loading: false,
                    })
                    swal("Sauvegarde effectuée.", {
                      icon: "success",
                    });
                    window.setTimeout(() => { this.props.history.goBack() }, 1000)
                  })
                  .catch(e => {
                    swal(`Erreur lors de la sauvegarde : ${e.message}.`, {
                      icon: "error",
                    });
                    this.setState({
                      loading: false,
                    })
                  });
              }
              break;
            case "saveDef":
              ReponsesService.save(repArray)
                .then(response => {
                  this.setState({
                    reponses: response.data,
                    loading: false,
                  })
                  swal("Sauvegarde effectuée.", {
                    icon: "success",
                  });
                  window.setTimeout(() => { this.props.history.goBack() }, 1000)
                })
                .catch(e => {
                  swal(`Erreur lors de la sauvegarde : ${e.message}.`, {
                    icon: "error",
                  });
                  this.setState({
                    loading: false,
                  })
                });
              break;
            default:
              this.setState({
                loading: false,
              })
              break;
          }
        });
    } else {
      swal("Erreur dans le formulaire.", {
        icon: "error",
      });
      this.setState({
        loading: false,
      })
    }
  }

  defaultValueTextArea(questionId) {
    if (this.state.manager[0].salarie.id === this.state.user.id) {
      return this.state.reponses.map(rep => {
        if (rep.question.id === questionId) {
          return rep.reponseManager;
        } else
          return null;
      }).join('')
    }

    if (this.state.salarie[0].salarie.id === this.state.user.id) {
      return this.state.reponses.map(rep => {
        if (rep.question.id === questionId) {
          return rep.reponseSalarie;
        } else
          return null;
      }).join('')
    }
  }

  defaultCheckedCheckBox(question, item) {
    if (this.state.manager[0].salarie.id === this.state.user.id) {
      return this.state.reponses.map(rep => {
        if (rep.question.id === question.id) {
          if (rep.reponseChoixManager === parseInt(item)) {
            return true;
          } else
            return false;
        } else
          return null;
      }).join('')
    }

    if (this.state.salarie[0].salarie.id === this.state.user.id) {
      return this.state.reponses.map(rep => {
        if (rep.question.id === question.id) {
          if (rep.reponseChoixSalarie === parseInt(item)) {
            return true;
          } else
            return false;
        } else
          return null;
      }).join('')
    }
  }

  render() {
    const { currentQuestionnaire, loading } = this.state;
    return (
      <>
        <div>
          <label>Questionnaire : {currentQuestionnaire.titre}  </label>
          <form name="AnswierInterview">
            {currentQuestionnaire.questions.map((question, index) => (
              <div key={index}>
                <span className="form-row mt-2">
                  <div className="form-group col-md-12">
                    <label className="h5" name={`question${question.id}`}>
                      {question.intitule}*
                    </label>
                  </div>
                  {Object.keys(question.choix).length > 0 ?
                    <div className="form-group col-md-12">
                      {
                        Object.keys(question.choix).map((item, index) => (
                          <div className="form-check" key={index}>
                            <input className="form-check-input" type="radio" name={`reponseChoix${question.id}`} id={`reponseChoix${question.id}_${item}`} value={item}
                              checked={Boolean(this.defaultCheckedCheckBox(question, item))} />
                            <label className="form-check-label" htmlFor={`reponseChoix${question.id}_${item}`}>
                              {question.choix[item] + " (" + item + ")"}
                            </label>
                          </div>
                        ))
                      }
                      <div className="invisible d-none" id={`erreurReponseChoix${question.id}`} role="alert">Champ obligatoire.</div>
                    </div> :
                    <div className="form-group col-md-12">
                      <textarea className="form-control" placeholder="Votre réponse" id={`reponseQuestion${question.id}`}
                        defaultValue={this.defaultValueTextArea(question.id)} />
                      <div className="invisible d-none" id={`erreurReponseQuestion${question.id}`} role="alert">Champ obligatoire.</div>
                    </div>}
                </span>
                <hr className="my-12" />
              </div>
            ))}
            <CButton type="submit" block color="success" className="mt-1" disabled={loading} onClick={this.AnswierInterview}>
              {loading && <CSpinner size="sm" variant="border" />} Sauvegarder les réponses
            </CButton>
          </form>
        </div>
      </>
    );
  }
}
export default withRouter(AnswerInterview);