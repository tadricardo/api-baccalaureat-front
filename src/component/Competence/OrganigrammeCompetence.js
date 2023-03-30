import { CButton, CCard, CCardBody, CCardHeader, CCol, CListGroupItem, CRow } from "@coreui/react";
import { Component } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import jwt_decode from 'jwt-decode';
import competenceService from "src/services/competence.service";
import salariesService from "../../services/salaries.service";

class OrganigrammeCompetence extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      acces: null,
      salaries: [{
        nom: null,
        prenom: null,
        email: null,
        competences: [{
          id: 0,
          note: null,
          competence: {
            id: 0,
            nom: null,
            domaines: [{
              id: 0,
              titre: null,
            }]
          }
        }]
      }],
      competences: [{
        id: 0,
        nom: null,
        domaines: [{
          id: 0,
          titre: null,
        }]
      }],
    };
  }

  componentDidMount() {
    const token = JSON.parse(localStorage.getItem('token'));
    const user = jwt_decode(token);
    this.setState({ user: user })
    if(user.roles === "MANAGER"){
      this.getAllSalarieByManager(user);
    } else {
      this.getAllSalarie();
    }
    this.getAllCompetences();
  }

  getAllSalarie() {
    salariesService.getAll()
      .then((response) => {

        this.setState((prevState) => ({
          salaries: response.data,
        }));
      }).catch((e) => {
        console.log(e);
      });
  }

  getAllSalarieByManager(user) {
    salariesService.getAllSalarieByIdManager(user.id)
      .then((response) => {

        this.setState((prevState) => ({
          salaries: response.data,
        }));
      }).catch((e) => {
        console.log(e);
      });
  }

  getAllCompetences() {
    competenceService.getAllCompetence()
      .then((response) => {
        this.setState({ competences: response.data });
      }).catch((e) => {
        console.log(e);
      });
  }

  appearDisappearSection = idComp => {
    document.getElementById(`compSal_${idComp}`).className === "d-none" ? document.getElementById(`compSal_${idComp}`).className = "block" : document.getElementById(`compSal_${idComp}`).className = "d-none";
  }

  render() {
    const { salaries, competences } = this.state;
    
    return (
      <>
        <CRow>
          <CCol lg={12}>
            <CCard>
              <CCardHeader>
                <h2 className="float-left">Organigramme des competences.</h2>
                <Link to={"/competence/liste"}><CButton color="info" className="float-right" title="Revenir à la liste des entreprise?"> Accueil des compétences </CButton></Link>
              </CCardHeader>
              <CCardBody>
                <div className="mt-1">
                  {competences.map((c, i) => (
                    <ul className="list-unstyled" key={i}>
                      <CListGroupItem className="font-weight-bold mb-1 btn btn-info" onClick={() => this.appearDisappearSection(c.id)} color="info">{c.nom}</CListGroupItem>
                      <ul id={`compSal_${c.id}`} className="d-none">
                        {salaries.map((s) => (
                          s.competences.map((c2, index) => (
                            c2.competence.id === c.id && (
                              <li  key={`sal_${index}`} style={{listStyleType: "disc"}}>{s.prenom + " " + s.nom} - <span className='font-italic'>{c2.note}</span></li>
                            )))
                        ))}
                      </ul>
                    </ul>
                  ))}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );

  }
}

export default OrganigrammeCompetence;