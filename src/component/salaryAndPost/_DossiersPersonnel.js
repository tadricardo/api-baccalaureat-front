import jwtDecode from 'jwt-decode';
import { React, useState, useEffect } from 'react';
import FileSaver from 'file-saver';
import { faFilePdf, faTrash } from "@fortawesome/free-solid-svg-icons";
import salariesService from 'src/services/salaries.service';
import posteService from "src/services/poste.service";
import {
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
    CTabs,
    CButton,
    CInputFile,
    CLabel,
    CCardFooter,
    CFormGroup,
    CContainer,
    CAlert
} from "@coreui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
//import swal from "sweetalert";
import moment from 'moment';
import DossierSalarie from '../Salarie/DossierSalarie';
import SalarieRqth from '../Salarie/SalarieRQTH';
import SalarieEtranger from '../Salarie/SalarieEtranger';
import signatureService from 'src/services/signature.service';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import ReactPaginate from 'react-paginate';
import swal from 'sweetalert';



const _DossiersPersonnel = (props) => {

    const [salarie, setSalarie] = useState([])
    // postes
    const [postes, setPostes] = useState([])
    const [orderPoste, setOrderPoste] = useState("DESC")
    const [colPoste, setColPoste] = useState("dateDebut")
    const [pageCountPoste, setPageCountPoste] = useState(0)
    const perPagePoste = 5
    const [offsetPoste, setOffsetPoste] = useState(0)

    // signature
    const [signature, setSignature] = useState(null);
    const [messageSignature, setMessageSignature] = useState(null)
    const [messageTaille, setMessageTaille] = useState(null)
    const [messageType, setMessageType] = useState(null)
    const [errorSignature, setErrorSignature] = useState(false)
    const [errorTaille, setErrorTaille] = useState(false)
    const [errorType, setErrorType] = useState(false)

    const [adresse, setAdresse] = useState({})
    const [service, setService] = useState({})
    const [entreprise, setEntreprise] = useState({})
    const [role, setRole] = useState([])
    const [manager, setManager] = useState({})
    //const id = jwtDecode(localStorage.getItem('token')).id;
    const id = parseInt(props.parametres.idSalarie);
    const user = jwtDecode(localStorage.getItem('token'));
    const history = useHistory();

    //console.log("1 resultat : ",(user.id === id) || (user.roles === "RH" || user.roles === "ADMIN") ? "ta page" : "Pas ta page")
    if (!((user.id === id) || (user.roles === "RH" || user.roles === "ADMIN"))) {
        history.push("/salaries/dossiers-personnel/" + user.id)
    }
    const acces = jwtDecode(localStorage.getItem('acces'));

    // const col = "";
    // const order = "ASC";
    // const downArrow = "faArrowDown";
    // const upArrow = "faArrowUp"

    useEffect(() => {
        salariesService.getSalarieById(id).then((res) => {
            setSalarie(res.data);
            setAdresse(res.data.adresse);
            setService(res.data.domaine);
            setRole(res.data.roles);
            setEntreprise(res.data.entreprise);
            setManager(res.data.manager)
            setPostes(res.data.postes.slice(offsetPoste, offsetPoste + perPagePoste));
            setPageCountPoste(Math.ceil(res.data.postes.length / perPagePoste));
            setSignature(res.data.signatureBase64);
        })
    }, [id, offsetPoste, perPagePoste]);

    /*const sal = Object.entries(salarie)
    const post = []
    sal.forEach(sal => {

        if (sal[0] === "postes") {
            post.push(sal[1])


        }
    })
    const posteSal = async () => {

        return salarie.postes;
    }
    posteSal().then(p => {
        setPostes(p)
    })*/

    // Poste
    const handlePageClickPoste = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * perPagePoste);
        setOffsetPoste(offset);
        setPostes(getPaginatedItems(postes, 3));
    }

    const posteSort = (column) => {
        let order = column === colPoste && orderPoste === "ASC" ? "DESC" : "ASC";
        setColPoste(column);
        setOrderPoste(order);
        posteService.getPostesBySalarieId(salarie.id, 0, 5, column, order)
            .then((res) => {
                setPostes(res.data);
            })
    }

    const contratPDF = (idPoste) => {
        posteService.getContratPDF(idPoste).then(response => {
            const filename = response.headers['content-disposition'].split('filename=')[1];
            const blob = new Blob([response.data], { type: 'application/pdf' });
            FileSaver.saveAs(blob, `${filename}`);
        }).catch(e =>
            console.log("erreur telechargement PDF : ", e),
        )
    }

    /*const handleChangeSingature = (e) => {
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
    }*/
    const onChangeSignature = (e) => {
        if (e.target.files[0].type.match("image/png") || e.target.files[0].type.match("image/jpeg") || e.target.files[0].type.match("image/gif") || e.target.files[0].type.match("image/webp")) {
            setErrorType(false);
            setMessageType(null);
            if (e.target.files[0].size <= 1000000) {
                setErrorTaille(false);
                setMessageTaille(null);
                const formData = new FormData();
                formData.append('file', e.target.files[0]);
                formData.append('idSalarie', salarie.id);

                signatureService.saveUpdateSignature(formData)
                    .then((resp) => {
                        setSignature(resp.data);
                        setErrorSignature(false);
                        setMessageSignature(null);
                    })
                    .catch((e) => {
                        setErrorSignature(true);
                        setMessageSignature("Erreur : " + e.message);
                    });
            } else {
                setErrorTaille(true);
                setMessageTaille("Fichier trop lourd, taille max : 1Mo.");
            }
        } else {
            setErrorType(true);
            setMessageType("Formats acceptés : png, jpeg, gif et webp.");
        }
    }

    const deleteSignature = () => {
        swal({
            title: "Êtes-vous sûrs ?",
            text: "Voulez-vous supprimer votre signature ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                signatureService.deleteSignature(salarie.id)
                    .then((resp) => {
                        if (willDelete) {
                            setSignature(null);
                            swal("Suppression effectué.", {
                                icon: "success",
                            });
                        }
                    }).catch((e) => {
                        swal("Erreur : " + e.message + ".", {
                            icon: "error",
                        });
                    })
            });
    }

    const getPaginatedItems = (items, type) => {
        switch (type) {
            case 3:
                return items.slice(offsetPoste, offsetPoste + perPagePoste);
            default:
                return false;
        }
    }

    return (
        <>
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
                                    {/* Information generale */}
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
                                                                <th>Prenom</th>
                                                                <td>{salarie.prenom}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className="font-weight-bold">Compte actif</th>
                                                                <td>{salarie.actif ? <span className="text-success">OUI</span> : <span className="text-danger">NON</span>}</td>
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
                                                                <td>{postes && postes.map(
                                                                    (value, indexObject) => {
                                                                        if (indexObject === 0) {
                                                                            return (
                                                                                <div key={value.id}>
                                                                                    {value.titrePoste.intitule}
                                                                                </div>
                                                                            );
                                                                        }
                                                                        return <div key={value.id}></div>;
                                                                    }
                                                                )}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Type de contrat</th>
                                                                <td>{postes && postes.map(
                                                                    (value, indexObject) => {
                                                                        if (indexObject === 0) {
                                                                            return (
                                                                                <div key={value.id}>
                                                                                    {value.typeContrat.type}
                                                                                </div>
                                                                            );
                                                                        }
                                                                        return (<div></div>)
                                                                    }
                                                                )}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Manager</th>
                                                                <td>
                                                                    {manager && <Link id={manager.id} to={"/salaries/profil/" + manager.id}  >
                                                                        {manager.prenom + " " + manager.nom}
                                                                    </Link>}
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
                                                                <td>{`${adresse.numero} ${adresse.voie}
                                                                 ${adresse.codePostal} ${adresse.ville}
                                                                  ${adresse.complementAdresse || ""} `}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Service</th>
                                                                <td>{service && service.titre}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Entreprise</th>
                                                                <td>{entreprise && entreprise.nom}</td>
                                                            </tr>

                                                            <tr>
                                                                <th>Rôles</th>
                                                                <td><ul>{role.map(r => <li key={r.id}>{r.titre}</li>)}</ul></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </CCardBody>
                                            {(acces.acces.some(acces => acces.frontRoute === "/salaries/modification/:id")) && (<CCardFooter>
                                                <CRow>
                                                    <CButton active block color="info" aria-pressed="true" to={"/salaries/modification/" + salarie.id}>
                                                        <FontAwesomeIcon icon={["far", "edit"]} /> Modifier
                                                    </CButton>
                                                </CRow>
                                            </CCardFooter>)}
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
                                            <CRow>
                                                <CCol lg={11} >
                                                    <h4>Signature</h4>
                                                </CCol>
                                                <CCol lg={1}>
                                                    <CButton className="float-right"
                                                        color="danger"
                                                        onClick={deleteSignature}
                                                        title="Vous voulez supprimer votre signature ?"
                                                    >{" "}<FontAwesomeIcon icon={faTrash} />
                                                    </CButton>
                                                </CCol>
                                            </CRow>
                                        </CCardHeader>
                                        <CCardBody>
                                            <CFormGroup row>
                                                <CContainer>
                                                    <CRow>
                                                        <CLabel col md={1}>Signature</CLabel>
                                                        <CCol xs="12" md={11}>
                                                            <CInputFile custom id="custom-file-input" onChange={onChangeSignature} />
                                                            <CLabel htmlFor="custom-file-input" id="signature" name="signature" variant="custom-file">
                                                                Formats acceptés : png, jpeg, gif et webp. Taille max : 1Mo.
                                                            </CLabel>
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol lg={12}>
                                                            {messageSignature ? <CAlert color={errorSignature ? "danger" : "success"}>{messageSignature}</CAlert> : ""}
                                                            {messageTaille ? <CAlert color={errorTaille ? "danger" : "success"}>{messageTaille}</CAlert> : ""}
                                                            {messageType ? <CAlert color={errorType ? "danger" : "success"}>{messageType}</CAlert> : ""}
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol lg={12}>
                                                            {signature && <img src={`data:image/jpeg;base64,${signature}`} className="rounded float-left img-signature mt-2" alt="Signature" />}
                                                        </CCol>
                                                    </CRow>
                                                </CContainer>
                                            </CFormGroup>
                                        </CCardBody>
                                    </CTabPane>
                                    {/* postes occupés*/}
                                    <CTabPane>
                                        <CCardHeader>
                                            <CRow>
                                                <CCol lg={10}>
                                                    <h4><FontAwesomeIcon icon={["fas", "align-justify"]} /> Liste des postes</h4>
                                                </CCol>
                                                {(user.roles === "RH" || user.roles === "ADMIN") && (
                                                    <CCol lg={2}>
                                                        <Link to={{ pathname: "/salaries/dossiers-personnel/" + id + "/poste/creation", component: salarie }}>
                                                            <CButton type="button" block color="info">
                                                                Ajouter un poste
                                                            </CButton>
                                                        </Link>
                                                    </CCol>)}
                                            </CRow>
                                        </CCardHeader>
                                        <CCardBody>
                                            <div className="table-responsive">
                                                <table className="table table-hover table-striped table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th onClick={() => posteSort("titrePoste.intitule")}>Poste</th>
                                                            <th onClick={() => posteSort("typeContrat.type")}>Type de contrat</th>
                                                            <th onClick={() => posteSort("domaine.titre")}>Service</th>
                                                            <th onClick={() => posteSort("manager.prenom")}>Manager</th>
                                                            <th onClick={() => posteSort("salarie.entreprise.nom")}>Entreprise</th>
                                                            <th onClick={() => posteSort("maitreApprentissage.nom")}>Maitre d'apprentissage</th>
                                                            <th onClick={() => posteSort("dateDebut")}>Date d'arrivée</th>
                                                            <th onClick={() => posteSort("dateFin")}>Date de départ</th>
                                                            <th>Action</th>
                                                            <th>Contrat</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {postes &&
                                                            postes.length !== 0 ?
                                                            postes.map((poste, index) =>
                                                                <tr key={poste.id}>
                                                                    <td>{poste.titrePoste.intitule}</td>
                                                                    <td>{poste.typeContrat.type}</td>
                                                                    <td>{poste.domaine.titre}</td>
                                                                    <td>{poste.manager != null ? poste.manager.nom + " " + poste.manager.prenom : "Aucun(e)"}</td>
                                                                    <td>{poste.salarie.entreprise.nom}</td>
                                                                    <td>{poste.maitreApprentissage != null ? poste.maitreApprentissage.nom + " " + poste.maitreApprentissage.prenom : "Aucun"}</td>
                                                                    <td >{moment(poste.dateDebut).format("ll")}</td>
                                                                    <td >{poste.dateFin && moment(poste.dateFin).format("ll")}</td>
                                                                    <td>
                                                                        <Link to={{ pathname: `/salaries/dossiers-personnel/${salarie.id}/poste/detail`, state: poste }}>
                                                                            <CButton type="button" color="info" className="mb-2">
                                                                                Détail du poste
                                                                            </CButton>
                                                                        </Link>
                                                                        {(user.roles === "RH" || user.roles === "ADMIN") && index === 0 ?
                                                                            <Link to={{ pathname: "/salaries/dossiers-personnel/" + salarie.id + "/poste/modification", state: poste }}>
                                                                                <CButton type="button" block color="info">
                                                                                    <FontAwesomeIcon icon={["far", "edit"]} /> Modifier le poste
                                                                                </CButton>
                                                                            </Link> : ""}
                                                                    </td>
                                                                    <td><CButton onClick={() => contratPDF(poste.id)} color="info" className={'ml-3 mb-1'} ><FontAwesomeIcon icon={faFilePdf} /> Contrat pdf </CButton></td>
                                                                </tr>
                                                            ) : <tr><td colSpan="11" className="text-center font-weight-bold">Aucun poste</td></tr>}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {pageCountPoste > 1 && (<ReactPaginate
                                                name="test"
                                                previousLabel={'Précédent'}
                                                nextLabel={'Suivant'}
                                                breakLabel={'...'}
                                                pageCount={pageCountPoste} // count Total de poste
                                                pageRangeDisplayed={5}
                                                marginPagesDisplayed={2}
                                                onPageChange={handlePageClickPoste}
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

                                </CTabContent>
                            </CTabs>
                        </CCardBody>
                    </CCard>
                </CCol >
            </CRow >
        </>
    );
};

export default _DossiersPersonnel;