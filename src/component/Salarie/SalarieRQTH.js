import React, {Component} from 'react';
import {CAlert} from "@coreui/react";
import dossierSalarieService from '../../services/dossierSalarie.service';
import amenagementService from '../../services/amenagement.service';

class SalarieRqth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasFile: false,
      amenagements: [],
      editMode: false,
      inputText: "",
    }
  }

  componentDidMount() {
    this.searchAttestation();
    this.loadAmenagements();
  }

  searchAttestation() {
    dossierSalarieService.hasRqthFile(this.props.salarie.id).then(res => {
      this.setState((prevState) => ({
        ...prevState,
        hasFile: res.data,
        })
      )
    })
  }

  loadAmenagements() {
    // charger les amenagements
    amenagementService.getAll(this.props.salarie.id).then(res => {
      this.setState((prevState) => ({
        ...prevState,
        amenagements: res.data,
      }))
    })
  }

  addAmenagement() {

    if(this.state.inputText !== ""){

      let amenagement = {
        id: null,
        description: this.state.inputText,
        salarieId: Number(this.props.salarie.id),
      }
      console.log(amenagement);
      amenagementService.create(amenagement).then((res) => {
        this.loadAmenagements();
      })
    }

  }

  deleteAmenagement(id) {
    amenagementService.delete(id).then((res) => {
      this.loadAmenagements();
    })

  }


  render() {
    const {hasFile, amenagements, inputText} = this.state;
    if(!hasFile)
      return (
        <div className="mt-3">
          <CAlert color="danger">
            <div className="d-flex justify-content-between ">
              <h4>Aucune attestation RQTH trouvé</h4>
              <button className="btn btn-sm btn-primary" onClick={() => this.searchAttestation()}>Refresh</button>
            </div>
          </CAlert>
        </div>

      );
    else
      return(
        <div className="mt-3">
          <h3 className="mt-3">Aménagements prévus</h3>
          <form className="input-group">
            <input type="text" value={inputText} onChange={(e) => this.setState({inputText: e.target.value})} className="form-control"/>
            <div className="input-group-append">
              <button className="btn btn-primary" onClick={() => this.addAmenagement()}>Ajouter un amenagement</button>
            </div>
          </form>

          <table className="table table-striped mt-3">
            <tbody>
            {amenagements.map((amenagement, key) => (
              <tr key={key}>
                <td>{amenagement.description}</td>
                <td><button className="btn btn-sm btn-danger" onClick={() => this.deleteAmenagement(amenagement.id)}>X</button></td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default SalarieRqth;
