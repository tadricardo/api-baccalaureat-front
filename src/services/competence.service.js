import axiosInstance from './axiosInstance.service';
const API_URL = '/competences';

class CompetenceService {

  getAllCompetence() {
    return axiosInstance.get(API_URL);
  }

  getAllComptenceByPage(page, size) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`);
  }

  getAllComptenceByPageAndKeyword(page, size, search, order, sortBy) {
    return axiosInstance.get(`${API_URL}/${page}/${size}/${search}`, {
      params: {
        order: order,
        sortBy: sortBy
      }
    });
  }

  getCompetencesBySalarieId(salarieId, page, size, column, order){
    return axiosInstance.get(`${API_URL}/salarie/${salarieId}`, {
      params: {
        page,
        size,
        column,
        order,
      }
    })
  }

  countCompetence(search) {
    if (search === null || search === undefined) {
      return axiosInstance.get(`${API_URL}/count`);
    } else {
      return axiosInstance.get(`${API_URL}/count/${search}`);
    }
  }

  getCompetenceByName(name) {
    return axiosInstance.get(`${API_URL}/search`, {
      params: {
        name: name
      }
    })
  }

  getCompetenceById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getCompetenceByIdDomaine(id) {
    return axiosInstance.get(`${API_URL}/domaine/${id}`);
  }

  saveCompetence(data) {
    return axiosInstance.post(API_URL, data);
  }

  updateCompetence(data) {
    return axiosInstance.put(API_URL, data);
  }

  deleteById(id) {
    return axiosInstance.delete(`${API_URL}/${id}`);
  }
}

export default new CompetenceService();
