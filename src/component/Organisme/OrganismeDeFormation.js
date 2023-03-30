import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { useForm } from 'react-hook-form';
import countries from 'world_countries_lists/data/countries/fr/countries.json';
import OrganismeDeFormationService from "../../services/organismeDeFormation.service"
import { CSpinner } from '@coreui/react';

const OrganismeDeFormation = () => {
    const { register, handleSubmit, formState: { errors, isValid },watch } = useForm({ mode: "all" });

   const organismeDeFormation = {
        organisme: watch('organisme'),
        mail: watch('mail'),
        nomDeLaPersonne: watch('nomDeLaPersonne'),
        statut: watch('statut'),
        adresse: {
            numero: watch('numAddr'),
            voie: watch('rue'),
            complementAdresse:watch('cmplAdrr'),
            codePostal:watch('codePostal'),
            ville: watch('ville'),
            pays: watch('pays')
        }
    }

    
    const [message, setMessage] = useState();
    const [loading ,setLoading]=useState(false)
    const onSubmit = () => {
       
            const stringify =JSON.stringify(organismeDeFormation);
            const data=JSON.parse(stringify);
           // console.log(data)
            OrganismeDeFormationService.saveOrUpdateOrganismeDeFormation(data).then((res) => {
                setLoading(true)
                setMessage("Création avec success...")

                window.setTimeout(()=>{
                    window.location="#/formations/liste-organisme-de-formation";

                },2500)
            }).catch(()=>{
                setMessage("Echec...");
                setMessage("Verifier les informations saisie")
            })
        }

       
    


    return (
        <>
        
            <form className='container' onSubmit={handleSubmit(onSubmit)}>
                <div className='row'>

                    <div className='col-6'>
                        <label htmlFor='organisme'>Organisme*</label>
                        <input type="text" className='form-control' name='organisme' id='organisme' {...register('organisme',
                            { required: "Veuillez entrer le nom de l'organisme" })} />
                        {
                            errors.organisme && <span className='text-danger'>{errors.organisme.message}</span>
                        }
                    </div>

                    <div className='col-6'>
                        <label htmlFor='mail'>Mail</label>
                        <input type="mail" className='form-control' name='mail' id='mail' {...register('mail',
                            { required: "Veuillez entrer l'adresse mail" })} />
                        {
                            errors.mail && <span className='text-danger'>{errors.mail.message}</span>
                        }
                    </div>

                </div>

                <div className='row'>

                    <div className='col-6'>
                        <label htmlFor='nomDeLaPersonne'>Nom de la personne*</label>
                        <input type="text" className='form-control' name='nomDeLaPersonne' id='nomDeLaPersonne' {...register('nomDeLaPersonne',
                            { required: "Veuillez entrer le nom de la personne" })} />
                        {
                            errors.nomDeLaPersonne && <span className='text-danger'>{errors.nomDeLaPersonne.message}</span>
                        }
                    </div>
                    <div className='col-6'>
                        <label htmlFor='statut'>Statut*</label>
                        <select className='form-control' name='statut' id='statut' {...register('statut',
                            { required: "Veuillez selectionner un statut" })} >
                            <option value="0">Veuillez choisir le statut de la formation Externe ou Interne</option>
                            <option value="EXTERNE">EXTERNE</option>
                            <option value="INTERNE">INTERNE</option>
                        </select>

                    </div>
                </div>

                <label className='mt-4'>Adresse*</label>
                <div className='border mb-5 '>
                    <div className='row py-2 mx-1'>
                        <div className='col-4 '>
                            <label htmlFor='numAddr'>Numéro</label>
                            <input type="text" name="numAddr" id="numAddr" className='form-control' {...register('numAddr',
                                { required: "Veuillez entrer le numero de la rue" })} />
                            {
                                errors.numAddr && <span className='text-danger'>{errors.numAddr.message}</span>
                            }

                        </div>
                        <div className='col-4'>
                            <label htmlFor='rue'>Rue</label>
                            <input type="text" name="rue" id="rue" className='form-control'
                                {...register('rue', { required: "Veuillez entrer le nom de la rue" })} />
                            {
                                errors.rue && <span className='text-danger'>{errors.rue.message}</span>
                            }
                        </div>
                        <div className='col-4'>
                            <label htmlFor='cmplAdrr'>Complément d'adresse</label>
                            <input type="text" name="cmplAdrr" id="cmplAdrr" className='form-control' {...register('cmplAdrr')} />

                        </div>

                    </div>
                    <div className='row py-2 mx-1'>
                        <div className='col-4 '>
                            <label htmlFor='codePostal'>Code Postal</label>
                            <input type="text" name="codePostal" id="codePostal" className='form-control'
                                {...register('codePostal', { required: "Veuillez entrer le code postal" })} />
                            {
                                errors.codePostal && <span className='text-danger'>{errors.codePostal.message}</span>
                            }

                        </div>
                        <div className='col-4'>
                            <label htmlFor='ville'>Ville</label>
                            <input type="text" name="ville" id="ville" className='form-control'
                                {...register('ville', { required: "Veuillez entrer la ville" })} />
                            {
                                errors.ville && <span className='text-danger'>{errors.ville.message}</span>
                            }

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
                <p className=' alert alert-info' role='alert'>{ loading && message}</p>
                <div className='row'>
                    <div className='col-6'>
                        <button className='btn btn-outline-primary btn-block' disabled={!isValid} > {loading && <CSpinner size='sm' variant="border"/>}AJOUTER</button>
                    </div>

                    <div className='col-6'>
                        <button className='btn btn-outline-danger btn-block' onClick={()=>{window.location="#/formations/liste-organisme-de-formation"}} >ANNULER</button>
                    </div>

                </div>


            </form>

        </>
    );
};

export default withRouter(OrganismeDeFormation);