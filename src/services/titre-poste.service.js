import axiosInstance from './axiosInstance.service';
const API_URL = '/titrepostes';
class TitrePosteService {

  getAllTitrePoste() {
    return axiosInstance.get(API_URL);
  }

  getTitrePosteByIdDomaine(idDomaine) {
    return axiosInstance.get(`${API_URL}/domaine/${(isNaN(idDomaine))?0:idDomaine}`);
  }

  countTitrePoste(search) {
    return axiosInstance.get(`${API_URL}/count/${search}`);
  }

  getAllTitrePosteByPage(page, size) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`);
  }

  getAllTitrePosteByPageAndKeyword(page, size, search, order, sort) {
    return axiosInstance.get(`${API_URL}/${page}/${size}/${search}`, {
      params: {
        order: order,
        sortBy: sort
      }
    });
  }

  getTitrePosteById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getTitrePosteByIdServiceOrAndName(idService, name) {
    return axiosInstance.get(`${API_URL}/search`, {
      params: {
        idDomaine: idService,
        name: name
      }
    });
  }

  saveTitrePoste(data) {
    return axiosInstance.post(API_URL, data);
  }

  updateTitrePoste(data) {
    return axiosInstance.put(API_URL, data);
  }

  deleteTitrePosteById(id) {
    return axiosInstance.delete(`${API_URL}/${id}`);
  }
}

export default new TitrePosteService();
