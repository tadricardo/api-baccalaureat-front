import { React , useEffect, useState } from 'react';
import { CButton, CSelect, CSpinner } from '@coreui/react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router';
import Select from 'react-select';
import countries from 'world_countries_lists/data/countries/fr/countries.json';
import CompetenceService from "../../services/competence.service";
import EntrepriseService from "../../services/entreprises.service";
import RoleService from "../../services/role.service";
import salariesService from '../../services/salaries.service';
import SalariesService from "../../services/salaries.service";
import serviceService from "../../services/service.service";
import TitrePosteService from "../../services/titre-poste.service";
import TypeContratService from "../../services/type-contrat.service";


const CreatedSalaryAndPost = () => {

    const { register, handleSubmit, formState: { errors }, watch, getValues, setValue} = useForm({ mode: "all" });

    //service
    const [domaines, setdomaines] = useState([]);

    const [entreprises, setEntreprise] = useState([]);

    const [roles, setRoles] = useState([]);
    const [rolesValue, setRolesValue] = useState([{ id: 4, label: 'EMPLOYEE' }]);



    const [competencesPoste, setCompetencesPoste] = useState([]);
    const [competences, setComptences] = useState([]);


    const [titrePoste, setTitrePoste] = useState([]);

    const [contrats, setContrats] = useState({});
    const [contratPdf, setContratPdf] = useState("Inserer le contrat");

    const [move, setMove] = useState(true);
    const [choix, setChoix] = useState("AJOUTER");


    const [competencesSalarie, setCompetencesSalarie] = useState([]);
    const [competencesNote, setCompetencesNote] = useState([]);
    const [competencesError, setCompetencesError] = useState([]);
    const [competencesErrorDoublon, setCompetencesErrorDoublon] = useState([]);

    const [disabledBtnAjtComp, setDisabledBtnAjtComp] = useState(true)
    const [disabledSelectService, setDisabledSelectService] = useState(false)

    //pagination des étapes pour la création du salarie avec son poste associer
    const [formStep, setFormStep] = useState(1);

    const [salaries, setSalaries] = useState();


    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false)

    const btnNextOrAdd = document.getElementById('btnNextOrAdd');


    const next = () => {

        if (choix === "AJOUTER") {
            setFormStep(formStep + 2);
        }
        else {
            //window.setTimeout(() => { this.props.history.push(`/salaries/profil/7`) }, 2500);
            setFormStep(formStep + 1)
        }

    }

    const prev = () => {


        if (move === true && formStep === 3) {
            setFormStep(formStep - 2);
            setMessage("")
        }
        else {
            setChoix("AJOUTER")
            setFormStep(formStep - 1)

        }

    }
    const domainId = parseInt(watch('service'));

    useEffect(() => {

        SalariesService.getAll()
            .then((response) => {
                setSalaries(response.data)
            });
        serviceService.getAllService()
            .then((reponse) => {
                setdomaines(reponse.data)
            });
        EntrepriseService.getAllEntreprises()
            .then((reponse) => {
                setEntreprise(reponse.data);
            });
        RoleService.getAllRoles()
            .then((reponse) => {

                setRoles(reponse.data);
            });
        CompetenceService.getCompetenceByIdDomaine(parseInt(watch('service')))
            .then((reponse) => {
                for (let i = 0; i < reponse.data.length; i++) {
                    setComptences(reponse.data)
                }
            });
        TypeContratService.getAllTypeContrat()
            .then((reponse) => {
                setContrats(reponse.data);
            });

        TitrePosteService.getTitrePosteByIdDomaine(domainId)
            .then((response) => {
                setTitrePoste(response.data)
            });

        domainId !== 0 ? setDisabledBtnAjtComp(false) : setDisabledBtnAjtComp(true);
    }, [watch, domainId]);

    const handleChangeRole = (e) => {
        setRolesValue(e)
    }


    const handleChangeCompetencePoste = (e) => {
        setCompetencesPoste(e)
    }

    const handleChangeContratPdf = (e) => {
        const pdf = e.target.value.split('\\');

        setContratPdf(pdf[pdf.length - 1]);
    }


    const onSubmit = (data) => {
        const roles = [];

        rolesValue.forEach((r) => {
            let rule = { "id": r.id, "titre": r.label };
            roles.push(rule);
        });
        
        const newSalarie = {
            id: 0,
            nom: data.nom,
            prenom: data.prenom,
            genre: data.genre,
            email: data.email,
            dateNaissance: data.dateNaissance,
            telPersonnel: data.telPerso,
            mobilPersonnel: data.mobilPerso,
            telProfessionnel: data.telPerso,
            mobileProfessionnel: data.mobilePro,
            nationalite: data.nationalite,
            numeroSecuriteSocial: data.nss,
            deptNaissance: data.departementNaissance,
            villeNaissance: data.villeNaissance,
            nomPrenomContactUrgence: data.nomContactUrgence,
            numeroContactUrgence: data.numeroContactUrgence,
            actif:true,
            adresse: {
                id: 0,
                numero: data.numAddr,
                voie: data.rue,
                complementAdresse: data.cmplAdrr,
                ville: data.ville,
                codePostal: data.codePostal,
                pays: data.pays
            },
            domaine: {
                id: parseInt(data.service),
            },
            entreprise: {
                id: parseInt(data.entreprise),
            },
            roles: roles
        }


        salariesService.getSalarieByEmail(newSalarie.email).then(res => {

            if (res.data === "") {
                const salarieCompetenceNote = []
                for (const cn in competencesSalarie && competencesNote) {

                    salarieCompetenceNote.push({
                        note: competencesNote[cn],
                        competence: { id: parseInt(competencesSalarie[cn]) },
                        salarie: { id: 0 }
                    });
                }
                if (choix === "AJOUTER") {
                    const entity = {
                        salarieDto: { ...newSalarie },
                        competenceNoteDtos: salarieCompetenceNote
                    }
                    const stringify = JSON.stringify(entity);
                    const dataJson = JSON.parse(stringify);

                    salariesService.saveSalarieEtPoste(dataJson).then((res) => {
                        //console.log(res)
                        setLoading(true)
                        setMessage("salarié sauvegarder....");
                        window.setTimeout(()=>{
                            window.location='#/salaries/liste';
                        }, 2500);
                    })
                } else {
                    const compPoste = []
                    competencesPoste.forEach((cp) => {


                        let cPoste = {
                            nom: cp.label

                        }
                        compPoste.push(cPoste)
                    });
                    const poste = {
                        description: data.description,
                        dateDebut: data.dateDebut,
                        dateFin: data.dateFin,
                        competencesRequises: compPoste,
                        volumeHoraire: parseFloat(data.volumeHoraire),
                        volumeJournalier: parseFloat(data.volumeJournalier),
                        fichierContrat: contratPdf,
                        domaine: choix === "AJOUTER" ? 0 : { id: parseInt(data.service) },
                        titrePoste: {
                            id: parseInt(data.intitulePoste)
                        },
                        salarieId: {
                            id: 0
                        },
                        typeContrat: {
                            id: parseInt(data.typeContrat)
                        },
                        managerId: {
                            id: parseInt(data.manager)
                        },
                        lieuTravail: {
                            id: parseInt(data.lieuTravail)
                        },
                        maitreApprentissageId: {
                            id: parseInt(data.maitreApprentissage)
                        },
                        position: data.position,
                        coefficientTravailler: data.coefTravaille,
                        remunerationBrut: parseFloat(data.remuneration),
                        coefficient: parseFloat(data.coef),
                        dureePeriodeEssaie: parseFloat(data.dureePeriodeEssaie),
                        debutFormation: data.debutFormation,
                        finFormation: data.finFormation
                    }

                    const entity = {
                        salarieDto: { ...newSalarie },
                        competenceNoteDtos: salarieCompetenceNote,
                        posteDto: { ...poste }
                    }

                    const stringify = JSON.stringify(entity);
                    //const dataJson = JSON.parse(stringify);
                    //console.log(stringify)
                    salariesService.saveSalarieEtPoste(stringify).then((res) => {
                       // console.log(res);
                       setLoading(true)
                        setMessage("salarié sauvegarder avec son poste....");
                        window.setTimeout(()=>{
                            window.location='#/salaries/liste';
                        }, 2500);
                    })
                }

            } else {
                setMessage("un salarié est déjà sauvegarder avec cet adresse mail: " + newSalarie.email);
            }
        });
    }

    const annulation = () => {
        window.location.reload();
        setMessage("")
    }

    const verificationFormSalarie = () => {
        if (getValues('nom') !== ''
            && getValues('prenom') !== ''
            && getValues('nss') !== ''
            && getValues('dateNaissance') !== ''
            && getValues('villeNaissance') !== ''
            && getValues('email') !== ''
            && getValues('genre') !== '0'
            && getValues('departementNaissance') !== ''
            && getValues('telPerso') !== ''
            && getValues('numAddr') !== ''
            && getValues('rue') !== ''
            && getValues('codePostal') !== ''
            && getValues('ville') !== ''
            && watch('service') !== '0'
            && watch('entreprise') !== '0'
            && competencesError.filter(error => error !== null).length === 0
            && competencesErrorDoublon.filter(error => error !== null).length === 0
            && competencesSalarie.length !== 0
        )
            return true;
        else
            return false;
    }

    // const verificationFormPoste = () => {
    //     if (getValues('intitulePoste') !== '0'
    //         && getValues('remuneration') !== ''
    //         && getValues('typeContrat') !== '0'
    //         && getValues('coef') !== ''
    //         && getValues('coefTravaille') !== ''
    //         && getValues('position') !== '0'
    //         && getValues('dateDebut') !== ''
    //         && getValues('volumeHoraire') !== ''
    //         && getValues('lieuTravaille') !== '0'



    //     ) { return true; }
    //     else {
    //         return false;
    //     }

    // }

    const handleCompetence = (e, i) => {
        const compSal = [...competencesSalarie];
        compSal[i] = parseInt(e.target.value);
        setCompetencesSalarie(compSal);

        const compE = [...competencesError];
        compE[i] = compSal[i] !== null && compSal[i] !== 0 && competencesNote[i] !== undefined && parseInt(competencesNote[i]) !== 0 ? null : "Une compétence doit avoir une note.";
        setCompetencesError(compE);

        const compED = [...competencesErrorDoublon];
        compED[i] = competencesSalarie.filter(c => c === parseInt(e.target.value)).length > 0 ? "Cette compétence est déjà sélectionnée." : null;
        setCompetencesErrorDoublon(compED);
    }

    const handleCompetenceNote = (e, i) => {
        const compNote = [...competencesNote];
        compNote[i] = e.target.value;
        setCompetencesNote(compNote);

        const compE = [...competencesError];
        compE[i] = competencesSalarie[i] !== null && competencesSalarie[i] !== 0 && compNote[i] !== undefined && compNote[i] !== "0" ? null : "Une compétence doit avoir une note.";
        setCompetencesError(compE);
    }

    const handleCompetenceDelete = (i) => {
        const compSal = [...competencesSalarie];
        compSal.splice(i, 1);
        setCompetencesSalarie(compSal);

        const compNote = [...competencesNote];
        compNote.splice(i, 1);
        setCompetencesNote(compNote);

        const compE = [...competencesError];
        compE.splice(i, 1);
        setCompetencesError(compE);

        const compED = [...competencesErrorDoublon];
        compED.splice(i, 1);
        setCompetencesErrorDoublon(compED);

        competencesSalarie.length - 1 > 0 ? setDisabledSelectService(true) : setDisabledSelectService(false);
        competencesSalarie.length - 1 > 0 ? document.getElementById("service").title = "Supprimer les compétences pour changer le service." : document.getElementById("service").title = "";
    }

    const addAutreCompetence = (e) => {
        setCompetencesSalarie([...competencesSalarie, [0]]);
        setCompetencesNote([...competencesNote, [0]]);
        setCompetencesError([...competencesError, ['']]);
        setCompetencesErrorDoublon([...competencesErrorDoublon, ['']]);

        competencesSalarie.length + 1 > 0 ? setDisabledSelectService(true) : setDisabledSelectService(false);
        competencesSalarie.length + 1 > 0 ? document.getElementById("service").title = "Supprimer les compétences pour changer le service." : document.getElementById("service").title = "";
    }

    const isMineur = () => {
        let anneeNaissance = new Date(getValues('dateNaissance')).getFullYear();
        let anneeToday = new Date().getFullYear();

        if (anneeToday - anneeNaissance >= 18) {
            return true;
        }
        return false;
    }


    const gridFormPoste = () => {
        if (parseInt(watch('typeContrat')) === 1) {
            if (document.getElementById('gridDateFin') != null) {
                document.getElementById('gridDateFin').className = "col invisible d-none";
                document.getElementById('gridDateDebut').className = "col-6";
                document.getElementById('gridMaitreApprentissage').className = "col invisible d-none";
                document.getElementById('gridVolumeHoraire').className = "col-4";
                document.getElementById('gridLieuTravail').className = "col-4";
                document.getElementById('gridManager').className = "col-4";
                document.getElementById('gridDateFormation').className = 'col invisible d-none'
            }
        }
        else if (parseInt(watch('typeContrat')) === 2) {
            if (document.getElementById('gridDateFin') != null) {
                document.getElementById('gridDateFin').className = "col-3";
                document.getElementById('gridDateDebut').className = "col-3";
                document.getElementById('gridMaitreApprentissage').className = "col invisible d-none";
                document.getElementById('gridVolumeHoraire').className = "col-4";
                document.getElementById('gridLieuTravail').className = "col-4";
                document.getElementById('gridManager').className = "col-4";
                document.getElementById('gridDateFormation').className = 'col invisible d-none'
            }
        }
        else {
            if (document.getElementById('gridDateFin') != null) {
                document.getElementById('gridDateFin').className = "col-3";
                document.getElementById('gridDateDebut').className = "col-3";
                document.getElementById('gridVolumeHoraire').className = "col-3";
                document.getElementById('gridLieuTravail').className = "col-3";
                document.getElementById('gridManager').className = "col-3";
                document.getElementById('gridDateFormation').className = 'row visible  py-2 mx-1'
                document.getElementById('gridMaitreApprentissage').className = "col-3";
            }
        }
    }

    const creationSalarieEtPoste = () => {
        const radios = document.getElementsByName('choix');
        for (let i = 0; radios.length; i++) {

            if (radios[i].checked !== true) {


                setChoix("AJOUTER");
                setValue('description', "");

                break;
            }
            else {

                setChoix("SUIVANT");
                setMove(false);
                break;
            }
        }

    }

    const btnNextOrAddClick = () => {
        if (choix === "AJOUTER") {
            setFormStep(2);
            next();

        }
        else {
            btnNextOrAdd.onClick = next();
        }

    }


   
   

    return (
        <>
            <form className='container' name="form" onSubmit={handleSubmit(onSubmit)}>
                <div className='form-group'>
                    {formStep === 1 && (<section className='salarie' id='salarie'>
                        <div className='border py-2 px-1 mt-4'>
                            <div className='row'>
                                <div className='col-3'>
                                    <label htmlFor='nom'>Nom*</label>
                                    <input type="text" name="nom" id='nom' className='form-control'
                                        defaultValue="Barry"   {...register('nom', { required: "Veuillez entrer le nom" })} />
                                    {errors.nom && <span className='text-danger'>{errors.nom.message}</span>}
                                </div>

                                <div className='col-3'>
                                    <label htmlFor='prenom'>Prénom*</label>
                                    <input type="text" name="prenom" id='prenom' className='form-control ' defaultValue="Lara" {...register('prenom',
                                        { required: "Veuillez entrer le prenom" })} />
                                    {errors.prenom && <span className='text-danger'>{errors.prenom.message}</span>}
                                </div>

                                <div className='col-3'>
                                    <label htmlFor='email'>Email*</label>

                                    <input type="email" name="email" id="email" className='form-control' defaultValue="lara.barry@test.fr" {...register('email',
                                        {
                                            required: "Veuillez entrer le mail", pattern: {
                                                value: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
                                                message: "format ivalid"
                                            }
                                        })} />
                                    {errors.email && <span className='text-danger'>{errors.email.message}</span>}
                                </div>

                                <div className='col-3'>
                                    <label htmlFor='dateNaissance'>Date de Naissance*</label>
                                    <input type="date" id="dateNaissance" name="dateNaissance" className='form-control' defaultValue="1998-12-20" {...register('dateNaissance',
                                        { required: "Veuillez entrer la date" })} />
                                    {errors.dateNaissance && <span className='text-danger'>{errors.dateNaissance.message}</span>}
                                    {watch('dateNaissance') !== '' ? isMineur() !== true ? <span className='text-danger'>la date de naissance saisie, il s'agit d'un nineur</span> : "" : ""}
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-2'>
                                    <label htmlFor='genre'>Genre*</label>
                                    <select type="text" id="genre" name="genre" className='form-control' {...register('genre',
                                        { required: "Veuillez entrer son genre" })}  >
                                        <option value="0">Veuillez sélectionner le genre</option>
                                        <option value="HOMME">HOMME</option>
                                        <option value="FEMME">FEMME</option>
                                        <option value="NON_BINAIRE">NON_BINAIRE</option>

                                    </select>
                                </div>
                                <div className='col-2'>
                                    <label htmlFor='nationalite'>Nationalité</label>
                                    <select type="text" id='nationalite' name="nationalite" className='form-control' defaultValue='France'
                                        {...register('nationalite')}>
                                        {countries.map((country, key) => (
                                            <option key={key} value={country.name} >
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='col-3'>
                                    <label htmlFor='nss'>Numéro Securité Social*</label>
                                    <input type="text" name="nss" id="nss" className='form-control' defaultValue="198095933012367"    {...register('nss',

                                        {
                                            required: "Veuillez entrer son numéro de la securité social",
                                            pattern: {
                                                value: /^[1-478][0-9]{2}(0[1-9]|1[0-2]|62|63)(2[ABab]|[0-9]{2})(00[1-9]|0[1-9][0-9]|[1-8][0-9]{2}|9[0-8][0-9]|990)(00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})(0[1-9]|[1-8][0-9]|9[0-7])$/g,
                                                message: "format ivalid"
                                            }
                                        })} />
                                    {errors.nss && <span className='text-danger'>{errors.nss.message}</span>}
                                </div>
                                <div className='col-2'>
                                    <label htmlFor='villeNaissance'>Ville de Naissance*</label>
                                    <input type="text" id="villeNaissance" name="villeNaissance" className='form-control' defaultValue="Lille" {...register('villeNaissance',
                                        { required: "Veuillez entrer la ville de naissance" })} />
                                    {errors.villeNaissance && <span className='text-danger'>{errors.villeNaissance.message}</span>}
                                </div>
                                <div className='col-3'>
                                    <label htmlFor='departementNaissance'>Département de Naissance</label>
                                    <input type="text" id='departementNaissance' name="departementNaissance" className='form-control' defaultValue="Nord" {...register('departementNaissance',
                                        { required: "Veuillez entrer le departement de naissance" })} />
                                    {errors.departementNaissance && <span className='text-danger'>{errors.departementNaissance.message}</span>}
                                </div>
                            </div>
                        </div>
                        <label className='mt-4'>Conctact d'urgence*</label>
                        <div className='row border py-2 mx-1'>
                            <div className='col-6 '>
                                <label htmlFor='nomContactUrgence'>Nom et Prénom</label>
                                <input type="text" name="nomContactUrgence" id="nomContactUrgence" className='form-control' placeholder="Contact d'urgence"
                                    defaultValue="John Doe"  {...register('nomContactUrgence',
                                        { required: "Veuillez entrer le nom et de la personne à contacter" })} />
                                {errors.nomContactUrgence && <span className='text-danger'>{errors.nomContactUrgence.message}</span>}
                            </div>
                            <div className='col-6'>
                                <label htmlFor='numeroContactUrgence'>Numéro contact d'urgence</label>
                                <input type="text" name="numeroContactUrgence" id="numeroContactUrgence" className='form-control' placeholder="numéro téléphone"
                                    defaultValue="0600000000" {...register('numeroContactUrgence',
                                        {
                                            required: "Veuillez entrer le numero", pattern: {
                                                value: /^0[1-9]([-. ]?[0-9]{2}){4}$/,
                                                message: 'format invalid'
                                            }
                                        })} />
                                {errors.numeroContactUrgence && <span className='text-danger'>{errors.numeroContactUrgence.message}</span>}
                            </div>
                        </div>
                        <div className='mt-4 border ' >
                            <div className='row py-2 mx-1'>
                                <div className='col-6'>
                                    <label htmlFor='telPerso'>Tél perso.*</label>
                                    <input type="phone" className='form-control' defaultValue="0600000000" {...register('telPerso',
                                        {
                                            required: "Veuillez entrer le numero", pattern: {
                                                value: /^0[1-9]([-. ]?[0-9]{2}){4}$/,
                                                message: 'format invalid'
                                            }
                                        })} />
                                    {errors.telPerso && <span className='text-danger'>{errors.telPerso.message}</span>}
                                </div>
                                <div className='col-6'>
                                    <label htmlFor='mobilePerso'>Mobile perso.</label>
                                    <input type="phone" className='form-control' {...register('mobilePerso',
                                        {
                                            pattern: {
                                                value: /^0[1-9]([-. ]?[0-9]{2}){4}$/,
                                                message: 'format invalid'
                                            }
                                        })} />
                                </div>
                            </div>
                            <div className='row py-2 mx-1'>
                                <div className='col-6'>
                                    <label htmlFor='telPro'>Tél pro.</label>
                                    <input type="phone" className='form-control'  {...register('telPro', {
                                        pattern: {
                                            value: /^0[1-9]([-. ]?[0-9]{2}){4}$/,
                                            message: 'format invalid'
                                        }
                                    })} />
                                </div>
                                <div className='col-6'>
                                    <label htmlFor='mobilePro'>Mobile pro.</label>
                                    <input type="phone" className='form-control'  {...register('mobilePro', {
                                        pattern: {
                                            value: /^0[1-9]([-. ]?[0-9]{2}){4}$/,
                                            message: 'format invalid'
                                        }
                                    })} />
                                </div>
                            </div>
                        </div>

                        <label className='mt-4'>Adresse*</label>
                        <div className='border '>
                            <div className='row py-2 mx-1'>
                                <div className='col-4 '>
                                    <label htmlFor='numAddr'>Numéro</label>
                                    <input type="text" name="numAddr" id="numAddr" className='form-control' defaultValue={10} {...register('numAddr',
                                        { required: "Veuillez entrer le numero de la rue" })} />
                                    {errors.numAddr && <span className='text-danger'>{errors.numAddr.message}</span>}

                                </div>
                                <div className='col-4'>
                                    <label htmlFor='rue'>Rue</label>
                                    <input type="text" name="rue" id="rue" className='form-control'
                                        defaultValue="rue de la prosperité"    {...register('rue', { required: "Veuillez entrer le nom de la rue" })} />
                                    {errors.rue && <span className='text-danger'>{errors.rue.message}</span>}
                                </div>
                                <div className='col-4'>
                                    <label htmlFor='cmplAdrr'>Complément d'adresse</label>
                                    <input type="text" name="cmplAdrr" id="cmplAdrr" className='form-control' defaultValue="bis" {...register('cmplAdrr')} />
                                </div>

                            </div>
                            <div className='row py-2 mx-1'>
                                <div className='col-4 '>
                                    <label htmlFor='codePostal'>Code Postal</label>
                                    <input type="text" name="codePostal" id="codePostal" className='form-control'
                                        defaultValue={59000} {...register('codePostal', { required: "Veuillez entrer le code postal" })} />
                                    {errors.codePostal && <span className='text-danger'>{errors.codePostal.message}</span>}
                                </div>
                                <div className='col-4'>
                                    <label htmlFor='ville'>Ville</label>
                                    <input type="text" name="ville" id="ville" className='form-control'
                                        defaultValue={"Lille"}  {...register('ville', { required: "Veuillez entrer la ville" })} />
                                    {errors.ville && <span className='text-danger'>{errors.ville.message}</span>}
                                </div>
                                <div className='col-4'>
                                    <label htmlFor='pays'>Pays</label>
                                    <select type="text" name="pays" id="pays" className='form-control' defaultValue={'France'}
                                        {...register('pays')}>
                                        {countries.map((country, key) => (
                                            <option key={key} value={country.name} >
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='row py-2 mx-1'>
                            <div className='col-4 '>
                                <label htmlFor='service'>Service*</label>
                                <select type="text" id='service' name="service" className='form-control' disabled={disabledSelectService}
                                    {...register('service', { required: 'Veuillez sélectionnez un service' })}>
                                    <option value="0">Veuillez sélectionner un service</option>
                                    {domaines.map(domaine => (
                                        <option key={domaine.id} value={domaine.id}>{domaine.titre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='col-4'>
                                <label htmlFor='entreprise'>Entreprise*</label>
                                <select type="text" id='entreprise' name="entreprise" className='form-control'
                                    {...register('entreprise', { required: 'Veuillez sélectionnez une entreprise' })}>
                                    <option value="0">Veuillez sélectionner une entreprise</option>
                                    {entreprises.map(entreprise => (
                                        <option value={entreprise.id} key={entreprise.id}>{entreprise.nom}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='col-4'>
                                <label htmlFor='role'>Role*</label>
                                <Select

                                    value={rolesValue}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.id}
                                    options={roles.map((r) => ({ id: r.id, label: r.titre }))}
                                    onChange={handleChangeRole}
                                    isMulti
                                />

                            </div>
                        </div>
                        <div className="row border py-2 mx-1">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="competence">Compétence</label>
                                    {competencesSalarie.map((comp, index) => (
                                        <div key={index}>
                                            <div className="row mt-1" key={comp.id}>
                                                <div className="col">
                                                    <CSelect custom name="competence" id="competence" onChange={(e) => handleCompetence(e, index)} required multiple={false}
                                                        value={
                                                            competencesSalarie[index] === null ? 0 : competencesSalarie[index]
                                                        } isMulti={true}>
                                                        <option value="0">Veuillez sélectionner une compétence</option>
                                                        {competences.map((e, key) => (
                                                            <option key={key} value={e.id}>
                                                                {`${e.nom} (${e.id})`}
                                                            </option>
                                                        ))}
                                                    </CSelect>

                                                </div>
                                                <div className="col">
                                                    <select className="custom-select" name='competenceNote' id='competenceNote' required onChange={(e) => handleCompetenceNote(e, index)} multiple={false}
                                                        value={competencesNote[index] === null ? "0" : competencesNote[index]}>
                                                        <option key={0} value="0" defaultValue>Note de la compétence</option>
                                                        <option key={1} value="DEBUTANT">Débutant</option>
                                                        <option key={2} value="JUNIOR">Junior</option>
                                                        <option key={3} value="CONFIRME">Confirmé</option>
                                                        <option key={4} value="SENIOR">Sénior</option>
                                                        <option key={5} value="EXPERT">Expert</option>
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <CButton
                                                        className="btn btn-danger"
                                                        onClick={() => handleCompetenceDelete(index)}
                                                        title="Vous voulez supprimer cette compétence ?"
                                                    >
                                                        {" "} <FontAwesomeIcon icon={faTrash} />
                                                    </CButton>
                                                </div>
                                            </div>
                                            <p className="mb-0"><span className="text-danger">{competencesError[index]}</span></p>
                                            <p className="mt-0"><span className="text-danger mt">{competencesErrorDoublon[index]}</span></p>
                                        </div>
                                    ))}
                                </div>
                                <CButton className="mt-1 mb-1" block color="info" id="btnAjtComp" title="Sélectionner un service." disabled={disabledBtnAjtComp} onClick={addAutreCompetence}>
                                    Ajouter une compétence
                                </CButton>
                            </div>
                        </div>
                        <div className='row mt-5'>
                            <label className='mx-3'>Souhaitez-vous ajouter un poste au salarie en cour de création? *</label>
                            <input type="radio" name='choix' value="oui" id="posteOui" onClick={() => creationSalarieEtPoste()} />
                            <label htmlFor='posteOui' className='mx-2 my-1'>Oui</label>
                            <input type="radio" name='choix' value="non" id="posteNon" defaultChecked onClick={() => creationSalarieEtPoste()} />
                            <label htmlFor='posteNon' className='mx-2 my-1' >Non</label>
                        </div>
                        <button type='button' id='btnNextOrAdd' className='btn btn-outline-primary btn-block mt-4 ' disabled={!verificationFormSalarie()}
                            /*
                            disabled={watch('service')==='0' &&  watch('entreprise')==='0' && competencesValue === undefined?true:false}*/
                            onClick={() => { btnNextOrAddClick() }}>{choix}</button>
                    </section>
                    )}
                    {/* FORMULAIRE DU CREATION DU POSTE */}

                    {formStep === 2 && (<section className='poste py-2 mx-1' id='poste'>

                        <label htmlFor='description' className='mt-4'>Description</label>
                        <textarea className='form-floating form-control py-2 mx-1' name='description' id='description' placeholder='Fiche du poste' {...register('description',
                            { required: false })} defaultValue="description du poste...." />
                        {errors.description && <span className='text-danger'>{errors.description.message}</span>}

                        <div className='row py-2 mx-1'>
                            <div className='col-3 '>
                                <label htmlFor='typeContrat'>Type de contrat</label>
                                <select className='form-control' name='contrat'
                                    {...register('typeContrat', { required: 'Veuillez sélectionnez le type de contrat' })}>
                                    <option value="0">Veuillez sélectionnez le type de contrat</option>
                                    {contrats.map(contrat => (
                                        <option value={contrat.id} key={contrat.id}>{contrat.type}</option>
                                    ))}
                                </select>
                                {errors.typeContrat && <span className='text-danger'>{errors.typeContrat.message}</span>}
                            </div>
                            <div className='col-3'>
                                <label htmlFor='intitulePoste'>Intitulé du poste</label>
                                <select type="text" id='intitulePoste' name="intitulePoste" className='form-control'
                                    {...register('intitulePoste', { required: "Veuillez sélectionnez l'intitulé du poste" })}>
                                    <option value="0">Veuillez sélectionnez l'intitulé du poste</option>
                                    {titrePoste.map(titre => (
                                        <option value={titre.id} key={titre.id}>{titre.intitule}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label htmlFor='renumeration'>Rémunération brut (€)</label>
                                <input type="text" name="renumeration" id="renumeration'" className='form-control' defaultValue={2000}  {...register('remuneration',
                                    { required: "Veuillez entrer la rémunération du salarié" })} />
                                {errors.remuneration && <span className='text-danger'>{errors.remuneration.message}</span>}
                            </div>
                            <div className='col-3'>
                                <label htmlFor='coef'>Coefficient</label>
                                <input type="number" name="coef" id="coef" className='form-control' defaultValue={12} {...register('coef',
                                    { required: "Veuillez entrer le coefficient" })} />
                                {errors.coeff && <span className='text-danger'>{errors.coeff.message}</span>}
                            </div>
                        </div>

                        <div className='row py-2 mx-1'>
                            <div className='col-3 '>
                                <label htmlFor='position'>Position</label>
                                <select type="text" name="position" id="position" className='form-control' {...register('position',
                                    { required: "Veuillez entrer sa position" })} >
                                    <option value="0">Veuillez sélectionner une position</option>
                                    <option value="CADRE">Cadre</option>
                                    <option value="NON_CADRE">Non cadre</option>F
                                    {errors.position && <span className='text-danger'>{errors.position.message}</span>}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label htmlFor='coefTravailler'>Coefficient travaillé (%)</label>
                                <input type="number" min="0" max="100" pattern="[0-9]*" step="10" name="coefTravailler" id="c" className='form-control' defaultValue={20} {...register('coefTravaille',
                                    { required: "Veuillez entrer le coefficient travailler entre 0 à 100" })} />
                                {errors.coefTravaille && <span className='text-danger'>{errors.coefTravaille.message}</span>}
                            </div>
                            <div className='col-3' id='gridDateDebut'>
                                <label htmlFor='dateDebut'>Date de début</label>
                                <input type="date" name="dateDebut" id="dateDebut" className='form-control' defaultValue={'2022-09-03'} {...register('dateDebut',
                                    { required: "Veuillez entrer la date du début d'activité" })} />
                                {errors.dateDebut && <span className='text-danger'>{errors.dateDebut.message}</span>}
                            </div>
                            <div className='col-3' id='gridDateFin'>
                                <label htmlFor='dateFin'>Date de fin</label>
                                <input type="date" name="dateFin" id="dateFin" className='form-control' defaultValue={'2023-09-03'} {...register('dateFin',
                                    { required: "Veuillez entrer la date du fin d'activité" })} />
                                {errors.dateFin && <span className='text-danger'>{errors.dateFin.message}</span>}
                                {(watch('dateDebut')) !== '' && (watch('dateFin')) !== '' ? (watch('dateDebut') < watch('dateFin')) === false ? <span className='text-danger'>La date de fin doit être supérieur au date de début</span> : "" : ""}
                            </div>
                        </div>

                        <div className="row invisible d-none" id="gridDateFormation" >
                            <div className="col-6">
                                <label htmlFor="debutFormation">Date de début de formation *</label>
                                <input type="date" className="form-control" id="debutFormation" name="debutFormation" defaultValue={'2022-10-03'}  {...register('debutFormation',
                                    { required: "Veuillez entrer la date de  début de la formation" })} />
                                {
                                    errors.debutFormation && <span className='text-danger'>{errors.debutFormation.message}</span>
                                }

                            </div>
                            <div className="col-6">
                                <label htmlFor="finFormation">Date de fin de formation *</label>
                                <input type="date" className="form-control" id="finFormation" name="finFormation" defaultValue={'2023-10-03'} {...register('finFormation',
                                    { required: "Veuillez entrer la date du fin  de la formation" })} />
                                {errors.finFormation && <span className='text-danger'>{errors.finFormation.message}</span>}
                                {(watch('debutFormation')) !== '' && (watch('finFormation')) !== '' ? (watch('debutFormation') < watch('finFormation')) === false ? <span className='text-danger'>La date de fin de formation doit être supérieur au date de début de formation</span> : "" : ""}
                            </div>
                        </div>

                        <div className='row py-2 mx-1'>
                            <div className='col-3 ' id='gridVolumeHoraire'>
                                <label htmlFor='volumeHoraire'>Volume horaire *</label>
                                <input type="number" name="volumeHoraire" id="volumeHoraire" min="0" className='form-control' defaultValue={35} {...register('volumeHoraire',
                                    { required: "Veuillez entrer le volume horaire soit par heure ou par jour" })} />
                                {errors.volumeHoraire && <span className='text-danger'>{errors.volumeHoraire.message}</span>}
                                <input type="radio" id="heures" name='vhoraire' defaultChecked />
                                <label htmlFor='heures' className='mx-2 my-1'>Heures</label>
                                <input type="radio" id="jours" name='vhoraire' />
                                <label htmlFor='jours' className='mx-2 my-1'> Jours</label>
                            </div>
                            <div className='col-3' id='gridLieuTravail'>
                                <label htmlFor='lieuTravail'>Lieu de travail *</label>
                                <select type="text" id='lieuTravail' name="lieuTravail" className='form-control'
                                    {...register('lieuTravail', { required: "Veuillez sélectionnez le lieu de travail" })}>
                                    <option value="0">Veuillez sélectionnez le lieu de travail</option>
                                    {
                                        entreprises.map(entreprise => (
                                            <option value={entreprise.id} key={entreprise.id}>{entreprise.nom}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className='col-4'>
                                <label htmlFor='dureePeriodeEssaie'>Période d'essai (jours) *</label>
                                <input type="number" name="dureePeriodeEssaie" id="dureePeriodeEssaie'" className='form-control'  {...register('dureePeriodeEssaie',
                                    { required: "Veuillez entrer la période d'essai du salarié" })} />
                                {errors.remuneration && <span className='text-danger'>{errors.dureePeriodeEssaie.message}</span>}
                            </div>
                        </div>
                        <div className='row py-2 mx-1'>
                            <div className='col-3' id='gridManager'>
                                <label htmlFor='manager'>Manager *</label>
                                <select type="text" id='manager' name="manager" className='form-control'
                                    {...register('manager', { required: "Veuillez sélectionnez son manager" })}>
                                    <option value="0">Veuillez sélectionnez son manager</option>
                                    {
                                        salaries.map(sal => (
                                            <option value={sal.id} key={sal.id}>{sal.prenom + " " + sal.nom}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className='col-3' id='gridMaitreApprentissage'>
                                <label htmlFor='maitreApprentissage'>Maitre d'apprentissage *</label>
                                <select type="text" id='maitreApprentissage' name="maitreApprentissage" className='form-control'
                                    {...register('maitreApprentissage', { required: "Veuillez sélectionnez son maître d'apprentissage" })}>
                                    <option key={0} value="0">Veuillez sélectionnez son maître d'apprentissage</option>
                                    {
                                        salaries.map(sal => (
                                            <option value={sal.id} key={sal.id}>{sal.prenom + " " + sal.nom}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="row py-2 mx-1 mb-1">
                            <div className="col mt-1">
                                <label htmlFor="competences">Compétences</label>
                                <Select
                                    id="competences"
                                    name="competences"
                                    placeholder="Liste des compétences"
                                    onChange={handleChangeCompetencePoste}
                                    options={competences.map((e) => ({ label: e.nom, value: e.id }))}
                                    isMulti={true}
                                />
                            </div>
                        </div>
                        <div className='col'>
                            <div className="custom-file">
                                <label className="custom-file-label" htmlFor="contratPdf" >{contratPdf} </label>
                                <input type="file" accept="application/pdf" className="custom-file-input"
                                    id="contratPdf" onChange={handleChangeContratPdf} />
                            </div>
                        </div>
                        <button type='button' className='btn btn-outline-primary btn-block mt-4 ' onClick={() => next()}  >SUIVANT</button>
                        <button type='button' className='btn btn-outline-danger btn-block mt-4 ' onClick={() => prev()}>RETOUR</button>
                        {gridFormPoste()}
                    </section>
                    )}

                    {formStep === 3 && (<section >
                        <h2 className='text-dark text-center mb-3'>Récapitulatif</h2>
                        


                        <div className='row' id='recapitulatif'>

                            <div className='col-6' id='fieldsSalarie'>
                                <h3 className='text-center'>Informations du Salarié</h3>
                                <div className="table-responsive" >
                                    <table className="table table-bordered table-hover">
                                        <tbody>

                                            <tr>
                                                <th>Nom</th>
                                                <td>{watch('nom')}</td>
                                            </tr>
                                            <tr>
                                                <th>Prenom</th>
                                                <td>{watch('prenom')}</td>
                                            </tr>
                                            <tr>
                                                <th>Email</th>
                                                <td>{watch('email')}</td>
                                            </tr>
                                            <tr>
                                                <th>Date de Naissance</th>
                                                <td>{watch('dateNaissance')}</td>

                                            </tr>
                                            <tr>
                                                <th>Nationalité</th>
                                                <td>{watch('nationalite')}</td>
                                            </tr>
                                            <tr>
                                                <th>Genre</th>
                                                <td>{parseInt(watch('genre')) !== 0 ? watch('genre') : ""}</td>
                                            </tr>
                                            <tr>
                                                <th>Numéro Sécurité sociale</th>
                                                <td>{watch('nss')}</td>
                                            </tr>
                                            <tr>
                                                <th>Ville de Naissance</th>
                                                <td>{watch('villeNaissance')}</td>
                                            </tr>
                                            <tr>
                                                <th>Département de naissance</th>
                                                <td>{watch('departementNaissance')}</td>
                                            </tr>
                                            <tr>
                                                <th>Nom et Prénom</th>
                                                <td>{watch('nomContactUrgence')}</td>
                                            </tr>
                                            <tr>
                                                <th>Numéro contact d'urgence</th>
                                                <td>{watch('numeroContactUrgence')}</td>
                                            </tr>
                                            <tr>
                                                <th>Tél perso</th>
                                                <td>{watch('telPerso')}</td>
                                            </tr>
                                            <tr>
                                                <th>mobile perso</th>
                                                <td>{watch('mobilePerso')}</td>
                                            </tr>
                                            <tr>
                                                <th>Tél pro</th>
                                                <td>{watch('telPro')}</td>
                                            </tr>
                                            <tr>
                                                <th>Mobile pro</th>
                                                <td>{watch('mobilePro')}</td>
                                            </tr>
                                            <tr>
                                                <th>Numéro</th>
                                                <td>{watch('numAddr')}</td>
                                            </tr>
                                            <tr>
                                                <th>Rue</th>
                                                <td>{watch('rue')}</td>
                                            </tr>
                                            <tr>
                                                <th>Complément d'adresse</th>
                                                <td>{watch('cmplAdrr')}</td>
                                            </tr>
                                            <tr>
                                                <th>Code Postal</th>
                                                <td>{watch('codePostal')}</td>
                                            </tr>
                                            <tr>
                                                <th>Ville</th>
                                                <td>{watch('ville')}</td>
                                            </tr>
                                            <tr>
                                                <th>Pays</th>
                                                <td>{watch('pays')}</td>
                                            </tr>
                                            <tr>
                                                <th>Service</th>
                                                <td>{domaines.map((s) => s.id === parseInt(watch('service')) ? s.titre : "")}</td>
                                            </tr>
                                            <tr>
                                                <th>Entreprise</th>
                                                <td>{entreprises.map((e) => e.id === parseInt(watch('entreprise')) ? e.nom : "")}</td>
                                            </tr>
                                            <tr>
                                                <th>Compétences du salarié</th>
                                                <td><ul>{(competencesSalarie.length > 0) && competencesSalarie.map((c, index) => ((
                                                    <li key={index}>{(competences.map(c2 => c2.id === c ? c2.nom : "")).join("") + " : " + competencesNote[index]}</li>
                                                )))}</ul></td>
                                            </tr>
                                            <tr>
                                                <th>Rôles</th>
                                                <td><ul>{rolesValue.map(r => <li key={r.id}>{r.label}</li>)}</ul></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            
                                <div className='col-6' id='tablePoste'>
                                    <h3 className='text-center'>Informations du Poste</h3>
                                    <div className="table-responsive" >
                                        <table className="table table-bordered table-hover">
                                            <tbody>
                                                <tr>
                                                    <th>Description</th>
                                                    <td>{watch('description')}</td>
                                                </tr>
                                                <tr>
                                                    <th>Type de contrat</th>
                                                    <td>{contrats.map((c) => c.id === parseInt(watch('typeContrat')) ? c.type : "")}</td>
                                                </tr>
                                                <tr>
                                                    <th>Intitulé du poste</th>
                                                    <td>{titrePoste.map((p) => p.id === parseInt(watch('intitulePoste')) ? p.intitule : "")}</td>
                                                </tr>
                                                <tr>
                                                    <th>Rémuneration brut(€)</th>
                                                    <td>{watch('remuneration')}</td>
                                                </tr>
                                                <tr>
                                                    <th>Coefficient</th>
                                                    <td>{watch('coef')}</td>
                                                </tr>
                                                <tr>
                                                    <th>Position</th>
                                                    <td>{(parseInt(watch('position'))) === 0 ? "" : watch('position')}</td>
                                                </tr>
                                                <tr>
                                                    <th>Coefficient travaillé (%)</th>
                                                    <td>{watch('coefTravaille')}</td>
                                                </tr>
                                                <tr>
                                                    <th>Date de début</th>
                                                    <td>{watch('dateDebut')}</td>
                                                </tr>
                                                <tr>
                                                    <th>Date de fin</th>
                                                    <td>{watch('dateFin')}</td>
                                                </tr>
                                                <tr>
                                                    <th>Voulume horaire</th>
                                                    <td>{watch('volumeHoraire')}</td>
                                                </tr>
                                                <tr >
                                                    <th>lieu de travail</th>
                                                    <td>{entreprises.map((e) => e.id === parseInt(watch('lieuTravail')) ? e.nom : "")}</td>
                                                </tr>
                                                <tr>
                                                    <th>Période d'essai</th>
                                                    <td>{watch('dureePeriodeEssaie')} jours</td>
                                                </tr>
                                                <tr >
                                                    <th>Manager</th>
                                                    <td>{salaries.map((s) => s.id === parseInt(watch('manager')) ? s.prenom + " " + s.nom : "")}</td>
                                                </tr>
                                                <tr >
                                                    <th>Maître d'apprentissage</th>
                                                    <td>{salaries.map((s) => s.id === parseInt(watch('maitreApprentissage')) ? s.prenom + " " + s.nom : "")} </td>
                                                </tr>
                                                <tr>
                                                    <th>Compétences du poste</th>
                                                    <td><ul>{competencesPoste.map(c => <li key={c.id}>{c.label}</li>)}</ul></td>
                                                </tr>
                                                <tr>
                                                    <th>Fichier du contrat</th>
                                                    <td>{contratPdf}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>

                                </div>
                            

                        </div>
                        <div className=' mt-3 mb-3'>
                        {
                            message === "" ? "" : <p className=' alert alert-info' role='alert'>{message}</p>
                        }
                        </div>

                        <div className='row mt-4'>
                            <div className='col-4'>
                                <button type='submit' className='btn btn-outline-success btn-block' >{loading && <CSpinner size='sm' variant="border"/>}AJOUTER</button>

                            </div>
                            <div className='col-4'>
                                <button type='submit' className='btn btn-outline-primary btn-block' id="modifier" onClick={() => prev()}>MODIFIER</button>

                            </div>
                            <div className='col-4'>

                                <button type='reset' className='btn btn-outline-danger btn-block' onClick={annulation}>ANNULER</button>
                            </div>
                        </div>
                    </section>)}
                </div>
            </form>
        </>
    );
};
export default withRouter(CreatedSalaryAndPost);