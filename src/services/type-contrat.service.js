import axiosInstance from './axiosInstance.service';
const API_URL = '/typecontrats';
class TypeContratService {

  getAllTypeContrat() {
    return axiosInstance.get(API_URL);
  }

  getAllTypeContratByPage(page, size) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`);
  }

  getAllTypeContratByPageAndKeyword(page, size, search, order) {
    return axiosInstance.get(API_URL,{
      params: {
        page,
        size,
        order
      }
    })
  }

  getTypeContratById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getTypeContratByName(name) {
    return axiosInstance.get(`${API_URL}/search`, {
      params: {
        name: name
      }
    });
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
}

export default new TypeContratService();
