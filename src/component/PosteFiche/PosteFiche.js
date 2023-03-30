import React, { Component } from 'react';
import { withRouter } from "react-router";
import moment from 'moment';
import momentFR from 'moment/locale/fr';
import { CButton, CInput, CSpinner } from '@coreui/react';
import posteFicheService from "../../services/poste-fiche.service";
import FileSaver from 'file-saver';

class PosteFiche extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {
                nomFichierNull: null, nomFichierNullBoolean: true,
                fichierNull: null, fichierNullBoolean: true,
                errorForm: null,
            },
            loading: false,
            file: null,//fichier
            fileInputText: "Formats acceptés : png, jpeg et pdf",//nom du pdf
            posteFiches: [], //tableau
            posteFiche: {
                nomFichier: "",
                stockageFichier: null,
            },
        };
        moment.locale('fr', momentFR);
    }

    componentDidMount() {
        this.reloadFileList();
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
                errors: {
                    ...prevState.errors,
                    fichierNull: null,
                    fichierNullBoolean: false,
                }
            }));
        } else {
            this.setState((prevState) => ({
                errors: {
                    ...prevState.errors,
                    fichierNull: "Le fichier doit être un PDF, JPEG ou PNG.",
                    fichierNullBoolean: true,
                }
            }));
        }
    }

    handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        if (name === "nomFichier") {
            if (value.length > 0) {
                this.setState((prevState) => ({
                    posteFiche: {
                        ...prevState.posteFiche,
                        nomFichier: value,
                    },
                    errors: {
                        ...prevState.errors,
                        nomFichierNull: null,
                        nomFichierNullBoolean: false,
                    }
                }));
            } else {
                this.setState((prevState) => ({
                    posteFiche: {
                        ...prevState.posteFiche,
                        nomFichier: value,
                    },
                    errors: {
                        ...prevState.errors,
                        nomFichierNull: "Le nom du fichier est obligatoire.",
                        nomFichierNullBoolean: true,
                    }
                }));
            }
        }
    }

    reloadFileList = () => {
        posteFicheService.getAllPosteFiche().then((res) => {
            this.setState((prevState) => ({
                ...prevState,
                posteFiches: res.data
            }));
        });
    }

    verificationForm() {
        const errors = this.state.errors;
        if (!errors.fichierNullBoolean && !errors.nomFichierNullBoolean) {
            this.setState((prevState) => ({
                errors: {
                    ...prevState.errors,
                    errorForm: null
                }
            }));
            return true; // Formulaire OK
        } else {
            this.setState((prevState) => ({
                errors: {
                    ...prevState.errors,
                    fichierNull: errors.fichierNullBoolean ? "Le fichier doit être un PDF, JPEG ou PNG." : null,
                    nomFichierNull: errors.nomFichierNullBoolean ? "Le nom du fichier est obligatoire." : null,
                    errorForm: "Erreur dans le formulaire."
                }
            }));
            return false; // Formulaire PAS OK
        }
    }

    uploadFile = (event) => {
        if (this.verificationForm()) {
            this.setState({ loading: true });

            const formData = new FormData();
            formData.append('file', this.state.file);
            formData.append('nomFichier', this.state.posteFiche.nomFichier);

            posteFicheService.savePosteFicheWithFile(formData).then(() => {
                this.reloadFileList();
                this.setState({ loading: false });
            }).catch((e) => {
                this.setState({ loading: false });
                console.log(e)
            });
        }
    }

    downloadFile = (id) => {
        posteFicheService.getFile(id).then(res => {
          const filename = res.headers['content-disposition'].split('filename=')[1];
          const blob = new Blob([res.data]);
          FileSaver.saveAs(blob, `${filename}`);
        }).catch(e =>
          console.log("Erreur lors du téléchargement : ", e),
        );
      }

    deleteFile = (id) => {
        posteFicheService.deletePosteFiche(id).then(() => {
            this.reloadFileList();
        })
    }

    render() {
        const { posteFiches, posteFiche, fileInputText, errors, loading } = this.state;
        return (
            <>
                <div className="m-3">
                    <div className="row justify-content-center">
                        <div className="col-4 col-md-4">
                            <input className="custom-file-input" id="custom-file-input" type="file" onChange={this.loadFile} required />
                            <label className="custom-file-label overflow-hidden" htmlFor="custom-file-input" id="posteFiche"
                                name="posteFiche">
                                {fileInputText}
                            </label>
                        </div>
                        <div className="col-4 ">
                            <CInput type="text" name="nomFichier" id="nomFichier" value={posteFiche.nomFichier} placeholder="Nom du fichier" onChange={this.handleChange} required />
                        </div>
                        <CButton className="btn btn-primary" onClick={this.uploadFile} disabled={loading}>{loading && <CSpinner size="sm" variant="border" />} Importer</CButton>
                    </div>
                    <div className="col">
                        <span className="text-danger row">{errors.fichierNull}</span>
                        <span className="text-danger row">{errors.nomFichierNull}</span>
                        <span className="text-danger row">{errors.errorForm}</span>
                    </div>
                    <table className="table table-striped mt-3">
                        <thead>
                            <tr>
                                <th className="align-middle">Nom du fichier</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {posteFiches.length > 0 ?
                                posteFiches.map((fiche, key) => (
                                    <tr key={key}>
                                        <td className="align-middle">{fiche.nomFichier}</td>
                                        <td className="align-middle justify-content-end">
                                            <button className="btn btn-sm btn-success mr-1" onClick={() => this.downloadFile(fiche.id)}>Telecharger</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => this.deleteFile(fiche.id)}>X</button>
                                        </td>
                                    </tr>
                                )) :
                                <tr><td colSpan={2}>Aucune fiche de poste</td></tr>
                            }
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}
export default withRouter(PosteFiche);