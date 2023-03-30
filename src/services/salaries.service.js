import axiosInstance from './axiosInstance.service';
const API_URL = '/salaries';
class SalariesService {

  getAll() {
    return axiosInstance.get(API_URL);
  }

  getAllActif() {
    return axiosInstance.get(`${API_URL}/actif`);
  }

  getAllSalariesByPage(page, size) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`);
  }

  getAllSalariesByKeywordPerPage(page, size, name, order, sortBy) {
    return axiosInstance.get(`${API_URL}/${page}/${size}/${name}`, {
      params: {
        order: order,
        sortBy: sortBy
      }
    });
  }

  count(search) {
    return axiosInstance.get(`${API_URL}/count/${search}`);
  }
  
  getAllSalariesByPageActif(page, size) {
    return axiosInstance.get(`${API_URL}/${page}/${size}/actif`);
  }

  getAllSalariesByKeywordPerPageActif(page, size, name, order, sortBy) {
    return axiosInstance.get(`${API_URL}/${page}/${size}/${name}/actif`, {
      params: {
        order: order,
        sortBy: sortBy
      }
    });
  }

  countSalarieActif(search) {
    return axiosInstance.get(`${API_URL}/count/${search}/actif`);
  }

  getAllSalarieByIdManagerAndLastnamePerPage(page, size, idManager, search) {
    return axiosInstance.get(`${API_URL}/manager/${idManager}/${page}/${size}`, {
      params: {
        search: search
      }
    });
  }

  countManager(idManager, search) {
    return axiosInstance.get(`${API_URL}/count/manager/${idManager}`, {
      params: {
        search: search
      }
    });
  }

  getAllSalarieByIdManagerPerPageNotListFormation(page, size, idManager, order, sortBy, idFormation) {
    return axiosInstance.get(`${API_URL}/formation/${page}/${size}`, {
      params: {
        sortBy: sortBy,
        order: order,
        idManager: idManager,
        idFormation: idFormation
      }
    });
  }
  getAllByPageAndKeywordAndNotListFormation(page, size, name, order, sortBy, idFormation) {
    return axiosInstance.get(`${API_URL}/formation/${page}/${size}`, {
      params: {
        sortBy: sortBy,
        order: order,
        search: name,
        idFormation: idFormation
      }
    });
  }

  getAllSalariesWithoutPoste() {
    return axiosInstance.get(`${API_URL}/sans-poste`);
  }

  getAllSalariesByDomaine(domaine) {
    return axiosInstance.get(`${API_URL}/salaries-domaine/${domaine}`);
  }

  getAllSalariesWithoutPosteByDomaine(domaine) {
    return axiosInstance.get(`${API_URL}/salaries-sans-poste-domaine/${domaine}`);
  }

  getAllSalariesByEntreprise(entreprise) {
    return axiosInstance.get(`${API_URL}/entreprise/${entreprise}`);
  }

  getAllSalariesActifByEntreprise(entreprise) {
    return axiosInstance.get(`${API_URL}/entreprise/${entreprise}/actif`);
  }

  getUser() {
    return axiosInstance.get(API_URL + "/3");
  }

  getSalarieById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  save(data) {
    return axiosInstance.post(API_URL, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  saveWithCompetences(data) {
    return axiosInstance.post(`${API_URL}/save-with-competence`, data);
  }

  saveSalarieEtPoste(salarie) {
    return axiosInstance.post(`${API_URL}/v2`, salarie,{
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  update(data) {
    return axiosInstance.put(API_URL, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  updateWithoutPassword(data) {
    return axiosInstance.put(API_URL + "/without-password", data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  updateWithCompetenceAndWithoutPassword(data) {
    return axiosInstance.put(`${API_URL}/with-competence-without-password`, data);
  }

  updatePassword(idUser, data) {
    return axiosInstance.put(`${API_URL}/updatePassword/${idUser}`, data, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  checkManager(idSalarie, idManager) {
    return axiosInstance.get(`${API_URL}/check/manager/${idSalarie}/${idManager}`);
  }

  getAllSalarieByIdManagerPerPageWithSearch(page, size, idManager, search) {
    return axiosInstance.get(`${API_URL}/manager/${idManager}/${page}/${size}`, {
      params: {
        search: search
      }
    });
  }

  getAllSalarieByIdManager(idManager) {
    return axiosInstance.get(`${API_URL}/manager/${idManager}`);
  }

  countManagerWithSearch(idManager, search) {
    return axiosInstance.get(`${API_URL}/count/manager/${idManager}`, {
      params: {
        search: search
      }
    });
  }

  getAllSalarieByRole(role) {
    return axiosInstance.get(`${API_URL}/role/${role}`);
  }

  getAllSalarieActifByRole(role) {
    return axiosInstance.get(`${API_URL}/role/${role}/actif`);
  }

  getSalarieByEmail(email) {
    return axiosInstance.get(`${API_URL}/salarie`, {
      params: {
        mail: email
      }
    });
  }

  getAllCompetenceSalarie(idSalarie) {
    return axiosInstance.get(`${API_URL}/${idSalarie}/competences`);
  }

  saveCompetenceSalarie(data) {
    return axiosInstance.post(API_URL + "/save-competence", data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  updateCompetenceSalarie(data) {
    return axiosInstance.put(API_URL + "/update-competence", data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  deleteCompetenceSalarie(id) {
    return axiosInstance.delete(API_URL + "/delete-competence/" + id, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getAllCongeByIdSalarieAndKeyword(idSalarie, page, size, search, sortBy, order, typeConge) {
    return axiosInstance.get(`${API_URL}/conge/${idSalarie}/${page}/${size}`, {
      params: {
        sortBy: sortBy,
        order: order,
        typeConge: typeConge,
        search: search,
      }
    });
  }

  countCongeByIdSalarieAndKeyword(idSalarie, search, typeConge) {
    return axiosInstance.get(`${API_URL}/conge/count/${idSalarie}`, {
      params: {
        typeConge: typeConge,
        search: search,
      }
    });
  }

  getCongeById(idConge) {
    return axiosInstance.get(`${API_URL}/conge/${idConge}`);
  }

  isCongeExist(data) {
    return axiosInstance.post(`${API_URL}/conge/is-exist`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  saveConge(data) {
    return axiosInstance.post(`${API_URL}/conge`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  saveCongeWithoutFile(data) {
    return axiosInstance.post(`${API_URL}/conge/save-without-file`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  UpdateConge(data) {
    return axiosInstance.put(`${API_URL}/conge`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  deleteByidConge(id) {
    return axiosInstance.delete(`${API_URL}/conge/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getJustificatifConge(id) {
    return axiosInstance.get(`${API_URL}/conge/justificatif/${id}`, {
      responseType: 'blob',
    })
  }

  getAllVisiteMedicaleByIdSalarieAndKeyword(idSalarie, page, size, search, sortBy, order) {
    return axiosInstance.get(`${API_URL}/visite-medicale/${idSalarie}/${page}/${size}`, {
      params: {
        sortBy: sortBy,
        order: order,
        search: search,
      }
    });
  }

  countVisiteMedicaleByIdSalarieAndKeyword(idSalarie, search) {
    return axiosInstance.get(`${API_URL}/visite-medicale/count/${idSalarie}`, {
      params: {
        search: search,
      }
    });
  }

  saveVisiteMedicale(data) {
    return axiosInstance.post(`${API_URL}/visite-medicale`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  updateVisiteMedicale(data) {
    return axiosInstance.put(`${API_URL}/visite-medicale`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getVisiteMedicaleById(idVM) {
    return axiosInstance.get(`${API_URL}/visite-medicale/${idVM}`);
  }
}

export default new SalariesService();
