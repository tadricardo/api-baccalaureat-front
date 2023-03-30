import { CButton } from '@coreui/react';
import { faCloudDownloadAlt, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import ReactPaginate from 'react-paginate';
import { withRouter } from 'react-router';
import planActivtyService from 'src/services/planActivity.service';
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { connect } from 'react-redux';
import swal from 'sweetalert';
class MyListActivityPlan extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.retrievePlans = this.retrievePlans.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.exportExcel = this.exportExcel.bind(this);
    this.ifdelete = this.ifdelete.bind(this);
    this.state = {
      nomSalarie: "",
      salaries: {},
      year: new Date(),
      lstActivityPlan: [
        {
          id: 0,
          year: 0,
          lstActivity: [],
          salarie: {
            id: 0,
            nom: null,
            prenom: null,
            email: null,
            telPersonnel: null,
            mobilPersonnel: null,
            adresse: {},
            dateNaissance: null,
            telProfessionnel: null,
            mobileProfessionnel: null,
            domaine: {},
            competences: [],
            entreprise: {},
            formations: [],
            postes: [
              {
                id: 0,
                titrePoste: {},
                salarie: {},
                typeContrat: {},
                dateDebut: null,
                dateFin: null,
                volumeHoraire: 0,
                volumeJournalier: 0,
                manager: {
                  id: 0,
                  nom: null,
                  prenom: null,
                  email: null,
                  version: 0
                },
                fichierContrat: null,
                lieuTravail: {},
                description: null,
                competencesRequises: [],
                maitreApprentissage: null,
                domaine: {},
                version: 0

              }
            ],
            signatureBase64: null,
            version: 0
          },
          version: 0
        }

      ],
      itemsPerPage: 10,
      currentPage: 0,
      pageCount: 0,
      searchExpression: "",
      message: "",
      ifError: null,
      loading: false,
      idManager: 0,
      idUser: this.props.idUser
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.retrievePlans();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  retrievePlans() {
    planActivtyService.count(this.state.idUser === null ? undefined : this.state.idUser, undefined).then((resp) => {
      let nbPage = Math.ceil(resp.data / this.state.itemsPerPage)
      this.setState({ pageCount: nbPage })
    }).catch((e) => { console.log(e) });
    planActivtyService.getBySalarie(this.state.idUser, this.state.currentPage, this.state.itemsPerPage).then((response) => {
      this.setState({
        lstActivityPlan: response.data,
        ifError: false,
        loading: false
      });
    })
      .catch((e) => {
        console.log(e);
      });

  }

  handlePageClick = (data) => {
    let selected = data.selected;
    this.setState({ currentPage: selected }, () => {
      this.retrievePlans();
    });
  };

  ifdelete(plan) {
    swal({
      title: "Êtes-vous sûrs ?",
      text: "Voulez-vous supprimer ce plan d'activité ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        planActivtyService.delete(plan.id)
          .then((resp) => {
            swal("Suppression bien prise en compte !", {
              icon: "success",
            });
            this.setState({
              lstActivityPlan: this.state.lstActivityPlan.filter(
                (p) => p.id !== plan.id
              ),
            });
          })
          .catch((e) => {
            this.setState({
              message: e.message,
            });
          });
      }
    });
  }

  exportExcel(paa) {
    planActivtyService.export(paa.id).then((response) => {
      const filename = response.headers['content-disposition'].split('filename=')[1];
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}`);
      document.body.appendChild(link);
      link.click();
    });
  }

  render() {
    const { lstActivityPlan, loading, pageCount, currentPage } = this.state;
    return (
      <>
        <h3>Mes plans annuels</h3>
        <div className="row mt-4">
          <div className="col-lg-12 table-responsive">
            <table className="table table-hover table-striped table-bordered">
              <thead>
                <tr>
                  <th>Année</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<tr><td colSpan="6" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                  lstActivityPlan.length !== 0 ?
                    lstActivityPlan.map(plan =>
                      plan.id !== 0 && (
                        <tr key={plan.id}>
                          <td>{plan.year}</td>
                          <td>
                            <CButton className="mr-2" to={"/plan-annuel/voir/" + plan.id} color="info" title="Vous voulez voir cette ligne ?"><FontAwesomeIcon icon={faSearch} /> Voir </CButton>
                            <CButton className="mr-2" to={"/plan-annuel/modification/" + plan.id} color="info" title="Vous voulez modifier cette ligne ?"><FontAwesomeIcon icon={faEdit} /> Editer</CButton>
                            <CButton className="mr-2" color="primary" onClick={() => this.exportExcel(plan)} title="Vous voulez exporter ce plan en format excel ?">
                              <FontAwesomeIcon icon={faCloudDownloadAlt} /> Export en format excel
                            </CButton>
                            <CButton color="danger" onClick={() => this.ifdelete(plan)} title="Vous voulez supprimer cette ligne ?">
                              <FontAwesomeIcon icon={faTrash} /> Supprimer
                            </CButton>
                          </td>
                        </tr>)
                    ) : (<tr><td colSpan="6" className="text-center font-weight-bold">Aucun plan activité</td></tr>))}
              </tbody>
            </table>
            {pageCount > 1 && (
              <ReactPaginate
                previousLabel={'Précédent'}
                nextLabel={'Suivant'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={4}
                onPageChange={this.handlePageClick}
                containerClassName="pagination"
                activeClassName="active"
                pageLinkClassName="page-link"
                breakLinkClassName="page-link"
                nextLinkClassName="page-link"
                previousLinkClassName="page-link"
                pageClassName="page-item"
                breakClassName="page-item"
                nextClassName="page-item"
                previousClassName="page-item"
                forcePage={currentPage}
              />)}
          </div>
        </div>
      </>
    )
  }
}
function mapStateToProps(state) {
  const { isRole, idUser } = state.authen;
  return {
    isRole,
    idUser
  };
}
export default withRouter(connect(mapStateToProps)((MyListActivityPlan)));