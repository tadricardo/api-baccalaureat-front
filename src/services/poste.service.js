import axiosInstance from './axiosInstance.service';
const API_URL = '/postes';
class PosteService {

  getAllPoste() {
    return axiosInstance.get(API_URL);
  }

  getPostesBySalarieId(salarieId, page, size, column, order){
    return axiosInstance.get(`${API_URL}/salarie/${salarieId}`,{
      params:{
        page,
        size,
        column,
        order,
      }
    })
  }

  getAllCurrentPoste(page, size, order, sortBy) {
    return axiosInstance.get(`${API_URL}/poste-actuel/${page}/${size}/${order}/${sortBy}`);
  }

  getAllPosteByPage(page, size, order, sortBy) {
    return axiosInstance.get(`${API_URL}/${page}/${size}/${order}/${sortBy}`);
  }

  getPosteById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getAllPosteByTypeContrat(idTypeContrat) {
    return axiosInstance.get(`${API_URL}/typecontrat/${idTypeContrat}`);
  }

  getPosteByManager(idManager) {
    return axiosInstance.get(`${API_URL}/manager/${idManager}`);
  }

  getPosteByLieuTravail(idLieuTravail) {
    return axiosInstance.get(`${API_URL}/adresse/${idLieuTravail}`);
  }

  recherche(initilue) {
    return axiosInstance.get(`${API_URL}/recherche?initilue=${initilue}`);
  }

  rechercheDate(dateDebut, dateFin) {
    return axiosInstance.get(`${API_URL}/rechercheDate`, {
      params: {
        dateDebut: dateDebut,
        dateFin: dateFin
      }
    });
  }

  countPoste() {
    return axiosInstance.get(API_URL + `/count`);
  }

  countCurrentPoste() {
    return axiosInstance.get(API_URL + `/count-current`);
  }

  savePoste(data) {
    return axiosInstance.post(API_URL, data);
  }

  updatePoste(data) {
    return axiosInstance.put(API_URL, data);
  }

  deleteByIdPoste(id) {
    return axiosInstance.delete(`${API_URL}/${id}`);
  }

  cloturerPoste(idPoste, dateFin) {
    return axiosInstance.get(`${API_URL}/cloturer-poste/${idPoste}`, {
      params: {
        dateFin: dateFin
      }
    });
  }

  uploadFile(data) {
    return axiosInstance.post(`${API_URL}/save-file-contrat`, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }

  getContratPDF(idPoste) {
    return axiosInstance.get(`${API_URL}/get-file-contrat/${idPoste}`, {
      responseType: 'blob'
    });
  }

  savePosteWithContratPDF(data) {
    return axiosInstance.post(`${API_URL}/save-poste-contrat-PDF`, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
}

export default new PosteService();
