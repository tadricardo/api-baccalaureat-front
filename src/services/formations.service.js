import axiosInstance from './axiosInstance.service';
const API_URL = '/formations';
class FormationService {

  getAllFormationByPage(page, size) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`);
  }

  getFormationById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }


  getFormationsBySalarieId(salarieId, page, size, column, order){
    return axiosInstance.get(`${API_URL}/salarie/${salarieId}`, {
      params: {
        page,
        size,
        column,
        order,
      }
    })
  }

  getFormationPeriodByPage(page, size, search, dateDebut, dateFin, sortBy, order) {
    return axiosInstance.get(`${API_URL}/period/${page}/${size}`, {
      params: {
        firstDate: dateDebut,
        lastDate: dateFin,
        search: search,
        sortBy: sortBy,
        order: order
      }
    });
  }

  getAllFormationEnCours(page, size) {
    return axiosInstance.get(`${API_URL}/encours/${page}/${size}`);
  }

  getAllFormationNonCommence(page, size) {
    return axiosInstance.get(`${API_URL}/noncommence/${page}/${size}`);
  }

  getAllFormationByIdCompetence(idCompetence) {
    return axiosInstance.get(`${API_URL}/competence/${idCompetence}`);
  }

  getAllFormationByDate(date) {
    return axiosInstance.get(`${API_URL}/date?date=${date}`);
  }

  getAllFormationByPeriode(dateDebut, dateFin) {
    return axiosInstance.get(API_URL + `/date`, {
      params: {
        dateDebut: dateDebut,
        dateFin: dateFin
      }
    });
  }

  getSalarieByIdFormation(idFormation) {
    return axiosInstance.get(`${API_URL}/salaries/${idFormation}`);
  }

  getSalarieByIdFormationPerPage(idFormation, page, size) {
    return axiosInstance.get(`${API_URL}/salaries/${idFormation}/${page}/${size}`);
  }

  saveOrUpdateSalarieFormation(idFormation, idSalarie) {
    return axiosInstance.get(`${API_URL}/salaries-formation`, {
      params: {
        idFormation: idFormation,
        idSalarie: idSalarie
      }
    });
  }

  countSalarieByFormation(idFormation) {
    return axiosInstance.get(`${API_URL}/count/${idFormation}`);
  }

  countFormation(search, dateDebut, dateFin) {
    return axiosInstance.get(`${API_URL}/count`, {
      params: {
        firstDate: dateDebut,
        lastDate: dateFin,
        search: search
      }
    });
  }

  save(data) {
    return axiosInstance.post(API_URL, data);
  }

  saveWithCompetence(data) {
    return axiosInstance.post(`${API_URL}/save-with-competences`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  update(data) {
    return axiosInstance.put(API_URL, data);
  }

  updateWithCompetence(data) {
    return axiosInstance.put(`${API_URL}/update-with-competences`, data);
  }

  delete(id) {
    return axiosInstance.delete(`${API_URL}/${id}`);
  }

  deleteSalarieForTraining(idTraining, idEmployee) {
    return axiosInstance.delete(`${API_URL}/salaries-formation`, {
      params: {
        idFormation: idTraining,
        idSalarie: idEmployee
      }
    });
  }

  insertSalarieForTrainnig(idTraining, idEmployee) {
    return axiosInstance.get(`${API_URL}/insert/salaries-formation`, {
      params: {
        idFormation: idTraining,
        idSalarie: idEmployee
      }
    });
  }

  saveDemandeFormation(idFormation, idSalarie) {
    return axiosInstance.get(`${API_URL}/demande-formation/save`, {
      params: {
        idFormation: idFormation,
        idSalarie: idSalarie
      }
    });
  }

  deleteDemandeFormation(idFormation, idSalarie) {
    return axiosInstance.delete(`${API_URL}/demande-formation/delete`, {
      params: {
        idFormation: idFormation,
        idSalarie: idSalarie
      }
    });
  }

  getDemandeFormationBySalarie(idSalarie) {
    return axiosInstance.get(`${API_URL}/demande-formation/salarie/${idSalarie}`);
  }

  getAllDemandeFormationByType(page, size, sortBy, order, statut) {
    return axiosInstance.get(`${API_URL}/demande-formation/en-attente/${page}/${size}`, {
      params: {
        statut: statut,
        sortBy: sortBy,
        order: order
      }
    });
  }

  countDemandeFormationByType(statut) {
    return axiosInstance.get(`${API_URL}/demande-formation/en-attente/count`, {
      params: {
        statut: statut
      }
    });
  }

  getAllDemandeFormationByTypeForManager(page, size, sortBy, order, statut, idManager) {
    return axiosInstance.get(`${API_URL}/demande-formation/en-attente/manager/${page}/${size}`, {
      params: {
        statut: statut,
        sortBy: sortBy,
        order: order,
        idManager: idManager
      }
    });
  }

  countDemandeFormationByTypeForManager(statut, idManager) {
    return axiosInstance.get(`${API_URL}/demande-formation/en-attente/manager/count`, {
      params: {
        statut: statut,
        idManager: idManager
      }
    });
  }

  ReponseDemandeFormation(statut, idSalarieValidateur, idDemande) {
    return axiosInstance.get(`${API_URL}/demande-formation/reponse`, {
      params: {
        statut: statut,
        idSalarieValidateur: idSalarieValidateur,
        idDemande: idDemande
      }
    });
  }

  saveCompetenceFormation(data) {
    return axiosInstance.post(API_URL + "/save-competence", data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  updateCompetenceFormation(data) {
    return axiosInstance.put(API_URL + "/update-competence", data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  deleteCompetenceFormation(id) {
    return axiosInstance.delete(API_URL + "/delete-competence/"+id, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  telechargerFormationEnAttente() {
    return axiosInstance.get(`${API_URL}/demande-formation/download`,{
      responseType: "blob",
    });
  }
}

export default new FormationService();
