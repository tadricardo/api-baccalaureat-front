import { CAlert, CButton, CSpinner, CSelect } from "@coreui/react";
import React, { Component } from "react";
import { withRouter } from "react-router";
import QuestionnaireService from "../../services/questionnaire.service";
import TypeEntretienService from "src/services/type-entretien.service";
import { Link } from "react-router-dom";

class CreateQuestionnaire extends Component {
  constructor(props) {
    super(props);
    this.onChangeQuestionnaire = this.onChangeQuestionnaire.bind(this);
    this.createQuestionnaire = this.createQuestionnaire.bind(this);
    this.getTypeEntretien = this.getTypeEntretien.bind(this);
    this.onChangeTypeEntretien = this.onChangeTypeEntretien.bind(this);
    this.state = {
      typesEntretien: [],
      currentErrors: {
        title: null,
        titleBool: true,
        typeEntretien: null,
        typeEntretienBool: true
      },
      currentQuestionnaire: {
        id: null,
        titre: null,
        typeEntretien: {
          id: null
        }
      },
      message: "",
      ifError: null,
      loading: false
    };
  }

  componentDidMount() {
    this.getTypeEntretien();
  }

  getTypeEntretien() {
    TypeEntretienService.getAllTypeEntretien()
      .then(response => {
        this.setState({
          typesEntretien: response.data,
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  onChangeTypeEntretien(e) {
    const idTypeEntretien = e.target.value;
    if ("0" !== idTypeEntretien) {
      this.setState((prevState) => ({
        currentQuestionnaire: {
          ...prevState.currentQuestionnaire,
          typeEntretien: {
            id: idTypeEntretien
          }
        },
        currentErrors: {
          ...prevState.currentErrors,
          typeEntretien: "",
          typeEntretienBool: false
        }
      }))
    } else {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          typeEntretien: "Le champ type entretien est requis.",
          typeEntretienBool: true
        }
      }));
    }
  }

  onChangeQuestionnaire(e) {
    const titreQuestionnaire = e.target.value;
    if (titreQuestionnaire === "" || titreQuestionnaire === null || titreQuestionnaire.length === 0) {
      this.setState((prevState) => ({
        currentQuestionnaire: {
          ...prevState.currentQuestionnaire,
          titre: titreQuestionnaire,
        },
        currentErrors: {
          ...prevState.currentErrors,
          title: "Le champ titre est requis.",
          titleBool: true
        }
      }));
    } else {
      this.setState((prevState) => ({
        currentQuestionnaire: {
          ...prevState.currentQuestionnaire,
          titre: titreQuestionnaire,
        },
        currentErrors: {
          ...prevState.currentErrors,
          title: null,
          titleBool: false
        }
      }));
    }
  }

  createQuestionnaire(e) {
    e.preventDefault();
    this.setState({ loading: true })
    if (this.state.currentErrors.titleBool || this.state.currentErrors.typeEntretienBool) {
      this.setState({
        message: "Une erreur est présente dans votre formulaire.",
        ifError: true,
        loading: false
      });
    } else {
      QuestionnaireService.getQuestionnaireByTitleAndIdTypeEntretien(this.state.currentQuestionnaire.titre, this.state.currentQuestionnaire.typeEntretien.id).then(resp => {
        if (resp.data === "") {
          QuestionnaireService.save(this.state.currentQuestionnaire)
            .then(response => {
              this.setState({
                currentQuestionnaire: response.data,
                message: "Création bien prise en compte ! Redirection vers la liste des questionnaires.",
                ifError: false
              });
              window.setTimeout(() => { this.props.history.push('/questionnaire/liste') }, 2500);
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
            message: "Ce questionnaire existe déjà.",
            ifError: true,
            loading: false
          });
        }
      })

    }
  }

  render() {
    const { currentQuestionnaire, currentErrors, message, ifError, loading, typesEntretien } = this.state;

    return (
      <div>
        <div className="edit-form">
          <form name="createQuestionnaire" onSubmit={this.createQuestionnaire}>
            <div className="form-group">
              <label htmlFor="questionnaire">Créer un nouveau questionnaire</label>
              <input type="text" className="form-control" id="questionnaire" placeholder="Saisir un titre de questionnaire" value={currentQuestionnaire.titre || ""} onChange={this.onChangeQuestionnaire} />
              <span className="text-danger">{currentErrors.title}</span>
            </div>
            <div className="form-group">
              <label htmlFor="typeEntretien">Type entretien *</label>
              <CSelect custom name="typeEntretien" id="typeEntretien" onChange={this.onChangeTypeEntretien} required>
                <option value="0">Veuillez sélectionner un type d'entretien</option>
                {typesEntretien.map((type, key) => (
                  <option key={key} value={type.id}>
                    {type.titre}
                  </option>
                ))}
              </CSelect>
              <span className="text-danger">{currentErrors.typeEntretien}</span>
            </div>
            <CButton type="submit" block color="info" disabled={loading}>
              {loading && <CSpinner size="sm" variant="border" />} Créer un questionnaire
            </CButton>
            <Link to={"/questionnaire/liste"} className="withoutUnderlane">
              <CButton className="mt-1" block color="danger" title="Vous voulez annuler ?">
                Annuler
              </CButton>
            </Link>
          </form>
          {ifError != null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
        </div>
      </div>
    );
  }
}

export default withRouter(CreateQuestionnaire);