import axiosInstance from './axiosInstance.service';
const API_URL = '/entreprises';
class EntreprisesService {

  getAllEntreprises() {
    return axiosInstance.get(API_URL);
  }

  getAllEntreprisesPage(page, size, order, sortBy) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`, {
      params: {
        order: order,
        sortBy: sortBy
      }
    });
  }

  getAllEntreprisesPageAndKeyword(page, size, search, order, sortBy) {
    return axiosInstance.get(`${API_URL}/${page}/${size}/${search}`, {
      params: {
        order: order,
        sortBy: sortBy
      }
    });
  }


  getEntrepriseById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getEntrepriseByNameOrIdAdresse(name, idAdresse) {
    return axiosInstance.get(`${API_URL}/search`, {
      params: {
        name: name,
        idAdresse: idAdresse
      }
    });
  }

  getEntrepriseByAdresse(id) {
    return axiosInstance.get(`${API_URL}/adresse/${id}`);
  }

  count(search) {
    return axiosInstance.get(`${API_URL}/count/${search}`);
  }

  save(data) {
    return axiosInstance.post(API_URL, data);
  }

  update(data) {
    return axiosInstance.put(API_URL, data);
  }

  delete(id) {
    return axiosInstance.delete(`${API_URL}/${id}`);
  }

  isEntrepriseUsed(idEntreprise) {
    return axiosInstance.get(`${API_URL}/is-entreprise-used/${idEntreprise}`);
  }
}

export default new EntreprisesService();
