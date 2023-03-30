import axiosInstance from './axiosInstance.service';
const API_URL = '/annualActivity';

class AnnualActivityService {

  getById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getAll() {
    return axiosInstance.get(API_URL);
  }

  getAllByPage(page, size) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`, );
  }

  getByTitle(name) {
    return axiosInstance.get(`${API_URL}/search`, {
      params: {
        search: name
      }
    });
  }

  count() {
    return axiosInstance.get(`${API_URL}/count`, );
  }

  save(data, id) {
    return axiosInstance.post(`${API_URL}/salarie/${id}`, data);
  }
  updateLst(data) {
    return axiosInstance.put(API_URL, data);
  }

  update(data) {
    return axiosInstance.put(`${API_URL}/updateActivity`, data);
  }

  delete(id) {
    return axiosInstance.delete(`${API_URL}/${id}`);
  }
}

export default new AnnualActivityService();
