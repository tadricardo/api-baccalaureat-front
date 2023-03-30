import axiosInstance from './axiosInstance.service';
const API_URL = '/adresses';
class AdressesService {

  getAllAdresse(order, sortBy) {
    return axiosInstance.get(API_URL, {
      params: {
        sortBy: sortBy,
        order: order
      }
    });
  }

  getAllAdresseByPage(page, size, sortBy, order) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`, {
      params: {
        sortBy: sortBy,
        order: order
      },
    });
  }

  getAllAdresseByPageAndKeyword(page, size, search, sortBy, order) {
    return axiosInstance.get(`${API_URL}/${page}/${size}/${search}`, {
      params: {
        sortBy: sortBy,
        order: order
      },
    });
  }

  getAdresseById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
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

  count(search) {
    return axiosInstance.get(`${API_URL}/count/${search}`);
  }

  getAdresseByEntity(data) {
    return axiosInstance.post(`${API_URL}/search`, data);
  }

  isAdresseUsed(idAdresse) {
    return axiosInstance.get(`${API_URL}/is-adresse-used/${idAdresse}`);
  }
}

export default new AdressesService();
