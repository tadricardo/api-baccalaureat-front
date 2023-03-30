import axiosInstance from './axiosInstance.service';

const API_URL = '/annualDomain';

class ActivityDomainService {

  getById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getAll() {
    return axiosInstance.get(API_URL);
  }

  getAllAnnualDomainByPage(page, size) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`);
  }

  getByTitle(name) {
    return axiosInstance.get(`${API_URL}/search`, {
      params: {
        search: name
      }
    });
  }

  count() {
    return axiosInstance.get(`${API_URL}/count`);
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
}

export default new ActivityDomainService();
