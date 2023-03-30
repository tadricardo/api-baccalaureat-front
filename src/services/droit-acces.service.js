import axiosInstance from './axiosInstance.service';
const API_URL = '/droit-acces';
class DroitAccesService {

  getAllDroitAccesByPage(page, size, sortBy, order) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`, {
      params: {
        sortBy: sortBy,
        order: order
      }
    });
  }

  getAllByPageAndKeyword(page, size, search, order, sortBy) {
    return axiosInstance.get(`${API_URL}/search/${page}/${size}`, {
      params: {
        search: search,
        sortBy: sortBy,
        order: order
      }
    });
  }

  getAllByPageAndKeywordAndNotListRole(page, size, search, order, sortBy, idRole) {
    return axiosInstance.get(`${API_URL}/role/${page}/${size}`, {
      params: {
        sortBy: sortBy,
        order: order,
        search: search,
        idRole: idRole
      }
    });
  }

  getDAById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getDroitAccesByFrontName(frontRoute) {
    return axiosInstance.get(`${API_URL}/search`, {
      params: {
        name: frontRoute
      }
    });
  }

  getAllParent(){
    return axiosInstance.get(`${API_URL}/parent`);
  }

  count(search) {
    return axiosInstance.get(`${API_URL}/count`, {
      params: {
        search: search
      }
    });
  }

  saveDA(data) {
    return axiosInstance.post(API_URL, data);
  }

  updateDA(data) {
    return axiosInstance.put(API_URL, data);
  }

  deleteDAById(id) {
    return axiosInstance.delete(`${API_URL}/${id}`);
  }
}

export default new DroitAccesService();
