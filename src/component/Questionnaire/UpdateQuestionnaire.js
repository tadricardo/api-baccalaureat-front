import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import questionnaireService from 'src/services/questionnaire.service';
import ListQuestionByQuestionnaire from '../Question/ListQuestionByQuestionnaire';
import {CSelect, CTabPane, CTabContent, CNavLink, CNavItem, CNav, CTabs } from "@coreui/react";
import { faEdit, faPlus, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import typeEntretienService from 'src/services/type-entretien.service';
import CreateQuestion from '../Question/CreateQuestion';
import swal from 'sweetalert';
import InsertQuestionToQuestionnaire from './InsertQuestionToQuestionnaire';


const UpdateQuestionnaire = props => {
    const [redirect, setRedirect] = useState(false);
    const [isLoaded,setIsLoaded] = useState(false);
    const [questionnaire, setQuestionnaire] = useState({});
    const [questions, setQuestions] = useState([]);
    const [typesEntretien, setTypesEntretien] = useState({});
    const [entretien, setEntretien] = useState({});
    const [nbPage, setNbPage] = useState(0);
    const [pageAct, setPageAct] = useState(0);
    const [active, setActive] = useState(0);
    const id = useParams().id

    const pageSize = 5;





    const getQuestionnaire = () => {
        questionnaireService.getQuestionnaireById(id).then((res) => {
            setQuestionnaire(res.data);
            setEntretien(res.data.typeEntretien);
        })

    }

    const getLstEntretien = () => {
        typeEntretienService.getAllTypeEntretien()
      .then(response => {
        setTypesEntretien(response.data);
        setIsLoaded(true);
      });

    }

    const handleChangeEntretien = (e) => {
      setEntretien(e.target.value);
      setQuestionnaire({...questionnaire, typeEntretien: { id: e.target.value }});
    }

    const changePage = (page) => {
        setPageAct(page);
        questionnaireService.countQuestionsByQuestionnaire(id).then((res) => {
            setNbPage(Math.ceil(res.data / pageSize));
        })
        questionnaireService.getQuestionsByIdQuestionnaire(id, page, pageSize)
            .then((res) => {
                setQuestions(res.data);
            });
    };

    const changeTitle = (evt) => {
        setQuestionnaire({...questionnaire, titre: evt.target.value})
    }

    const deleteQuestion = (question) => {
      console.log(question)
      questionnaireService.deleteQuestionForQuestionnaire(id, question.id)
        .then((res) => {
          swal("Suppression bien prise en compte", {
            icon: "success",
          });
          changePage(pageAct);
        })
    }

    const saveQuestionnaire = (e) => {
      e.preventDefault();
      console.log(questionnaire)
      questionnaireService.update(questionnaire).then(() => {
        window.setTimeout(() => {setRedirect(true)}, 2500);
      });
    }


    useEffect(() => {
      if(!isLoaded){
        changePage(0);
        getQuestionnaire();
        getLstEntretien();
      }

    });


    if(redirect)
      return <Redirect to="/questionnaire"/>
    return (
        <>
          <div className="edit-form">
          <CTabs activeTab={active} onActiveTabChange={idx => setActive(idx)}>
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink>
                  <FontAwesomeIcon icon={faEdit} /> Modification du questionnaire
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink>
                  <FontAwesomeIcon icon={faPlus} /> Créer une question
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink>
                  <FontAwesomeIcon icon={faLink} />Lier une question
                </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent className='mt-3'>
              <CTabPane>
                  <form name='updateQuestionnaire' className='row mb-3 mr-2 align-items-end' onSubmit={(e) => saveQuestionnaire(e)}>
                      <div className='col-12 col-md-6'>
                          <label htmlFor='titre'>Titre du questionnaire</label>
                          <input type='text' className='form-control' id='titre' value={questionnaire.titre} onChange={(e) => changeTitle(e)} />
                      </div>
                      <div className='col-12 col-md-5'>
                          <label htmlFor='typeEntretien'>Type d'entretien</label>
                        { isLoaded && (<CSelect custom name="typeEntretien" id="typeEntretien" onChange={(e) => handleChangeEntretien(e)} required
                            value={entretien && entretien.id === null ? 0 : entretien.id}>
                            <option value="0" disabled>Veuillez sélectionner un type d'entretien</option>
                            {typesEntretien.map((type, key) => (
                                <option key={key} value={type.id}>
                                {type.titre}
                            </option>
                            ))}
                        </CSelect>)
                        }

                      </div>
                      <div className='col-12 col-md-1'>
                          <input type="submit" className='btn btn-success' value="Valider" />

                      </div>
                  </form>
                <ListQuestionByQuestionnaire questions={questions} changePage={changePage} deleteQuestion={deleteQuestion} nbPage={nbPage} />
              </CTabPane>
              <CTabPane>
                <CreateQuestion idQuestionnaire={id} updateQuestionnaire={changePage} />
              </CTabPane>
              <CTabPane>
                <InsertQuestionToQuestionnaire questionnaireId={id} updateQuestionnaire={changePage}/>
              </CTabPane>
            </CTabContent>
          </CTabs>

        </div>
        </>
    );
};

export default UpdateQuestionnaire;
