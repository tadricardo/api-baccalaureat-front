import axiosInstance from "./axiosInstance.service";
const API_URL = '/dossier-salarie'

class DossierSalarieService{
  saveFile(data) {
    return axiosInstance.post(`${API_URL}/upload`, data);
  }

  getFileList(salarieId) {
    return axiosInstance.get(`${API_URL}/${salarieId}`);
  }

  getFile(id) {
    return axiosInstance.get(`${API_URL}/fichier/${id}`,{
      responseType: 'blob',
    })
  }

  getZipFile(salarieId) {
    return axiosInstance.get(`${API_URL}/zip/${salarieId}`, {
      responseType: 'blob',
    })
  }

  deleteFile(id) {
    return axiosInstance.delete(`${API_URL}/fichier/${id}`);
  }

  hasRqthFile(salarieId) {
    return axiosInstance.get(  `${API_URL}/${salarieId}/rqth`);
  }

  hasTitreSejourFile(salarieId) {
    return axiosInstance.get(`${API_URL}/${salarieId}/titre-sejour`);
  }
}

export default new DossierSalarieService();
