import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class DetailPosteInfos extends Component {
    render() {
        const { poste, salarie, manager, maitreApprentissage } = this.props;
        return (
            <>
                <div className="table-responsive col-12">
                    <table className="table border table-striped table-hover">
                        <thead>
                            <tr>
                                <th className="justify-content-center text-center " colSpan={2}>Informations</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <th>Salarie</th>
                                <td><Link to={"/salaries/profil/" + salarie.id}>{salarie.nom} {salarie.prenom}</Link></td>
                            </tr>
                            <tr>
                                <th>Type de contrat</th>
                                <td>{poste.typeContrat.type}</td>
                            </tr>
                            <tr>
                                <th>Date de début</th>
                                <td>{poste.debut}</td>
                            </tr>
                            <tr>
                                <th>Date de fin</th>
                                <td>{poste.fin != null ? poste.fin : "-"}</td>
                            </tr>
                            {poste.typeContrat.id === 3 | poste.typeContrat.id === 4 ?
                                <tr>
                                    <th>Date de début de formation</th>
                                    <td>{poste.debutFormation}</td>
                                </tr> : null}

                            {poste.typeContrat.id === 3 | poste.typeContrat.id === 4 ?
                                <tr>
                                    <th>Date de fin de formation</th>
                                    <td>{poste.finFormation}</td>
                                </tr> : null}
                            {poste.volumeHoraire !== 0 ?
                                (
                                    <tr>
                                        <th>Volume horaire</th>
                                        <td>{poste.volumeHoraire}H</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <th>Volume Journalier</th>
                                        <td>{poste.volumeJournalier}J</td>
                                    </tr>
                                )
                            }
                            <tr>
                                <th>Position</th>
                                <td>{poste.position === "CADRE" ? "Cadre" : poste.position === "NON_CADRE" ? "Non Cadre" : ""}</td>
                            </tr>
                            <tr>
                                <th>Période d'essai</th>
                                <td>{poste.dureePeriodeEssaie} jours</td>
                            </tr>
                            <tr>
                                <th>Coefficient</th>
                                <td>{poste.coefficient}</td>
                            </tr>
                            <tr>
                                <th>Coefficient Travaillé</th>
                                <td>{(poste.coefficientTravailler) + "%"}</td>
                            </tr>
                            <tr>
                                <th>Manager</th>
                                <td><Link to={"/salaries/profil/" + manager.id}>{manager.nom} {manager.prenom}</Link></td>
                            </tr>
                            {maitreApprentissage.nom !== "" ?
                                (
                                    <tr>
                                        <th>Maitre d'apprentissage</th>
                                        <td><Link to={"/salaries/profil/" + maitreApprentissage.id}>{maitreApprentissage.nom} {maitreApprentissage.prenom}</Link></td>
                                    </tr>
                                ) : null
                            }
                            <tr>
                                <th>Lieu de travail</th>
                                <td>{poste.entreprise}</td>
                            </tr>
                            <tr>
                                <th>Domaine</th>
                                <td>{poste.domaine}</td>
                            </tr>
                            <tr>
                                <th>Remunération (Brut)</th>
                                <td>{poste.remuneration}€</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}

export default DetailPosteInfos;
