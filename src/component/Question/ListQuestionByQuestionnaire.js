import React from "react";
import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import swal from "sweetalert";

const ListQuestionByQuestionnaire = (props) => {
  const handleChangePage = (data) => {
    props.changePage(data.selected);
  };

  const deleteQuestion = (question) => {
    swal({
      title: "Supprimer la question",
      text: "Êtes vous sûrs de vouloir supprimer cette question ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((deleteReq) => {
      if (deleteReq) {
        props.deleteQuestion(question);
      }
    });
  };

  return (
    <>
      <table className="table table-hover table-striped align-middle ">
        <thead>
          <tr>
            <th>N°</th>
            <th colSpan="3">Question</th>
            <th>Rep.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.questions &&
            props.questions.map((question, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td colSpan="3">{question.intitule}</td>
                  <td>
                    {Object.keys(question.choix).length > 0 ? (
                      <ul>
                        {Object.keys(question.choix).map((item, i) => (
                          <li key={i}>{question.choix[item]}</li>
                        ))}
                      </ul>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>
                    <CDropdown>
                      <CDropdownToggle className="" size="lg" caret={false}>
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem
                          to={"/question/modification/" + question.id}
                        >
                          Modifier
                        </CDropdownItem>

                        <CDropdownItem
                          href="#"
                          onClick={() => deleteQuestion(question)}
                        >
                          Supprimer
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="row ml-2 justify-content-between mr-2">
        {props.nbPage > 1 && (
          <ReactPaginate
            name="test"
            previousLabel={"Précédent"}
            nextLabel={"Suivant"}
            breakLabel={"..."}
            pageCount={props.nbPage}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            onPageChange={handleChangePage.bind(this)}
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
          />
        )}
      </div>
    </>
  );
};

ListQuestionByQuestionnaire.propTypes = {
  questions: PropTypes.array,
};

export default ListQuestionByQuestionnaire;
