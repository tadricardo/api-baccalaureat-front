import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { CButton } from "@coreui/react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faEye,  faTrash  } from "@fortawesome/free-solid-svg-icons";
import OrganismeDeFormationService from "../../services/organismeDeFormation.service"
import organismeDeFormationService from '../../services/organismeDeFormation.service';


const ListeOrganisme = () => {
  const [listeOrganismes, setListeOrganismes]=useState([]);


  useEffect(()=>{
      OrganismeDeFormationService.getAllOrganismeDeFormation().then((res)=>{
        setListeOrganismes(res.data);
  
      })
  }, [])
  
    

    return (
        <>
          <a className='btn btn-outline-info float-right mb-3 mx-3' href='#/formations/creation/organisme-de-formation' >AJOUTER</a>
            <div className="col-lg-12 table-responsive">
                <table className="table table-hover table-striped table-bordered">
                    <thead className='text-center'>
                        <tr>
                             <th>Organisme</th>
                             <th>Statut</th>
                             <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                      {
                        listeOrganismes.map(o=>
                          <tr key={o.id}>
                            <td>{o.organisme}</td>
                            <td>{o.statut}</td>
                            <td>
                            <Link to={"/formations/detail/organisme-de-formation/" + o.id}>
                            <CButton
                              className="mr-2"
                              color="info"
                              title="Vous voulez voir ce profil ?"
                            >
                              {" "}
                              <FontAwesomeIcon icon={faEye} /> Voir
                            </CButton>
                          </Link>{" "}

                          <Link to={"/formations/liste-organisme-de-formation"}>
                            <CButton
                              className="mr-2"
                              color="danger"
                              title="Vous voulez supprimer cet organisme ?"
                              onClick={()=>{
                                swal({
                                  title: "Êtes-vous sûrs ?",
                                  text: "Voulez-vous supprimer cet oraganisme de formation : '" + o.organisme + "' ?",
                                  icon: "warning",
                                  buttons: true,
                                  dangerMode: true,
                                }).then((res)=>{
                                  if(res === true){
                                    organismeDeFormationService.deleteById(o.id).then(()=>{
                                      OrganismeDeFormationService.getAllOrganismeDeFormation().then((response)=>{
                                        setListeOrganismes(response.data);
                                  
                                      })

                                    })
                                  }
                                })
                    
                              }}
                            >
                              {" "}
                              <FontAwesomeIcon icon={faTrash} /> Supprimer
                            </CButton>
                          </Link>{" "}
                          </td>
                          </tr>)
                      }
                        <tr>
                        </tr>
                       
                    </tbody>

                </table>

            </div>

        </>
    );
};

export default withRouter(ListeOrganisme);