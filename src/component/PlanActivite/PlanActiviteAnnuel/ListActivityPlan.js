import { CButton } from '@coreui/react';
import { faCloudDownloadAlt, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import ReactPaginate from 'react-paginate';
import { withRouter } from 'react-router';
import { AsyncPaginate } from 'react-select-async-paginate';
import planActivtyService from 'src/services/planActivity.service';
import salariesService from "src/services/salaries.service";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import FileSaver from 'file-saver';
class ListActivityPlan extends Component {

  order = "";
  constructor(props) {
    super(props);
    this.retrievePlans = this.retrievePlans.bind(this);
    this.onChangeSalarie = this.onChangeSalarie.bind(this);
    this.onChangeInputSalarie = this.onChangeInputSalarie.bind(this);
    this.loadSalarie = this.loadSalarie.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onChangeYear = this.onChangeYear.bind(this);
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
            postes: [],
            manager: {
              id: 0
            },
            signatureBase64: null,
            version: 0
          },
          version: 0
        }

      ],
      itemsPerPage: 5,
      currentPage: 0,
      pageCount: 0,
      searchExpression: "",
      message: "",
      ifError: null,
      loading: false,
      idUser: this.props.idUser
    };
  }

  componentDidMount() {
    this.retrievePlans();
  }


  retrievePlans() {
    planActivtyService.count(this.state.salaries === null ? undefined : this.state.salaries.id, this.state.year === null ? undefined : new Date(this.state.year).getFullYear()).then((resp) => {
      let nbPage = Math.ceil(resp.data / this.state.itemsPerPage)
      this.setState({ pageCount: nbPage })
    }).catch((e) => { console.log(e) });
    if(this.props.isRole === 3){
      planActivtyService.getAllByPageManager(this.state.currentPage, this.state.itemsPerPage, this.state.salaries === null ? undefined : this.state.salaries.id, this.state.year === null ? undefined : new Date(this.state.year).getFullYear())
      .then((response) => {
        this.setState({
          lstActivityPlan: response.data,
          ifError: false,
          loading: false
        });
      })
      .catch((e) => {
        console.log(e);
      });
    }else {
      planActivtyService.getAllByPage(this.state.currentPage, this.state.itemsPerPage, this.state.salaries === null ? undefined : this.state.salaries.id, this.state.year === null ? undefined : new Date(this.state.year).getFullYear())
      .then((response) => {
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


  }

  handlePageClick = (data) => {
    let selected = data.selected;
    this.setState({ currentPage: selected }, () => {
      this.retrievePlans();
    });
  };

  onChangeYear(e) {
    this.setState({ year: new Date(e) }, () => { this.retrievePlans() })
  }

  onChangeInputSalarie(e) {
    this.setState({ nomSalarie: e }, () => { this.retrievePlans() })
  }

  onChangeSalarie(e) {
    this.setState({ salaries: e });
  }

  async loadSalarie(search, prevOptions, { page }, e) {
    let response = null;
    if(this.props.isRole === 3 ){
       response = await salariesService.getAllSalarieByIdManagerAndLastnamePerPage(page, 10, this.props.idUser,this.state.nomSalarie);
    }else{
       response = await salariesService.getAllSalariesByKeywordPerPage(page, 10, this.state.nomSalarie);
    }
    const responseJSON = await response.data;
    return {
      options: responseJSON,
      hasMore: responseJSON.length >= 1,
      additional: {
        page: search ? 2 : page + 1,
      }
    };
  };

  ifdelete(plan) {
    const {currentPage} = this.state;
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
              currentPage: currentPage !== 0  ? currentPage - 1 : currentPage
            });
            this.retrievePlans()
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
      const blob = new Blob([response.data], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      FileSaver.saveAs(blob, `${filename}`);
    });

  }


  render() {
    const { lstActivityPlan, loading, salaries, pageCount, currentPage, year, idUser } = this.state;
    return (
      <>
        <div className="form-row justify-content-between mt-4">
          <div className="col-md-6">
            <label className="font-weight-bold" htmlFor="salarie">Salarie :</label>
            <AsyncPaginate
              name="salarie"
              value={salaries !== null ? Object.entries(salaries).length === 0 ? null : salaries : null}
              loadOptions={this.loadSalarie}
              isClearable
              getOptionValue={(option) => option.id}
              getOptionLabel={(option) => option.prenom + ' ' + option.nom}
              onChange={this.onChangeSalarie}
              isSearchable={true}
              onInputChange={this.onChangeInputSalarie}
              placeholder="Selectionner un salarie"
              additional={{
                page: 0,
              }}
            />
          </div>
          <div className="col-md-6">
            <label className="font-weight-bold mr-3" htmlFor="year">Trier par année</label>
            <DatePicker
              disabled={loading}
              className="form-control"
              name="year"
              selected={year}
              onChange={this.onChangeYear}
              showYearPicker
              dateFormat="yyyy"
            />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-12 table-responsive">
            <table className="table table-hover table-striped table-bordered">
              <thead>
                <tr>
                  <th>Salarie</th>
                  <th>Année</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<tr><td colSpan="6" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                  lstActivityPlan.length !== 0 ?
                    lstActivityPlan.map(plan =>
                      <tr key={plan.id}>
                        <td>{`${plan.salarie.nom} ${plan.salarie.prenom}`}</td>
                        <td>{plan.year}</td>
                        <td>
                          <CButton className="mr-2" to={"/plan-annuel/voir/" + plan.id} color="info" title="Vous voulez voir cette ligne ?"><FontAwesomeIcon icon={faSearch} /> Voir </CButton>
                          {plan.salarie.manager !== null ? plan.salarie.manager.id === idUser ? (<Link to={{ pathname: `/plan-annuel/comment`, state: plan }} ><CButton className="mr-2" color="info"><FontAwesomeIcon icon={faEdit} /> Editer commentaire</CButton></Link>) : "" : ""}
                          <CButton className="mr-2" color="primary" onClick={() => this.exportExcel(plan)} title="Vous voulez exporter ce plan en format excel ?">
                            <FontAwesomeIcon icon={faCloudDownloadAlt} /> Export en format excel
                          </CButton>
                          <CButton color="danger" onClick={() => this.ifdelete(plan)} title="Vous voulez supprimer cette ligne ?">
                            <FontAwesomeIcon icon={faTrash} /> Supprimer
                          </CButton>
                        </td>
                      </tr>
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
export default withRouter(connect(mapStateToProps)((ListActivityPlan)));
