import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import OrganismeDeFormationService from "../../services/organismeDeFormation.service"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useParams } from 'react-router';


const DetailOrganisme = () => {
    const [organismeDetail, setOrganismeDetail]=useState([]);
    const [adresse, setAdresse]=useState([]);
    const {id}=useParams();
    
    useEffect(()=>{
       
        OrganismeDeFormationService.getOrganismeDeFormationById(parseInt(id)).then((res)=>
        {
           
            setOrganismeDetail(res.data);
            setAdresse(res.data.adresse);
          
        }).catch((e)=>{
            console.log(e)
        })

    },[id])

    

    return (
        <>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <tbody>
                        <tr >
                            <th>Organisme</th>
                            <td>{organismeDetail.organisme}</td>
                        </tr>
                        <tr>
                            <th>Mail</th>
                            <td>{organismeDetail.mail}</td>
                        </tr>
                        <tr>
                            <th>Nom de la personne</th>
                            <td>{organismeDetail.nomDeLaPersonne}</td>
                        </tr>

                        <tr>
                            <th>Statut</th>
                            <td>{organismeDetail.statut}</td>
                        </tr>

                        <tr>
                            <th>Adresse</th>
                            <td>
                            {
                            adresse.numero+ " " 
                            + adresse.voie+ " "
                            + adresse.complementAdresse+ " "
                            +adresse.codePostal+ " "
                            + adresse.ville+ " "
                            +adresse.pays
                            }
                            </td>
                        </tr>
                    </tbody>

                </table>
                

                         
            </div>

            <div className='row mt-5'>
                    <div className='col-6'>
                        <a className="btn btn-outline-info btn-block" href={'#/organisme-formation/modification/'+ organismeDetail.id}><FontAwesomeIcon icon={faEdit} /> Modifier</a>

                    </div>
                    <div className='col-6'>
                        <a className='btn btn-outline-danger btn-block' href='#/formations/liste-organisme-de-formation'>Retour</a>
                    </div>

                </div>

        </>
    );
};

export default withRouter(DetailOrganisme);