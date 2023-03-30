import axiosInstance from './axiosInstance.service';
const API_URL = '/reponse';
class ReponseService {

  getAllReponse() {
    return axiosInstance.get(API_URL);
  }

  getAllReponseByPage(page, size, ord, sort) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`, {
      params: {
        sortBy: sort,
        order: ord
      }
    });
  }

  getAllReponseByKeyWord(page, size, search, ord, sort) {
    return axiosInstance.get(`${API_URL}/${page}/${size}/${search}`, {
      params: {
        sortBy: sort,
        order: ord
      }
    });
  }

  getAllReponseByIdSalarie(idSalarie, page, size, ord, sort) {
    return axiosInstance.get(`${API_URL}/salarie/${page}/${size}/${idSalarie}/`, {
      params: {
        sortBy: sort,
        order: ord
      }
    });
  }

  getAllReponseByIdManager(idManager, page, size, ord, sort) {
    return axiosInstance.get(`${API_URL}/manager/${page}/${size}/${idManager}/`, {
      params: {
        sortBy: sort,
        order: ord
      }
    });
  }

  getReponseById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  count(search) {
    return axiosInstance.get(`${API_URL}/count/${search}`);
  }

  countBySalarie(id) {
    return axiosInstance.get(`${API_URL}/salarie/count/${id}`);
  }

  countByManager(id) {
    return axiosInstance.get(`${API_URL}/manager/count/${id}`);
  }

  getReponseByIdCompteRendu(id) {
    return axiosInstance.get(`${API_URL}/compte-rendu/${id}`);
  }

  save(data) {
    return axiosInstance.post(API_URL, data);
  }

  saveSansChangeStatut(data) {
    return axiosInstance.post(`${API_URL}/save-sans-change-statut`, data);
  }

  update(data) {
    return axiosInstance.put(API_URL, data);
  }

  deleteById(id) {
    return axiosInstance.delete(`${API_URL}/${id}`);
  }
}

export default new ReponseService();
