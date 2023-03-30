import axiosInstance from './axiosInstance.service';
const API_URL = '/typeentretien';
class TypeEntretienService {

  getAllTypeEntretien() {
    return axiosInstance.get(API_URL);
  }

  getAllTypeEntretienByPage(page, size) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`);
  }

  getAllTypeEntretienByPageAndKeyWord(page, size, search) {
    return axiosInstance.get(`${API_URL}/${page}/${size}/${search}`);
  }

  getTypeEntretienById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getTypeEntretienByTitle(title) {
    return axiosInstance.get(`${API_URL}/search`, {
      params: {
        name: title
      }
    })
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

export default new TypeEntretienService();
