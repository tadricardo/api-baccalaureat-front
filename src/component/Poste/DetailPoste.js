import React, { Component } from 'react';
import posteService from 'src/services/poste.service';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import DetailPosteInfos from './DetailPosteInfos';
import { CButton, CTooltip } from '@coreui/react';
import FileSaver from 'file-saver';
import { withRouter } from 'react-router-dom';


class DetailPoste extends Component {
    _isMounted = false;
    state = {
        poste: {
            intitule: "",
            debut: "",
            fin: "",
            typeContrat: {
                id: 0,
                type: null
            },
            domaine: "",
            volumeHorraire: "",
            volumeJournalier: "",
            position: "",
            coefficient: 0,
            coefficientTravailler: 0,
            description: "",
            entreprise: "",
            remuneration: 0,
            competences: [{
                nom: "",
            }],
            dureePeriodeEssaie: 0,
            debutFormation: "",
            finFormation: "",
        },
        salarie: {
            id: 0,
            nom: "",
            prenom: "",
        },
        manager: {
            id: 0,
            nom: "",
            prenom: "",
        },
        maitreApprentissage: {
            id: 0,
            nom: "",
            prenom: "",
        }
    }


    componentDidMount() {
        const { state } = this.props.location;
        this.getPoste(state.id);
        if (state === undefined)
            this.props.history.push("/home");
    }

    downloadContratPDF() {
        posteService.getContratPDF(this.state.poste.id).then(res => {
            const filename = res.headers['content-disposition'].split('filename=')[1];
            const blob = new Blob([res.data], { type: 'application/pdf' });
            FileSaver.saveAs(blob, `${filename}`);
        }).catch(e =>
            console.log("erreur telechargement PDF : ", e),
        )
    }

    getPoste(id) {
        posteService.getPosteById(id)
            .then((response) => {
                const data = response.data;
                this.setState({
                    poste: {
                        id: data.id,
                        intitule: data.titrePoste.intitule,
                        debut: data.dateDebut,
                        fin: data.dateFin,
                        typeContrat: data.typeContrat,
                        domaine: data.titrePoste.domaine.titre,
                        volumeHoraire: data.volumeHoraire,
                        volumeJournalier: data.volumeJournalier,
                        coefficient: data.coefficient,
                        coefficientTravailler: data.coefficientTravailler,
                        description: data.description,
                        entreprise: data.lieuTravail.nom,
                        remuneration: data.remunerationBrut,
                        competences: data.competencesRequises,
                        position: data.position,
                        dureePeriodeEssaie: data.dureePeriodeEssaie,
                        debutFormation: data.debutFormation,
                        finFormation: data.finFormation,
                    },
                    salarie: {
                        id: data.salarie.id,
                        nom: data.salarie.nom,
                        prenom: data.salarie.prenom,
                    },
                    manager: {
                        id: data.manager.id,
                        nom: data.manager.nom,
                        prenom: data.manager.prenom,
                    },
                    maitreApprentissage: {
                        id: data.maitreApprentissage != null ? data.maitreApprentissage.id : 0,
                        nom: data.maitreApprentissage != null ? data.maitreApprentissage.nom : "",
                        prenom: data.maitreApprentissage != null ? data.maitreApprentissage.prenom : "",
                    }
                });
                this._isMounted = true;
            });
    }

    render() {
        const { salarie, poste, manager, maitreApprentissage } = this.state;
        return (
            <>
                <div className="d-flex justify-content-between mb-3">
                    <div>
                        <h4 className="card-title mb-0">{poste.intitule}</h4>
                    </div>
                    <div>
                        <form className="row align-items-center">
                            <div className="col-8">
                                <input type="text" placeholder="clé" className="form-control col-auto" />
                            </div>
                            <CTooltip content="Telecharger le contrat en pdf">
                                <CButton onClick={() => this.downloadContratPDF()} className="btn btn-primary col-auto">
                                    <FontAwesomeIcon icon={faFilePdf} /> Contrat
                                </CButton>
                            </CTooltip>
                        </form>
                    </div>
                </div>
                <hr className="mt-0" />

                <div className="row">
                    <div className="col-lg-6">
                        <DetailPosteInfos salarie={salarie} poste={poste} manager={manager} maitreApprentissage={maitreApprentissage} />
                    </div>
                    <div className="col-lg-6">
                        <div className="card mb-3">
                            <div className="card-header font-weight-bold">Description</div>
                            <div className="card-body">
                                <p className="card-text">{poste.description}</p>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table border table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th className="font-weight-bold">Compétences</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {poste.competences &&
                                        poste.competences.map((c) => {
                                            return (
                                                <tr key={c.nom}>
                                                    <td>{c.nom}</td>
                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </>
        );
    }

}

export default withRouter(DetailPoste);