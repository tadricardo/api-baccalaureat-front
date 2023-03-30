import { CAlert, CButton, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import TypeEntretienService from "src/services/type-entretien.service";

class CreateTypeEntretien extends Component {
  constructor(props) {
    super(props);
    this.onChangeTypeEntretien = this.onChangeTypeEntretien.bind(this);
    this.createTypeEntretien = this.createTypeEntretien.bind(this);

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

  createTypeEntretien(e) {
    e.preventDefault();
    this.setState({ loading: true })
    if (this.state.currentErrors.titleBool) {
      this.setState({
        message: "Une erreur est présente dans votre formulaire.",
        ifError: true,
        loading: false
      });
    } else {
      TypeEntretienService.getTypeEntretienByTitle(this.state.currentTypeEntretien.titre).then(resp => {
        if (resp.data === "") {
          TypeEntretienService.save(this.state.currentTypeEntretien)
            .then(response => {
              this.setState({
                currentTypeEntretien: response.data,
                message: "Création bien prise en compte ! Redirection vers la liste de type d'entretien.",
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
          <form name="createTypeEntretien" onSubmit={this.createTypeEntretien}>
            <div className="form-group">
              <label htmlFor="typeEntretien">Créer un nouveau type d'entretien</label>
              <input type="text" className="form-control" id="typeEntretien" placeholder="Saisir un type d'entretien" value={currentTypeEntretien.titre} onChange={this.onChangeTypeEntretien} />
              <span className="text-danger">{currentErrors.title}</span>
            </div>
            <CButton type="submit" block color="info" disabled={loading}>
              {loading && <CSpinner size="sm" variant="border" />} Créer un type d'entretien
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

export default withRouter(CreateTypeEntretien);