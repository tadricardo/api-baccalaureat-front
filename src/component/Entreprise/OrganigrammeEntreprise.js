import { Component } from "react";
import salariesService from "src/services/salaries.service";
import entreprisesService from "src/services/entreprises.service";
import Chart from 'react-google-charts'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CSpinner } from "@coreui/react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
class OrganigrammeEntreprise extends Component {
  constructor(props) {
    super(props);

    this.state = {
      salaries: [{
        nom: "",
        prenom: "",
        email: "",
        motDePasse: "",
        dateNaissance: "",
        telPersonnel: "",
        mobilPersonnel: "",
        telProfessionnel: "",
        mobileProfessionnel: "",
        nationalite: "",
        deptNaissance: "",
        villeNaissance: "",
        numeroSecuriteSocial: "",
        nomPrenomContactUrgence: "",
        numeroContactUrgence: "",
        postes: [{
          id: 0,
          description: null,
          titrePoste: {
            id: 0,
            intitule: null
          }
        }],
        manager: {
          id: 0,
          prenom: null,
          nom: null,
        },
        adresse: {
          id: 0,
          numero: "",
          voie: "",
          complementAdresse: "",
          ville: "",
          codePostal: "",
          pays: "FRANCE",
          version: null
        },
        domaine: {
          id: 0,
          version: null,
        },
        entreprise: {
          id: 0,
          version: null,
        },
        roles: [],
        competences: [],
        version: null,
      }],
      currentEntreprise: {
        id: null,
        nom: "",
        adresse: {
          id: null,
          numero: "",
          voie: "",
          complementAdresse: "",
          ville: "",
          codePostal: "",
          pays: "FRANCE",
          version: null
        },
        version: null
      },
      OrgData: [['Name', 'Manager', 'ToolTip']],
      options: {
        allowHtml: true,
        size: "large",
        //selectionColor: "#d6e9f8",
        allowCollapse: true,
      },
      ifSalaries: false,
    };
  }

  componentDidMount() {
    this.getSalarieByEntreprise(this.props.match.params.id);
    this.getEntreprise(this.props.match.params.id);
  }

  getSalarieByEntreprise(idEntreprise) {

    let orgData = [];
    salariesService.getAllSalariesActifByEntreprise(idEntreprise).then(response => {
      if (response.data.length > 0) {
        response.data.map((s, index) => (
          //poste ou l'email : s.postes.map(p => p.titrePoste.intitule).toString() OU s.email
          s.manager ? orgData[index] = [{ v: s.prenom + " " + s.nom, f: s.prenom + " " + s.nom + "<div style='font-size: x-small;'>" + s.email + "</div>" }, s.id !== s.manager.id ? s.manager.prenom + " " + s.manager.nom : "", s.postes.map(p => p.titrePoste.intitule).toString()] : null
        ))
        this.setState((prevState) => ({
          salaries: response.data,
          ifSalaries: true,
          ...prevState.OrgData,
          OrgData: orgData,
        }));
      } else {
        this.setState({
          ifSalaries: false
        });
      }
    })
      .catch(e => {
        console.log(e);
      });
  }

  getEntreprise(idEntreprise) {
    entreprisesService.getEntrepriseById(idEntreprise)
      .then(response => {
        this.setState({
          currentEntreprise: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }


  render() {
    const { ifSalaries, currentEntreprise, OrgData, options } = this.state;
    return (
      <>
        <CRow>
          <CCol lg={12}>
            <CCard>
              <CCardHeader>
                <h2 className="float-left mt-1">Organigramme de l'entreprise {currentEntreprise.nom}.</h2>
                <Link to={"/entreprises/liste"}><CButton color="info" className="float-right mt-1" title="Revenir à la liste des entreprise?"> Accueil des entreprises </CButton></Link>
              </CCardHeader>
              <CCardBody>
                {ifSalaries ? (
                <div className="container mt-5">
                  <Chart
                    width={'100%'}
                    height={400}
                    chartType="OrgChart"
                    loader={<div className="d-flex justify-content-center"><CSpinner size="sm" variant="border" /></div>}
                    data={OrgData}
                    options={options}
                    rootProps={{ 'data-testid': '1' }}
                  />
                </div>
                ) : <div className="text-info font-weight-bold">Pas de salarié dans cette entreprise</div>}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );

  }
}

export default OrganigrammeEntreprise;