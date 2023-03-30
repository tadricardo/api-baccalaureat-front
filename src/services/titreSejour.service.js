import axiosInstance from "./axiosInstance.service";
const API_URL = '/titre-sejour'

class TitreSejourService {
  getTitreSejour(salarieId) {
    return axiosInstance.get(`${API_URL}/salarie/${salarieId}`);
  }

  saveTitreSejour(data) {
    return axiosInstance.put(`${API_URL}`, data)
  }

  deleteTitre(id) {
    return axiosInstance.delete(`${API_URL}/${id}`)
  }
}

export default new TitreSejourService();
