import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router';
import { useForm } from 'react-hook-form';
import countries from 'world_countries_lists/data/countries/fr/countries.json';
import OrganismeDeFormationService from "../../services/organismeDeFormation.service"
import { CSpinner } from '@coreui/react';



const UpdateOrganisme = () => {
    const { handleSubmit } = useForm({ mode: "all" });

    const [organisme, setOrganisme] = useState({
        organisme: "",
        mail: "",
        nomDeLaPersonne: "",
        statut: "",
        adresse: {
            numero: "",
            voie: "",
            complementAdresse: "",
            codePostal: "",
            ville: "",
            pays: ""
        }

    });
    const [message, setMessage] = useState();
    const { id } = useParams();
     const [loading, setLoading]=useState(false)
    useEffect(() => {

        OrganismeDeFormationService.getOrganismeDeFormationById(parseInt(id)).then((res) => {

            setOrganisme(res.data);
          


        }).catch((e) => {
            console.log(e)
        })

    },  [id])

    const handleChange = (e) => {
        e.preventDefault();


        let name = e.target.name;
        let value = e.target.value

        if (value !== null || value !== undefined) {

            if(name === "numero" ||  name === "voie" || name === "complementAdresse" || name === "codePostal"
            || name === "ville" ||  name === "pays")
            {
                setOrganisme((prev,) => ({
                    ...prev,
                    adresse:{...prev.adresse ,[name]: value} 
                     
                }))
               
            }
            else
            {
                setOrganisme((prev) => ({

                    ...prev,
                    [name]: value

                }))
            }

        }
        else {
            setMessage('verifier tout les champs....');
        }


    }


    const onSubmit = () => {

        if (parseInt(organisme.statut)!==  0) {

            let stringify = JSON.stringify(organisme);
            let data = JSON.parse(stringify);

         
            OrganismeDeFormationService.saveOrUpdateOrganismeDeFormation(data).then(() => {
                setLoading(true)

                setMessage("Modification avec success...")
                window.setTimeout(()=>{
                    window.location="#/formations/detail/organisme-de-formation/" +id;
                },2500)
            }).catch(() => {
                setMessage("Verifier les informations saisie");

            })


        }
        else 
        {
            setMessage("Verifier les informations saisie")
        }

    }

   const annuler =() => { window.location = "#/formations/liste-organisme-de-formation" }



    return (
        <>
           
            <form className='container' onSubmit={handleSubmit(onSubmit)}>
                <div className='row'>

                    <div className='col-6'>
                        <label htmlFor='organisme'>Organisme*</label>
                        <input type="text" className='form-control' name='organisme' id='organisme'
                            value={organisme.organisme === null ? "" : organisme.organisme} onChange={handleChange} />
                    </div>

                    <div className='col-6'>
                        <label htmlFor='mail'>Mail</label>
                        <input type="mail" className='form-control' name='mail' id='mail'
                            value={organisme.mail === null ? "" : organisme.mail} onChange={handleChange} />

                    </div>

                </div>

                <div className='row'>

                    <div className='col-6'>
                        <label htmlFor='nomDeLaPersonne'>Nom de la personne*</label>
                        <input type="text" className='form-control' name='nomDeLaPersonne' id='nomDeLaPersonne'
                            value={organisme.nomDeLaPersonne === null ? '' : organisme.nomDeLaPersonne} onChange={handleChange} />

                    </div>
                    <div className='col-6'>
                        <label htmlFor='statut'>Statut*</label>
                        <select className='form-control' name='statut' id='statut'
                            value={organisme.statut === null ? "" : organisme.statut} onChange={handleChange}  >
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
                            <label htmlFor='numero'>Numéro</label>
                            <input type="text" name="numero" id="numero" className='form-control'
                                value={organisme.adresse.numero === null ? "" : organisme.adresse.numero} onChange={handleChange} />


                        </div>
                        <div className='col-4'>
                            <label htmlFor='voie'>Rue</label>
                            <input type="text" name="voie" id="voie" className='form-control'
                                value={organisme.adresse.voie === null ? "" : organisme.adresse.voie} onChange={handleChange} />
                        </div>
                        <div className='col-4'>
                            <label htmlFor='complementAdresse'>Complément d'adresse</label>
                            <input type="text" name="complementAdresse" id="complementAdresse" className='form-control'
                                value={organisme.adresse.complementAdresse} onChange={handleChange} />

                        </div>

                    </div>
                    <div className='row py-2 mx-1'>
                        <div className='col-4 '>
                            <label htmlFor='codePostal'>Code Postal</label>
                            <input type="text" name="codePostal" id="codePostal" className='form-control'
                                value={organisme.adresse.codePostal === null ? "" : organisme.adresse.codePostal} onChange={handleChange} />

                        </div>
                        <div className='col-4'>
                            <label htmlFor='ville'>Ville</label>
                            <input type="text" name="ville" id="ville" className='form-control'
                                value={organisme.adresse.ville === null ? "" : organisme.adresse.ville} onChange={handleChange} />


                        </div>
                        <div className='col-4'>
                            <label htmlFor='pays'>Pays</label>
                            <select type="text" name="pays" id="pays" className='form-control' value="France"
                                onChange={handleChange} >
                                {countries.map((country, key) => (
                                    <option key={key} value={country.name} >
                                        {country.name}
                                    </option>
                                ))}
                            </select>

                        </div>

                    </div>

                

                    

                </div>
                <p className=' alert alert-info' role='alert'>{loading && message}</p>
                <div className='row'>
                    <div className='col-6'>
                        <button className='btn btn-outline-primary btn-block'>{loading && <CSpinner size='sm' variant='border'/>} SAUVEGARDER</button>
                    </div>

                    <div className='col-6'>
                        <button className='btn btn-outline-danger btn-block' onClick={annuler} >ANNULER</button>
                    </div>

                </div>


            </form>

        </>
    );
};

export default withRouter(UpdateOrganisme);