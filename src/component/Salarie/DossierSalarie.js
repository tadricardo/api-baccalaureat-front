import { CSelect} from "@coreui/react";
import React, {Component} from 'react';
import dossierSalarieService from '../../services/dossierSalarie.service';
import FileSaver from 'file-saver';

class DossierSalarie extends Component {

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      typeAct : "",
      typesDoc : [
        { id: "CV" ,value: "CV" },
        { id: "CARTE_VITALE" ,value: "Carte vitale"},
        { id: "CNI" ,value: "Carte Nationale d'Identité"},
        { id: "ATTESTATION_SECU" ,value: "Attestation de sécurité sociale"},
        { id: "PASSEPORT",value: "Passeport"},
        { id: "TITRE_SEJOUR",value: "Titre de séjour"},
        { id: "RIB" ,value: "Relevé d'Identité Bancaire (RIB)"},
        { id: "ATTESTATION_RQTH",value: "Attestation RQTH"},
        { id: "ADHESION_MUTUELLE" ,value: "Fiche d'adhesion à la mutuelle"},
        { id: "BON_DEROGATION",value: "Bon de dérogation"},
        { id: "MANDAT_SEPA" ,value: "Mandat SEPA"},
        { id: "BULLETIN_PREVOYANCE",value: "Bulletin de prévoyance"},
        { id: "FICHE_CONTACT_URGENCE",value: "Fiche de contact d'urgence"}
      ],
      fileList: [],
      fileInputText: "Formats acceptés : png, jpeg et pdf",
    }
  }

  componentDidMount() {
    this.reloadFileList();
  }

  reloadFileList = () => {
    dossierSalarieService.getFileList(this.props.salarie.id).then((res) => {
      this.setState((prevState) => ({
        ...prevState,
        fileList: res.data
      }));
    });
  }

  loadFile = (event) => {
    let file = event.target.files[0];
    let filename = event.target.files[0].name.split(' ').join('-');
    this.setState(prevState => ({
      ...prevState,
      fileInputText: filename,
    }))
    if (file.type.match("image/png") || file.type.match("image/jpeg") || file.type.match("application/pdf")) {
      this.setState((prevState) => ({
        ...prevState,
        file: file,
      }));
    }
  }


  uploadFile = (event) => {
    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('idSalarie', this.props.salarie.id);
    formData.append('typeDocument',this.state.typeAct);
    dossierSalarieService.saveFile(formData).then(() => {
      this.reloadFileList();
    });

  }

  downloadFile = (id) => {
    dossierSalarieService.getFile(id).then(res => {
      const filename = res.headers['content-disposition'].split('filename=')[1];
      const blob = new Blob([res.data]);
      FileSaver.saveAs(blob, `${this.props.salarie.nom.toUpperCase()}_${this.props.salarie.prenom.toUpperCase()}_${filename}`);
    }).catch(e =>
      console.log("Erreur lors du téléchargement : ", e),
    );
  }

  downloadZipFile = () => {
    dossierSalarieService.getZipFile(this.props.salarie.id).then(res => {
      const blob = new Blob([res.data]);
      FileSaver.saveAs(blob, `${this.props.salarie.nom.toUpperCase()}_${this.props.salarie.prenom.toUpperCase()}.zip`);
    })
  }

  deleteFile = (id) => {
    dossierSalarieService.deleteFile(id).then(() => {
      this.reloadFileList();
    })

  }

  handleChange = (evt) => {
    this.setState((prevState) => ({
      ...prevState,
      typeAct: evt.target.value
    }))
  }

  render() {

    const {typesDoc, fileList, fileInputText} = this.state;

    return (
      <div className="m-3">
        <div className="row justify-content-center">
            <div className="col-4 col-md-4">
              <input className="custom-file-input" id="custom-file-input" type="file" onChange={this.loadFile}/>
                <label className="custom-file-label overflow-hidden" htmlFor="custom-file-input" id="signature"
                       name="signature">
                  {fileInputText}
                </label>
            </div>
          <div className="col-4 ">
            <CSelect
              name="typesDoc"
              id="typesDoc"
              onChange={this.handleChange}>
              <option value="0">
                Type de document
              </option>
              {typesDoc.sort( (a, b) => {
                return a.value > b.value ? 1 : -1;
              })
                .map((type, key) => (
                <option key={key} value={type.id}>
                  {type.value}
                </option>
              ))}
            </CSelect>
          </div>
          <button className="btn btn-primary" onClick={this.uploadFile}>Importer</button>
        </div>
        <table className="table table-striped mt-3">
          <colgroup>
            <col className="col-md-4"/>
            <col className="col-md-5"/>
            <col className="col-md-3"/>
          </colgroup>
          <thead>
            <tr>
              <th className="align-middle">Nom du fichier</th>
              <th className="align-middle">Type du fichier</th>
              <th><button className="btn btn-sm btn-success" onClick={() => this.downloadZipFile()} >Telecharger ZIP</button></th>
            </tr>
          </thead>
          <tbody>
          {fileList.sort((a,b) => {return a.typeDocument.localeCompare(b.typeDocument)}).map((file, key) => (
              <tr key={key}>
                <td className="align-middle">{file.nom}</td>
                <td className="align-middle">{typesDoc.filter(t => t.id === file.typeDocument)[0].value}</td>
                <td className="align-middle justify-content-end">
                  <button className="btn btn-sm btn-success mr-1" onClick={()=>this.downloadFile(file.id)}>Telecharger</button>
                  <button className="btn btn-sm btn-danger" onClick={() => this.deleteFile(file.id)}>X</button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DossierSalarie;
