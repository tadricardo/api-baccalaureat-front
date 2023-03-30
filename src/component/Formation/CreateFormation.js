import { React, useState, useEffect } from 'react';
import { CButton, CSelect, CSpinner } from '@coreui/react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router';
import organismeDeFormationService from 'src/services/organismeDeFormation.service';
import serviceService from 'src/services/service.service';
import competenceService from 'src/services/competence.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import formationsService from 'src/services/formations.service';



const CreateFormation = () => {

  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const [domaines, setDomaines] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [internes, setInternes] = useState([]);
  const [externes, setExternes] = useState([]);
  const [etat, setEtat] = useState(false);
  const [loading, setLoading] = useState(false);

  const [competencesFormation, setCompetencesFormation] = useState([]);
  const [competencesNote, setCompetencesNote] = useState([]);
  const [competencesError, setCompetencesError] = useState([]);
  const [competencesErrorDoublon, setCompetencesErrorDoublon] = useState([]);




  useEffect(() => {
    serviceService.getAllService().then(res => {
      setDomaines(res.data)
    });

    competenceService.getAllCompetence().then(res => {
      setCompetences(res.data);
    });
    organismeDeFormationService.getAllOrganismesInternes().then(res => {
      setInternes(res.data);
    });

    organismeDeFormationService.getAllOrganismesExternes().then(res => {
      setExternes(res.data);
    });

    

  }, []);

  const interneOrExterneBool = () => {
    etat !== true ? setEtat(true) : setEtat(false)
  }

  const handleCompetence = (e, i) => {
    const compSal = [...competencesFormation];
    compSal[i] = parseInt(e.target.value);
    setCompetencesFormation(compSal);

    const compE = [...competencesError];
    compE[i] = compSal[i] !== null && compSal[i] !== 0 && competencesNote[i] !== undefined && parseInt(competencesNote[i]) !== 0 ? null : "Une compétence doit avoir une note.";
    setCompetencesError(compE);

    const compED = [...competencesErrorDoublon];
    compED[i] = competencesFormation.filter(c => c === parseInt(e.target.value)).length > 0 ? "Cette compétence est déjà sélectionnée." : null;
    setCompetencesErrorDoublon(compED);
  }

  const handleCompetenceNote = (e, i) => {
    const compNote = [...competencesNote];
    compNote[i] = e.target.value;
    setCompetencesNote(compNote);

    const compE = [...competencesError];
    compE[i] = competencesFormation[i] !== null && competencesFormation[i] !== 0 && compNote[i] !== undefined && compNote[i] !== "0" ? null : "Une compétence doit avoir une note.";
    setCompetencesError(compE);
  }

  const handleCompetenceDelete = (i) => {
    const compSal = [...competencesFormation];
    compSal.splice(i, 1);
    setCompetencesFormation(compSal);

    const compNote = [...competencesNote];
    compNote.splice(i, 1);
    setCompetencesNote(compNote);

    const compE = [...competencesError];
    compE.splice(i, 1);
    setCompetencesError(compE);

    const compED = [...competencesErrorDoublon];
    compED.splice(i, 1);
    setCompetencesErrorDoublon(compED);

  }

  const addAutreCompetence = () => {
    setCompetencesFormation([...competencesFormation, [0]]);
    setCompetencesNote([...competencesNote, [0]]);
    setCompetencesError([...competencesError, ['']]);
    setCompetencesErrorDoublon([...competencesErrorDoublon, ['']]);

  }
 
  const verificationDate=()=>{
    let dateDebut = new Date(watch('dateDebut'));
    let dateFin = new Date(watch('dateFin'));
    if(dateFin >= dateDebut)
    {
      return true;
    }
    return false;
  }
 
  const onSubmit = (data) => {

   
    let competenceArray = []
    competencesFormation.map((c,index)=>{

      
    const obj= {
        id: 0,
        competence: {
          id: c,
        },
        note: competencesNote[index]
      }
      competenceArray.push(obj)
    });
  
  
    const req = {
       "formation": {
        titre:watch('titre'),
        domaine:{id:watch('domaine')},
        duree:watch("duree"),
        prix:watch('prix'),
        dateDebut:watch('dateDebut'),
        dateFin:watch('dateFin'),
        statutOrganisme:watch('statutOrganisme'),
        organismeDeFormationDto:{"id":watch('organismeDeFormationDto')},
        statut:"EN_COURS"
        },
      
       "competences": [...competenceArray]
    }
    console.log(watch('organismeDeFormationDto'))
    const stringify = JSON.stringify(req);
    const requete  =JSON.parse(stringify);
 
    formationsService.saveWithCompetence(requete).then((res) => {
      setLoading(true);
      //console.log(res.data);
      window.setTimeout(()=>{
        window.location='#/formations/liste'
      },2500)
    })

  }
  return (
    <>
      <form name='form' onSubmit={handleSubmit(onSubmit)}>

        <div className='row'>

          <div className="col-6">
            <div className="form-group">
              <label htmlFor="titre">Titre*</label>
              <input
                type="text"
                name="titre"
                className="form-control"
                id="titre"
                required
                placeholder="Saisir un titre de formation"
                {...register('titre', { required: "Veuillez entrer le titre" })} />
              {errors.titre && <span className='text-danger'>{errors.titre.message}</span>}
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <label htmlFor='domaine'>Service*</label>
              <select type="text" id='domaine' name="domaine" className='form-control' required
                {...register('domaine', { required: 'Veuillez sélectionnez un service' })}>
                <option value="0">Veuillez sélectionner un service</option>
                {domaines.map(domaine => (
                  <option key={domaine.id} value={domaine.id}>{domaine.titre}</option>
                ))}
              </select>
            </div>

          </div>
        </div>
        <div className='row'>
          <div className="col-6">
            <div className="form-group">
              <label htmlFor="duree">Durée * <span><small><i>(en heure)</i></small></span></label>
              <input
                type="number"
                name="duree"
                className="form-control"
                id="duree"
                required
                placeholder="Saisir une durée (en heure)"
                {...register('duree', { required: "Veuillez entrer la durée et elle doit pas  être supérieur à zéro" })} />
              {errors.duree && parseInt(watch('duree')) >0 && <span className='text-danger'>{errors.duree.message}</span>}
              {watch('duree') === ""? "":parseInt(watch('duree')) > 0  ? "": <span className='text-danger'>la durée dois être supérieur à 0</span> }

            </div>
          </div>

          <div className="col-6">
            <div className="form-group">
              <label htmlFor="prix">Prix * <span><small><i>(HT)</i></small></span></label>
              <input
                type="number"
                name="prix"
                className="form-control"
                id="prix"
                placeholder='Veuillez entrer le prix'
                required
                {...register('prix', { required: "Veuillez entrer le prix" })} />
              {errors.prix && <span className='text-danger'>{errors.prix.message}</span>}
              {watch('prix') === ""?"": parseInt(watch('prix')) > 0  ?"": <span className='text-danger'>le prix dois être supérieur à 0</span>}

            </div>
          </div>

        </div>
        <div className="row">
          <div className="col-6">
            <div className="form-group">
              <label htmlFor="dateDebut">Date début *</label>
              <input
                type="date"

                name="dateDebut"
                className="form-control"
                id="dateDebut"

                required
                {...register('dateDebut',
                  { required: "Veuillez entrer la date de  début de la formation" })} />
              {
                errors.dateDebut && <span className='text-danger'>{errors.dateDebut.message}</span>
              }
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <label htmlFor="dateFin">Date de fin *</label>
              <input
                type="date"

                name="dateFin"
                className="form-control"
                id="dateFin"

                required
                {...register('dateFin',
                  { required: "Veuillez entrer la date de  fin de la formation" })} />
              {
                errors.dateFin && <span className='text-danger'>{errors.dateFin.message}</span>
              }
              {watch('dateDebut') !== ''  &&  watch('dateFin') !== ''? verificationDate() !== true ? <span className='text-danger'>la date de fin dois être supérieur à la date du début</span> : "" : ""}

            </div>
          </div>
        </div>

        <div className="row">
          <div className='col '>
            <label className='mx-3'>Statut de la formation? *</label>
            <input type="radio" name='statutOrganisme' value="INTERNE" {...register('statutOrganisme')} onClick={interneOrExterneBool} defaultChecked />
            <label htmlFor='interne' className='mx-2 my-1'>INTERNE</label>
            <input type="radio" name='statutOrganisme' value="EXTERNE" {...register('statutOrganisme')} onClick={interneOrExterneBool} />
            <label htmlFor='externe' className='mx-2 my-1' >EXTERNE</label>

          </div>
        </div>

        <div className="row">

          <div className=" col form-group">
            <label htmlFor="organismeDeFormationDto" name="organismeDeFormationDto">organisme*</label>

            <select className="form-control" name="organismeDeFormationDto" id="organismeDeFormationDto" {...register('organismeDeFormationDto')} required >

              <option>Veuillez selectionner l'organisme</option>
              {etat !== true ? internes.map((organisme, key) => (
                <option key={key} value={organisme.id}>
                  {organisme.organisme}
                </option>
              )) : externes.map((organisme, key) => (
                <option key={key} value={organisme.id}>
                  {organisme.organisme}
                </option>
              ))

              }

            </select>

            {/* <span className="text-danger">{currentErrors.organisme}</span> */}
          </div>
        </div>

        <div className="row border py-2 mx-1">
          <div className="col">
            <div className="form-group">
              <label htmlFor="competence">Compétence visée</label>
              {competencesFormation.map((comp, index) => (
                <div key={index}>
                  <div className="row mt-1" key={comp.id}>
                    <div className="col">
                      <CSelect custom name="competence" id="competence" onChange={(e) => handleCompetence(e, index)} required multiple={false}
                        value={
                          competencesFormation[index] === null ? 0 : competencesFormation[index]
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
            <CButton className="mt-1 mb-1" block color="info" id="btnAjtComp" title="Sélectionner un service." onClick={addAutreCompetence}>
              Ajouter une compétence
            </CButton>
          </div>
        </div>

        <CButton className="mt-3" type="submit" block color="info" >
         { loading && <CSpinner size='sm' variant="border"/>}Enregistrer la formation
        </CButton>

        <CButton className="mt-1" block color="danger" onClick={() => { window.location = "#/formations/liste" }}>
          Annuler
        </CButton>
      </form>
    </>
  );
};

export default withRouter(CreateFormation);