import axiosInstance from "./axiosInstance.service";
const API_URL = "/compterendus";

class CompteRenduService {

  getCompteRenduById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getCompteRenduByEntretien(idEntretien) {
    return axiosInstance.get(`${API_URL}/entretien/${idEntretien}`);
  }

  getCompteRenduByManager(idManager) {
    return axiosInstance.get(`${API_URL}/manager/${idManager}`);
  }

  getCompteRenduBySalarie(idSalarie) {
    return axiosInstance.get(`${API_URL}/salarie/${idSalarie}`);
  }

  changeStatut(statut, idCompterendu) {
    return axiosInstance.get(`${API_URL}/statut`, {
      params: {
        idCompteRendu: idCompterendu,
        statut: statut
      },
    });
  }

  getCompteRenduPDF(idEntretien) {
    return axiosInstance.get(`${API_URL}/get-compte-rendu-pdf/${idEntretien}`, {
      responseType: "blob",
    });
  }

  getCompteRenduPDFVide(idEntretien) {
    return axiosInstance.get(`${API_URL}/get-compte-rendu-pdf-vide/${idEntretien}`, {
      responseType: "blob",
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

export default new CompteRenduService();
