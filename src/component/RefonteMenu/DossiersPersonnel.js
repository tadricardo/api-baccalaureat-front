import jwtDecode from 'jwt-decode';
import { React, useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import FileSaver from 'file-saver';
import { faFilePdf, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CNav,
    CNavItem,
    CNavLink,
    CRow,
    CTabPane,
    CTabs,
    CButton,
    CInputFile,
    CLabel,
    CTabContent
} from "@coreui/react";
import salariesService from 'src/services/salaries.service';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import swal from "sweetalert";
import moment from 'moment';

import signatureService from 'src/services/signature.service';
import posteService from 'src/services/poste.service';
import DossierSalarie from '../Salarie/DossierSalarie';
import SalarieRqth from '../Salarie/SalarieRQTH';
import SalarieEtranger from '../Salarie/SalarieEtranger';


const DossiersPersonnel = () => {
    let id = jwtDecode(localStorage.getItem('token')).id;
    const [salarie, setSalarie] = useState({
        nom: "",
        prenom: "",
        genre: "",
        email: "",
        motDePasse: "",
        dateNaissance: "",
        telPersonnel: "",
        mobilPersonnel: "",
        telProfessionnel: "",
        mobileProfessionnel: "",
        signatureBase64: "",
        nationalite: "",
        numeroSecuriteSocial: "",
        deptNaissance: "",
        villeNaissance: "",
        nomPrenomContactUrgence: "",
        numeroContactUrgence: "",
        adresse: {
            id: 0,
            version: null,
        },
        domaine: {
            id: 0,
            version: null,
        },
        entreprise: {
            id: 0,
            version: null,
        },
        conges: [],
        visitesMedicales: [],
        postes: [{
            id: 0,
            titrePoste: {},
            typeContrat: {},
            dateDebut: null,
            dateFin: null,
            volumeHoraire: 0.0,
            volumeJournalier: 0.0,
            manager: {},
            fichierContrat: {},
            lieuTravail: {},
            description: null,
            competencesRequises: [],
            maitreApprentissage: {},
            domaine: {},
            position: null,
            coefficient: 0.0,
            remunerationBrut: 0.0,
            coefficientTravailler: 0.0,
            dureePeriodeEssaie: 0,
            debutFormation: null,
            finFormation: null,
            version: 0,
        }],
        roles: [],
        competences: [{
            id: 0,
            competence: {
                id: 0,
                nom: null,
                domaine: [{
                    id: 0,
                    titre: null,
                }]
            },
            salarie: {
                id: 0,
            }
        }],
        formations: [],
        manager: {},
        actif: true,
        version: null
    });

    const [signature, setSignature] = useState("Formats acceptés : png, jpeg, gif et webp. Taille max : 1Mo");
    const [message, setMessage] = useState({});
    const [statut, setStatut] = useState(false);


    useEffect(() => {

        salariesService.getSalarieById(id).then(res =>
            setSalarie(res.data)
        ).catch((error) => {
            console.log("erreur : " + error)
        });

    }, [id]);

    const contratPDF = (idPoste) => {
        posteService.getContratPDF(idPoste).then(response => {
            const filename = response.headers['content-disposition'].split('filename=')[1];
            const blob = new Blob([response.data], { type: 'application/pdf' });
            FileSaver.saveAs(blob, `${filename}`);
        }).catch(e =>
            console.log("erreur telechargement PDF : ", e),
        )
    }

    const handleChangeSingature = (e) => {
        const sign = e.target.value.split('\\');
        if ((e.target.files[0].type.match("image/png") || e.target.files[0].type.match("image/jpeg") || e.target.files[0].type.match("image/gif") || e.target.files[0].type.match("image/webp")) && e.target.files[0].size <= 1000000) {
            setSignature(sign[sign.length - 1])
            const formData = new FormData();
            formData.append('file', e.target.files[0]);
            formData.append('idSalarie', salarie.id);
            signatureService.saveUpdateSignature(formData).then((res) => {

                setMessage("signature sauvegarder")
                setStatut(true);
                //setSignature("Formats acceptés : png, jpeg, gif et webp. Taille max : 1Mo")
            })

        }
        else {
            setMessage("Format incorrect ou la taille est supérieur à 1Mo ")
            setStatut(true);
        }

    }

    const deleteSignature = () => {
        signatureService.deleteSignature(id).then(() => {
            setMessage("La signature a été supprimer...");
            setStatut(true);
            setSignature("Formats acceptés : png, jpeg, gif et webp. Taille max : 1Mo")
        })
    }


    return (
        <>

            {
                console.log(salarie)}

            <CRow>
                <CCol>
                    <CCard>
                        <CCardHeader>
                            <h3>{salarie.prenom + " " + salarie.nom}</h3>
                        </CCardHeader>
                        <CCardBody>
                            <CTabs>
                                <CNav variant="tabs">
                                    <CNavItem>
                                        <CNavLink>
                                            Informations générales
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink>
                                            Mes Documents
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink>
                                            RQTH
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink>
                                            Titre de sejour
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink>
                                            Signature
                                        </CNavLink>
                                    </CNavItem>

                                    <CNavItem>
                                        <CNavLink>
                                            Postes occupés
                                        </CNavLink>
                                    </CNavItem>
                                </CNav>
                                <CTabContent>

                                    {/* iformations générales */}
                                    <CTabPane>
                                        <CCard>
                                            <CCardHeader>
                                                <h4><FontAwesomeIcon icon={["far", "address-card"]} /> Description</h4>
                                            </CCardHeader>
                                            <CCardBody>
                                                <div className="table-responsive">
                                                    <table className="table table-striped table-hover">

                                                        <tbody>
                                                            <tr>
                                                                <th>Nom</th>
                                                                <td>{salarie.nom}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Prénom</th>
                                                                <td>{salarie.prenom}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Email</th>
                                                                <td>{salarie.email}</td>
                                                            </tr>

                                                            <tr>
                                                                <th>Date de Naissance</th>
                                                                <td>{salarie.dateNaissance}</td>

                                                            </tr>
                                                            <tr>
                                                                <th>Nationalité</th>
                                                                <td>{salarie.nationalite}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Genre</th>
                                                                <td>{salarie.genre}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Numéro Sécurité sociale</th>
                                                                <td>{salarie.numeroSecuriteSocial}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Poste occupé</th>

                                                                <td>
                                                                    {salarie.postes.map((p) => {
                                                                        return p.titrePoste.intitule
                                                                    })}
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <th>Type de contrat</th>
                                                                <td>
                                                                    {salarie.postes.map((p) => {
                                                                        return p.typeContrat.type
                                                                    })}
                                                                </td>


                                                            </tr>
                                                            <tr>
                                                                <th>Manager</th>
                                                                <td>
                                                                    <Link id={salarie.manager.id} to={"/salaries/profil/" + salarie.manager.id} >
                                                                        {salarie.manager.prenom + " " + salarie.manager.nom}
                                                                    </Link>


                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Ville de Naissance</th>
                                                                <td>{salarie.villeNaissance}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Département de naissance</th>
                                                                <td>{salarie.deptNaissance}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Nom et Prénom</th>
                                                                <td>{salarie.nomPrenomContactUrgence}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Numéro contact d'urgence</th>
                                                                <td>{salarie.numeroContactUrgence}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Tél perso</th>
                                                                <td>{salarie.telPersonnel}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>mobile perso</th>
                                                                <td>{salarie.mobilePersonnel}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Tél pro</th>
                                                                <td>{salarie.telProfessionnel}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Mobile pro</th>
                                                                <td>{salarie.mobileProfessionnel}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Adresse</th>
                                                                <td>
                                                                    {`${salarie.adresse.numero} ${salarie.adresse.voie
                                                                        } ${salarie.adresse.codePostal} ${salarie.adresse.ville
                                                                        } ${salarie.adresse.complementAdresse || ""
                                                                        } `}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Service</th>
                                                                <td>{salarie.domaine.titre}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Entreprise</th>
                                                                <td>{salarie.entreprise.nom}</td>
                                                            </tr>

                                                            <tr>
                                                                <th>Rôles</th>
                                                                <ul>{salarie.roles.map(r => <li key={r.id}>{r.titre}</li>)}</ul>

                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </CCardBody>

                                        </CCard>
                                    </CTabPane>

                                    {/* Mes documents */}
                                    <CTabPane>
                                        <CCardBody>
                                            <DossierSalarie salarie={{ id: id, nom: salarie.nom, prenom: salarie.prenom }} />
                                        </CCardBody>
                                    </CTabPane>
                                    {/* RQTH*/}
                                    <CTabPane>
                                        <CCardBody>
                                            <SalarieRqth salarie={{ id: id, nom: salarie.nom, prenom: salarie.prenom }} />
                                        </CCardBody>
                                    </CTabPane>
                                    {/* TS*/}
                                    <CTabPane>
                                        <CCardBody>
                                            <SalarieEtranger salarie={{ id: id, nom: salarie.nom, prenom: salarie.prenom }} />
                                        </CCardBody>
                                    </CTabPane>

                                    {/* signature*/}
                                    <CTabPane>
                                        <CCardHeader>
                                            <h4>Signature</h4>
                                        </CCardHeader>
                                        <CCardBody>


                                            <CCol xs="12" md={11}>
                                                <CInputFile custom id="custom-file-input" onChange={handleChangeSingature} />
                                                <CLabel htmlFor="custom-file-input" id="signature" name="signature" variant="custom-file">
                                                    {signature}
                                                </CLabel>
                                            </CCol>
                                            <CRow className="mt-3">
                                                {statut === false ? "" : <div className='alert alert-info col-12 text-center' role='alert'>

                                                    <strong>{message}</strong>
                                                </div>

                                                }

                                            </CRow>
                                            <CRow>


                                                <div className="table-responsive">
                                                    <table className="table table-hover table-striped table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th className='text-center'>Signature</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {signature !== "Formats acceptés : png, jpeg, gif et webp. Taille max : 1Mo" ?
                                                                <tr>
                                                                    <td> <img src={`data:image/jpeg;base64,${signature}`} className="rounded float-left img-signature mt-2" alt="Signature" />
                                                                        <CButton className="float-right"
                                                                            color="danger"
                                                                            onClick={deleteSignature}
                                                                            title="Vous voulez supprimer votre signature ?"
                                                                        >{" "}<FontAwesomeIcon icon={faTrash} />
                                                                        </CButton></td>

                                                                </tr> : <tr><td className='text-center'><strong>Aucune Signature</strong></td></tr>}

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </CRow>


                                        </CCardBody>
                                    </CTabPane>
                                    {/* postes occupés*/}
                                    <CTabPane>
                                        <CCardHeader>
                                            <CRow>
                                                <CCol >
                                                    <h4><FontAwesomeIcon icon={["fas", "align-justify"]} /> Liste des postes</h4>
                                                </CCol>

                                                {/*      {
                                                    salarie.roles.map(r => {
                                                        if (r.id === 1 || r.id === 2) {
                                                            return <CCol lg={2}>
                                                                <Link to={pathname: "/salaries/profil/" + id + "/poste/detail", component: salarie.postes }}>
                                                                    <CButton type="button" block color="info">
                                                                        Ajouter un poste
                                                                    </CButton>
                                                                </Link>
                                                            </CCol>
                                                        }
                                                        return null
                                                    })
                                                }
                                            */}


                                            </CRow>
                                        </CCardHeader>
                                        <CCardBody>

                                            <div className="table-responsive">
                                                <table className="table table-hover table-striped table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>Nom & Prénom</th>
                                                            <th>Type de contrat</th>
                                                            <th>Service</th>
                                                            <th>Manager</th>
                                                            <th>Entreprise</th>
                                                            <th>Maitre d'apprentissage</th>
                                                            <th>Date d'arrivée</th>
                                                            <th>Date de départ</th>
                                                            <th>Action</th>
                                                            <th>Contrat</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            salarie.postes.length > 0 ?
                                                                salarie.postes.map((p, index) => {
                                                                    if (p.id !== 0) {
                                                                        return <tr key={index}>
                                                                            <td>{p.salarie.nom + " " + p.salarie.prenom}</td>
                                                                            <td>{p.typeContrat.type}</td>
                                                                            <td>{p.domaine.titre}</td>
                                                                            <td>{p.salarie.manager.prenom + " " + p.salarie.manager.nom}</td>
                                                                            <td>{p.salarie.entreprise.nom}</td>
                                                                            <td>{p.maitreApprentissage !== null ? p.maitreApprentissage : "Aucun"}</td>
                                                                            <td>{moment(p.dateDebut).format('ll')}</td>
                                                                            <td>{moment(p.dateFin).format('ll') !== "Invalid date" ? moment(p.dateFin).format('ll') : "Aucune date"}</td>

                                                                            <td>

                                                                                <CRow>
                                                                                    <CCol lg={6}>
                                                                                        <Link to={{ pathname: "/salaries/profil/" + parseInt(p.id) + "/poste/detail", state: p }}>
                                                                                            <CButton type="button" color="info" className="mb-2">
                                                                                                Détail du poste
                                                                                            </CButton>
                                                                                        </Link>

                                                                                    </CCol>


                                                                                    <CCol lg={6}>


                                                                                        <Link onClick={() => {
                                                                                            salarie.roles.map(idRole => {
                                                                                                if (idRole === 1 || idRole === 2) {
                                                                                                    console.log(idRole)
                                                                                                }
                                                                                                return null;
                                                                                            })
                                                                                        }} to={{ pathname: "/salaries/profil/" + parseInt(p.id) + "/poste/modification", state: p }}>
                                                                                            <CButton type="button" block color="info">
                                                                                                <FontAwesomeIcon icon={["far", "edit"]} /> Modifier le poste
                                                                                            </CButton>
                                                                                        </Link>
                                                                                    </CCol>
                                                                                </CRow>



                                                                            </td>
                                                                            <td>

                                                                                <CButton color="info"><FontAwesomeIcon icon={faFilePdf}
                                                                                    onClick={() => { contratPDF(p.id) }} />Contrat PDF </CButton>

                                                                            </td>


                                                                        </tr>

                                                                    }


                                                                    return null
                                                                }) : <tr><td>Aucun poste</td></tr>
                                                        }
                                                    </tbody>


                                                </table>
                                            </div>
                                        </CCardBody>

                                    </CTabPane>
                                </CTabContent>
                            </CTabs>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>

    );
};

export default withRouter(DossiersPersonnel);

