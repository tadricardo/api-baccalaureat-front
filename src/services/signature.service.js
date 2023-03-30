import axiosInstance from './axiosInstance.service';
const API_URL = '/signature';
class SignatureService {

  donwloadSignatureByIdSignature(idSalarie) {
    return axiosInstance.get(`${API_URL}/getByIdSalarie`, {
      params: {
        idSalarie: idSalarie
      }
    });
  }

  saveUpdateSignature(data) {
    return axiosInstance.post(`${API_URL}/save-update`, data);
  }

  deleteSignature(idSalarie) {
    return axiosInstance.delete(`${API_URL}/delete`, {
      params: {
        idSalarie: idSalarie
      }
    });
  }

  signeCompteRendu(idCompteRendu, idSalarie) {
    return axiosInstance.get(`${API_URL}/compte-rendu/signature-salarie`, {
      params: {
        idCompteRendu: idCompteRendu,
        idSalarie: idSalarie
      }
    });
  }

  uploadSignatureCompteRendu(data) {
    return axiosInstance.post(`${API_URL}/compte-rendu/image-signature`, data);
  }
}

export default new SignatureService();
