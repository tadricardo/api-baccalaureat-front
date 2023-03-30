import axiosInstance from "./axiosInstance.service";
const API_URL = '/amenagement'

class AmenagementService {
  count(salarieId) {
    return axiosInstance.get(`${API_URL}/${salarieId}/count`);
  }
  getAll(salarieId) {
    return axiosInstance.get(`${API_URL}/${salarieId}`);
  }
  create(amenagement) {
    return axiosInstance.post(`${API_URL}/new`, amenagement,{
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  update(amenagement) {
    return axiosInstance.post(`${API_URL}/update`, amenagement);
  }
  delete(id){
    return axiosInstance.delete(`${API_URL}/${id}`);
  }
}

export default new AmenagementService();
