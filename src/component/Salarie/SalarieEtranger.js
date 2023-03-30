import React, {Component} from 'react';
import dossierSalarieService from "../../services/dossierSalarie.service";
import titreSejourService from "../../services/titreSejour.service";

class SalarieEtranger extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasTitreSejour: false,
      titreSejour: null,
      numero: "",
      dateFin: new Date().toISOString().split('T')[0],
    }
  }

  componentDidMount() {
    this.searchTitreSejour()
  }

  searchTitreSejour(){
    dossierSalarieService.hasTitreSejourFile(this.props.salarie.id).then((res) => {
      this.setState((prevState) => ({
       ...prevState,
       hasTitreSejour: res.data,
      }))
    })

    titreSejourService.getTitreSejour(this.props.salarie.id)
      .then((res) => {
        this.setState((prevState) => ({
          ...prevState,
          titreSejour: res.data
        }))
      })
  }

  addTitreSejour() {
    titreSejourService.saveTitreSejour({
      numero: this.state.numero,
      dateFin: this.state.dateFin,
      salarieId: this.props.salarie.id,
    }).then(() => {
      this.searchTitreSejour();
    })
  }

  deleteTitre(id) {
    titreSejourService.deleteTitre(id).then(()=> {this.searchTitreSejour()})
  }

  render() {
    const {hasTitreSejour, titreSejour, numero, dateFin} = this.state;
    if(!hasTitreSejour){
      return (
        <div className="mt-3">
          <h3>Aucun titre de séjour trouvé</h3>
        </div>
      );
    } else {
      return (
        <div className="mt-3">
          <div>

          </div>
          <div className="row justify-content-center">
            <input type="text" value={numero} onChange={(e) => {this.setState({numero: e.target.value})}} className="form-control col-4 mr-1"/>
            <input value={dateFin} onChange={(e) => {this.setState({dateFin: e.target.value})}} className="form-control col-2" type="date"/>
            <button className="btn btn-success ml-1" onClick={() => this.addTitreSejour()}>ajouter</button>
          </div>

          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Numero</th>
                <th>Date de fin</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {titreSejour && titreSejour.map((titre, key) => (
              <tr key={key}>
                <td>{titre.numero}</td>
                <td>{titre.dateFin}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => this.deleteTitre(titre.id)}>X</button>
                </td>
              </tr>

            ))}
            </tbody>
          </table>

        </div>
      );
    }

  }
}

export default SalarieEtranger;
