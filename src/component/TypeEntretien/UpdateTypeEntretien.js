import { CAlert, CButton, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import typeEntretienService from "../../services/type-entretien.service";
import TypeEntretienService from "../../services/type-entretien.service";

class UpdateTypeEntretien extends Component {
  constructor(props) {
    super(props);
    this.onChangeTypeEntretien = this.onChangeTypeEntretien.bind(this);
    this.updateTypeEntretien = this.updateTypeEntretien.bind(this);
    this.getTypeEntretien = this.getTypeEntretien.bind(this);
    this.state = {
      currentErrors: {
        title: null,
        titleBool: true
      },
      currentTypeEntretien: {
        id: null,
        titre: ""
      },
      message: "",
      ifError: null,
      loading: false
    };
  }

  componentDidMount() {
    this.getTypeEntretien(this.props.typeEntretienId.id);
  }

  onChangeTypeEntretien(e) {
    const typeEntretien = e.target.value;
    if (typeEntretien === "" || typeEntretien === null || typeEntretien.length === 0) {
      this.setState((prevState) => ({
        currentTypeEntretien: {
          ...prevState.currentTypeEntretien,
          titre: typeEntretien,
        },
        currentErrors: {
          ...prevState.currentErrors,
          title: "Le champ nom est requis.",
          titleBool: true
        }
      }));
    } else {
      this.setState((prevState) => ({
        currentTypeEntretien: {
          ...prevState.currentTypeEntretien,
          titre: typeEntretien,
        },
        currentErrors: {
          ...prevState.currentErrors,
          title: null,
          titleBool: false
        }
      }));
    }
  }

  getTypeEntretien(id) {
    TypeEntretienService.getTypeEntretienById(id)
      .then(response => {
        this.setState({
          currentTypeEntretien: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateTypeEntretien(e) {
    e.preventDefault();
    this.setState({ loading: true })
    if (this.state.currentErrors.titleBool) {
      this.setState({
        message: "Une erreur est présente dans votre formulaire.",
        ifError: true,
        loading: false
      });
    } else {
      typeEntretienService.getTypeEntretienByTitle(this.state.currentTypeEntretien.titre).then(resp => {
        if (resp.data === "") {
          TypeEntretienService.update(this.state.currentTypeEntretien)
            .then(response => {
              this.setState({
                currentTypeEntretien: response.data,
                message: "Modification bien prise en compte ! Redirection vers la liste des types des entretiens.",
                ifError: false
              });
              window.setTimeout(() => { this.props.history.push('/type-entretien/liste') }, 2500);
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
            message: "Ce type d'entretien existe déjà.",
            ifError: true,
            loading: false
          });
        }
      })
    }
  }

  render() {
    const { currentTypeEntretien, currentErrors, message, ifError, loading } = this.state;
    return (
      <div>
        <div className="edit-form">
          <form name="updateTypeEntretien" onSubmit={this.updateTypeEntretien}>
            <div className="form-group">
              <label htmlFor="typeEntretien">Nom du type d'entretien</label>
              <input type="text" name="typeEntretien" className="form-control" id="typeEntretien" value={currentTypeEntretien.titre} onChange={this.onChangeTypeEntretien} />
              <span className="text-danger">{currentErrors.title}</span>
            </div>
            <CButton type="submit" block color="info" disabled={loading}>
              {loading && <CSpinner size="sm" variant="border" />} Modifier cet type d'entretien
            </CButton>
            <Link to={"/type-entretien/liste"} className="withoutUnderlane">
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

export default withRouter(UpdateTypeEntretien)