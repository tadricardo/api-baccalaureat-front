import jwtDecode from 'jwt-decode';
import { React, useState, useEffect } from 'react';
import salariesService from 'src/services/salaries.service';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
  CTabs
} from "@coreui/react";
import { Link } from 'react-router-dom';
import FileSaver from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import formationsService from 'src/services/formations.service';
import EntretienDashboard from '../Dashboard/entretienDashboard';
import SanctionDisciplinaire from '../SanctionDisciplinaire/SanctionDisciplinaire';
import { ReactPaginate } from 'react-paginate';
import moment from 'moment';
import jwt_decode from 'jwt-decode';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';



const _VieProfessionnelle = (props) => {

  const [salarie, setSalarie] = useState([])
  const isRole = jwt_decode(JSON.parse(localStorage.getItem('token'))).roles
  // conges
  const [conges, setConges] = useState([])
  const [orderConge, setOrderConge] = useState("DESC")
  const [colConge, setColConge] = useState("dateDebut")
  const [pageCountConge, setPageCountConge] = useState(0)
  const perPageConge = 5
  const [offsetConge, setOffsetConge] = useState(0)

  // visites medicales
  const [visitesMedicales, setVisitesMedicales] = useState([])
  const [orderVM, setOrderVM] = useState("DESC")
  const [colVM, setColVM] = useState("dateVisite")
  const [pageCountVM, setPageCountVM] = useState(0)
  const perPageVM = 5
  const [offsetVM, setOffsetVM] = useState(0)

  // formation
  const [formations, setFormations] = useState([])
  const [orderFormation, setOrderFormation] = useState("DESC")
  const [colFormation, setColFormation] = useState("dateVisite")
  const [pageCountFormation, setPageCountFormation] = useState(0)
  const perPageFormation = 5
  const [offsetFormation, setOffsetFormation] = useState(0)

  // comptences
  const [competences, setCompetences] = useState([])
  const [pageCountCompetence, setPageCountCompetence] = useState(0)
  const perPageCompetence = 5
  const [offsetCompetence, setOffsetCompetence] = useState(0)
  //const id = jwtDecode(localStorage.getItem('token')).id;
  // const acces = jwtDecode(localStorage.getItem('acces'));
  const [poste, setPoste] = useState()
  const id = parseInt(props.parametres.idSalarie);
  const user = jwtDecode(localStorage.getItem('token'));
  const history = useHistory();

  if (!((user.id === id) || (user.roles === "RH" || user.roles === "ADMIN"))) {
    history.push("/salaries/dossiers-personnel/" + user.id)
  }

  useEffect(() => {
    salariesService.getSalarieById(id).then((res) => {
      setSalarie(res.data);
      setCompetences(res.data.competences.slice(offsetCompetence, offsetCompetence + perPageCompetence));
      setPageCountCompetence(Math.ceil(res.data.competences.length / perPageCompetence));
      setConges(res.data.conges.slice(offsetConge, offsetConge + perPageConge));
      setPageCountConge(Math.ceil(res.data.conges.length / perPageConge));
      setVisitesMedicales(res.data.visitesMedicales.slice(offsetVM, offsetVM + perPageVM));
      setPageCountVM(Math.ceil(res.data.visitesMedicales.length / perPageVM));
      setPoste(res.data.postes[0]);
      setFormations(res.data.formations.slice(offsetFormation, offsetFormation + perPageFormation));
      setPageCountFormation(Math.ceil(res.data.formations.length / perPageFormation));
    });

    formationsService.getFormationsBySalarieId(id, 0, 10).then(res => {
      setFormations(res.data);
    });

  }, [id, offsetFormation, perPageFormation, offsetVM, perPageVM, offsetConge, perPageConge, offsetCompetence, perPageCompetence]);

  const getPaginatedItems = (items, type) => {
    switch (type) {
      case 1:
        return items.slice(offsetCompetence, offsetCompetence + perPageCompetence);
      case 2:
        return items.slice(offsetFormation, offsetFormation + perPageFormation);
      case 4:
        return items.slice(offsetConge, offsetConge + perPageConge);
      case 5:
        return items.slice(offsetVM, offsetVM + perPageVM);
      default:
        return false;
    }
  }

  //------------Conges----------------------------------
  const congeSort = (column) => {
    //orderConge = column === colConge && orderConge === "ASC" ? "DESC" : "ASC";
    //colConge = column;
    setOrderConge(column === colConge && orderConge === "ASC" ? "DESC" : "ASC");
    setColConge(column);
    salariesService.getAllCongeByIdSalarieAndKeyword(salarie.id, 0, 5, "", colConge, orderConge, "")
      .then((res) => {
        setConges(res.data);
      })
  }

  const handlePageClickConge = (data) => {
    let selected = data.selected;
    let offset = Math.ceil(selected * perPageConge);
    setOffsetConge(offset);
    setConges(getPaginatedItems(salarie.conges, 4));
  }

  const downloadJustificatifConge = (id) => {
    salariesService.getJustificatifConge(id).then(res => {
      const filename = res.headers['content-disposition'].split('filename=')[1];
      const blob = new Blob([res.data]);
      FileSaver.saveAs(blob, `${filename}`);
    }).catch(e =>
      console.log("Erreur lors du téléchargement : ", e),
    );
  }

  const nomTypeConge = (typeConge) => {
    if (typeConge === "CONGE_PAYE")
      return "Congé payé";
    if (typeConge === "CONGE_PAYE_MONETISE")
      return "Congé payé monétisé";
    if (typeConge === "CONGE_EVENEMENT_FAMILIAL")
      return "Congé évènement familial";
    if (typeConge === "CONGE_MATERNITE")
      return "Congé maternité";
    if (typeConge === "CONGE_PATERNITE")
      return "Congé parternité";
    if (typeConge === "CONGE_PARENTAL")
      return "Congé parental";
    if (typeConge === "CONGE_DE_FORMATION_PROFESSIONNELLE")
      return "Congé de formation professionnelle";
    if (typeConge === "CONGE_POUR_PREPARATION_EXAMEN")
      return "Congé pour préparation d'un éxamen";
    if (typeConge === "ABSENCE_NON_REMUNEREE")
      return "Absence non rémunérée";
    if (typeConge === "ARRET_MALADIE")
      return "Arrêt maladie";
    if (typeConge === "ACCIDENT_DU_TRAVAIL")
      return "Accident du travail";
    if (typeConge === "RTT_CHOISI")
      return "RTT choisi";
    if (typeConge === "RTT_IMPOSE")
      return "RTT imposé";
    if (typeConge === "RTT_MONETISE")
      return "RTT monétisé";
    if (typeConge === "REPOS_CADRE")
      return "Repos cadre";
    if (typeConge === "REGULARISATION_RTT")
      return "Régularisation RTT";
    if (typeConge === "CONGE_RECUPERATION")
      return "Congé récupération";
    if (typeConge === "CONGE_DE_SOLIDARITE")
      return "Congé de salidarité";
    if (typeConge === "CONGE_SANS_SOLDE")
      return "Congé sans solde";
    if (typeConge === "CONGE_SABBATIQUE")
      return "Congé sabbatique";
    if (typeConge === "COMPTE_EPARGNE_TEMPS")
      return "Compte épargne temps";
  }

  //------------Visites medicales----------------------------------
  const visiteMedicaleSort = (column) => {
    setOrderVM(column === colVM && orderVM === "ASC" ? "DESC" : "ASC");
    setColVM(column);
    salariesService.getAllVisiteMedicaleByIdSalarieAndKeyword(salarie.id, 0, 5, null, colVM, orderVM)
      .then((res) => {
        setVisitesMedicales(res.data);
      })
  }

  const nomTypologieVisiteRdvRealise = (type) => {
    if (type === "VISITE_EMBAUCHE")
      return "Visite d'embauche";
    if (type === "VISITE_SUIVI")
      return "Visite de suivi";
    if (type === "VISITE_PRE_REPRISE")
      return "Visite de préreprise";
    if (type === "VISITE_REPRISE")
      return "Visite de reprise";
    if (type === "VISITE_DEMANDE_EMPLOYEUR")
      return "Visite à la demande de l'employeur";
    if (type === "SALARIE_PRESENT")
      return "Salarié présent";
    if (type === "SALARIE_ABSENT")
      return "Salarié absent";
  }

  const handlePageClickVisiteMedicale = (data) => {
    let selected = data.selected;
    setOffsetVM(Math.ceil(selected * perPageVM));
    setVisitesMedicales(getPaginatedItems(visitesMedicales, 5));
  }

  //------------Competence----------------------------------
  const handlePageClickCompetence = (data) => {
    let selected = data.selected;
    let offset = Math.ceil(selected * perPageCompetence);
    setOffsetCompetence(offset);
    setCompetences(this.getPaginatedItems(competences, 1));
  };

  //------------Formation----------------------------------
  const handlePageClickFormation = (data) => {
    let selected = data.selected;
    let offset = Math.ceil(selected * perPageFormation);
    setOffsetFormation(offset);
    setFormations(getPaginatedItems(formations, 2));
  }

  const formationSort = (column) => {
    setOrderFormation(column === colFormation && orderFormation === "ASC" ? "DESC" : "ASC");
    setColFormation(column);

    formationsService.getFormationsBySalarieId(salarie.id, 0, 5, colFormation, orderFormation)
      .then((res) => {
        setFormations(res.data);
      })
  }

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h3> {salarie.prenom + " " + salarie.nom}</h3>
            </CCardHeader>
            <CCardBody>
              <CTabs>
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink>
                      Mes congés
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Visites médicales
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Formations
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Compétences
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Mes entretiens
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Mes évènements personnels
                    </CNavLink>
                  </CNavItem>

                  <CNavItem>
                    <CNavLink>
                      Elements contractuels
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Sanctions disciplinaires
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      Départ
                    </CNavLink>
                  </CNavItem>
                </CNav>
                <CTabContent>
                  {/* congés */}
                  <CTabPane>
                    <CCard>
                      <CCardHeader>
                        <CRow>
                          <CCol lg={10}>
                            <h4><FontAwesomeIcon icon={["fas", "align-justify"]} /> Congés</h4>
                          </CCol>
                          <CCol lg={2}>
                            <Link to={{ pathname: "/salaries/vie-professionnelle/" + salarie.id + "/ajout-conge", state: salarie }}>
                              <CButton type="button" block color="info">
                                Ajouter un congé
                              </CButton>
                            </Link>
                          </CCol>
                        </CRow>
                      </CCardHeader>
                      <CCardBody>
                        <div className="table-responsive">
                          <table className="table table-hover table-striped table-bordered">
                            <thead title="Cliquer pour trier">
                              <tr>
                                <th onClick={() => congeSort("dateDebut")}>Date de début</th>
                                <th onClick={() => congeSort("commenceApresMidi")}>Commence l'après-midi</th>
                                <th onClick={() => congeSort("dateFin")}>Date de fin</th>
                                <th onClick={() => congeSort("finiApresMidi")}>Fini l'après-midi</th>
                                <th onClick={() => congeSort("duree")}>Durée (en Jour)</th>
                                <th onClick={() => congeSort("typeConge")}>type de congé</th>
                                <th>Commentaire</th>
                                <th onClick={() => congeSort("lienJustificatif")}>Justificatif</th>
                              </tr>
                            </thead>
                            <tbody>
                              {conges &&
                                conges.length !== 0 ?
                                conges.map((conge) =>
                                  <tr key={conge.id}>
                                    <td>{moment(conge.dateDebut).format("DD-MM-YYYY")}</td>
                                    <td>{conge.commenceApresMidi ? "OUI" : "NON"}</td>
                                    <td>{moment(conge.dateFin).format("DD-MM-YYYY")}</td>
                                    <td>{conge.finiApresMidi ? "OUI" : "NON"}</td>
                                    <td>{conge.duree}</td>
                                    <td>{nomTypeConge(conge.typeConge)}</td>
                                    <td>{conge.commentaire}</td>
                                    <td>{conge.lienJustificatif !== null && <button className="btn btn-link" onClick={() => downloadJustificatifConge(conge.id)}>Justificatif</button>}</td>
                                  </tr>
                                ) : <tr><td colSpan="8" className="text-center font-weight-bold">Aucun congé</td></tr>}
                            </tbody>
                          </table>
                        </div>
                        {pageCountConge > 1 && (<ReactPaginate
                          name="test"
                          previousLabel={'Précédent'}
                          nextLabel={'Suivant'}
                          breakLabel={'...'}
                          pageCount={pageCountConge} // count Total des congés
                          pageRangeDisplayed={5}
                          marginPagesDisplayed={2}
                          onPageChange={handlePageClickConge}
                          containerClassName={"pagination"}
                          subContainerClassName={"pages pagination"}
                          activeClassName={"active"}
                          pageLinkClassName="page-link"
                          breakLinkClassName="page-link"
                          nextLinkClassName="page-link"
                          previousLinkClassName="page-link"
                          pageClassName="page-item"
                          breakClassName="page-item"
                          nextClassName="page-item"
                          previousClassName="page-item"
                        />)}
                      </CCardBody>
                    </CCard>
                  </CTabPane>
                  {/*Visites medicales*/}
                  <CTabPane>
                    <CCard>
                      <CCardHeader>
                        <CRow>
                          <CCol lg={10}>
                            <h4><FontAwesomeIcon icon={["fas", "align-justify"]} /> Visites Médicales</h4>
                          </CCol>
                          <CCol lg={2}>
                            {(isRole === "RH" || isRole === "ADMIN") &&
                              <Link to={{ pathname: "/salaries/vie-professionnelle/" + salarie.id + "/ajout-visite-medicale", state: salarie }}>
                                <CButton type="button" block color="info">
                                  Ajouté une visite médicale
                                </CButton>
                              </Link>
                            }
                          </CCol>
                        </CRow>
                      </CCardHeader>
                      <CCardBody>
                        <div className="table-responsive">
                          <table className="table table-hover table-striped table-bordered">
                            <thead title="Cliquer pour trier">
                              <tr>
                                <th onClick={() => visiteMedicaleSort("dateVisite")}>Date de la visite</th>
                                <th onClick={() => visiteMedicaleSort("dateFinValidite")}>Date de fin de validitée</th>
                                <th onClick={() => visiteMedicaleSort("typologieVisite")}>Typologie de la visite</th>
                                <th onClick={() => visiteMedicaleSort("nomCentreMedical")}>Centre médical</th>
                                <th>Commentaire</th>
                                <th onClick={() => visiteMedicaleSort("rdvRealise")}>Rendez-vous réalisé ?</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {visitesMedicales &&
                                visitesMedicales.length !== 0 ?
                                visitesMedicales.map((vm) =>
                                  <tr key={vm.id}>
                                    <td>{moment(vm.dateVisite).format("DD-MM-YYYY HH:mm")}</td>
                                    <td>{moment(vm.dateFinValidite).format("DD-MM-YYYY")}</td>
                                    <td>{nomTypologieVisiteRdvRealise(vm.typologieVisite)}</td>
                                    <td>{vm.nomCentreMedical}</td>
                                    <td>{vm.commentaire}</td>
                                    <td>{nomTypologieVisiteRdvRealise(vm.rdvRealise)}</td>
                                    <td>{(isRole === "RH" || isRole === "ADMIN") &&
                                      <Link to={{ pathname: `/salaries/vie-professionnelle/${salarie.id}/modifier-visite-medicale/${vm.id}`, state: salarie }}>
                                        <CButton type="button" block color="info">
                                          Modifier la visite médicale
                                        </CButton>
                                      </Link>
                                    }</td>
                                  </tr>
                                ) : <tr><td colSpan="8" className="text-center font-weight-bold">Aucune visite médicale</td></tr>}
                            </tbody>
                          </table>
                        </div>
                        {pageCountVM > 1 && (<ReactPaginate
                          name="test"
                          previousLabel={'Précédent'}
                          nextLabel={'Suivant'}
                          breakLabel={'...'}
                          pageCount={pageCountVM} // count Total des visite médicale
                          pageRangeDisplayed={5}
                          marginPagesDisplayed={2}
                          onPageChange={handlePageClickVisiteMedicale}
                          containerClassName={"pagination"}
                          subContainerClassName={"pages pagination"}
                          activeClassName={"active"}
                          pageLinkClassName="page-link"
                          breakLinkClassName="page-link"
                          nextLinkClassName="page-link"
                          previousLinkClassName="page-link"
                          pageClassName="page-item"
                          breakClassName="page-item"
                          nextClassName="page-item"
                          previousClassName="page-item"
                        />)}
                      </CCardBody>
                    </CCard>
                  </CTabPane>

                  {/*formation  */}
                  <CTabPane>
                    <CCard>
                      <CCardHeader>
                        <CRow>
                          <CCol>
                            <h4><FontAwesomeIcon icon={["fas", "align-justify"]} />
                              Liste des Formations</h4>
                          </CCol>
                        </CRow>
                      </CCardHeader>
                      <CCardBody>
                        <div className="table-responsive">
                          <table className="table table-striped table-hover">
                            <thead>
                              <tr>
                                <th onClick={() => formationSort("titre")}>Titre</th>
                                <th onClick={() => formationSort("dateDebut")}>Date de début </th>
                                <th onClick={() => formationSort("dateFin")}>Date de fin</th>
                                <th onClick={() => formationSort("duree")}>Volume horaire</th>
                                <th onClick={() => formationSort("prix")}>Prix <small>(HT)</small></th>
                              </tr>
                            </thead>
                            <tbody>
                              {formations &&
                                formations.length !== 0 ?
                                formations.map((f) => {
                                  return (
                                    <tr key={f.id}>
                                      <td><Link to={`/formations/voir/${f.id}`}>{f.titre}</Link></td>
                                      <td>{moment(f.dateDebut).format("ll")}</td>
                                      <td>{moment(f.dateFin).format("ll")}</td>
                                      <td>{f.duree}</td>
                                      <td>{f.prix}</td>
                                    </tr>
                                  );
                                }) : (<tr><td colSpan="5" className="text-center font-weight-bold">Aucune formation</td></tr>)}
                            </tbody>
                          </table>
                        </div>
                        {pageCountFormation > 1 && (<ReactPaginate
                          name="test"
                          previousLabel={'Précédent'}
                          nextLabel={'Suivant'}
                          breakLabel={'...'}
                          pageCount={pageCountFormation}
                          pageRangeDisplayed={5}
                          marginPagesDisplayed={2}
                          onPageChange={handlePageClickFormation}
                          containerClassName={"pagination"}
                          subContainerClassName={"pages pagination"}
                          activeClassName={"active"}
                          pageLinkClassName="page-link"
                          breakLinkClassName="page-link"
                          nextLinkClassName="page-link"
                          previousLinkClassName="page-link"
                          pageClassName="page-item"
                          breakClassName="page-item"
                          nextClassName="page-item"
                          previousClassName="page-item"
                        />)}
                      </CCardBody>
                    </CCard>
                  </CTabPane>

                  {/* compétences */}
                  <CTabPane>
                    <CCardBody>
                      <div className="table-responsive">
                        <table className="table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>Nom de la compétence</th>
                              <th>Note</th>
                            </tr>
                          </thead>
                          <tbody>
                            {competences &&
                              competences.length !== 0 ?
                              competences.map((c) => {
                                return (
                                  <tr key={c.id}>
                                    <td>{c.competence.nom}</td>
                                    <td>{c.note}</td>
                                  </tr>
                                );
                              }) : (<tr><td colSpan="2" className="text-center font-weight-bold">Aucune compétence</td></tr>)
                            }
                          </tbody>
                        </table>
                      </div>
                      {pageCountCompetence > 1 && (<ReactPaginate
                        previousLabel={'Précédent'}
                        nextLabel={'Suivant'}
                        breakLabel={'...'}
                        pageCount={pageCountCompetence}
                        pageRangeDisplayed={5}
                        marginPagesDisplayed={2}
                        onPageChange={handlePageClickCompetence}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                        pageLinkClassName="page-link"
                        breakLinkClassName="page-link"
                        nextLinkClassName="page-link"
                        previousLinkClassName="page-link"
                        pageClassName="page-item"
                        breakClassName="page-item"
                        nextClassName="page-item"
                        previousClassName="page-item"
                      />)}
                    </CCardBody>
                  </CTabPane>
                  {/* Entretiens */}
                  <CTabPane>
                    <EntretienDashboard />
                  </CTabPane>
                  {/* Evenement personnels */}
                  <CTabPane>
                    <p>En cours</p>
                  </CTabPane>
                  {/* Element contratuels */}
                  <CTabPane>
                    <p>En cours</p>
                  </CTabPane>
                  {/* sanction disciplinaires */}
                  <CTabPane>
                    <CCardBody>
                      <SanctionDisciplinaire idSalarie={id} />
                    </CCardBody>
                  </CTabPane>
                  {/* Départ */}
                  <CTabPane>
                    <CCardBody>
                      <div className='text-center'>
                        <h4>Date de départ</h4>
                        {poste ? moment(poste.dateFin).format("LL") : 'Pas de date de départ'}
                      </div>
                    </CCardBody>
                  </CTabPane>
                </CTabContent>
              </CTabs>
            </CCardBody>
          </CCard>
        </CCol >
      </CRow >
    </>
  );
};

export default _VieProfessionnelle;