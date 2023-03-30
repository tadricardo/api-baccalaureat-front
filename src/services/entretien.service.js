import axiosInstance from './axiosInstance.service';
const API_URL = '/entretiens';
class EntretienService {

  getAllEntretiens() {
    return axiosInstance.get(API_URL);
  }

  getAllEntretiensByPage(page, size, idSalarie, idManager, startDate, endDate) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`, {
      params: {
        idSalarie: idSalarie,
        idManager: idManager,
        firstDate: startDate,
        lastDate: endDate
      }
    });
  }

  getEntretienById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getEntretienByManager(idManager) {
    return axiosInstance.get(`${API_URL}/manager/${idManager}`);
  }

  getEntretienBySalarie(idSalarie) {
    return axiosInstance.get(`${API_URL}/salarie/${idSalarie}`);
  }

  getEntretiensBySalarieId(salarieId, page, size, column, order) {
    return axiosInstance.get(`${API_URL}/salarie/${salarieId}`, {
      params: {
        page,
        size,
        column,
        order,
      }
    })
  }

  count(idSalarie, idManager, startDate, endDate) {
    return axiosInstance.get(`${API_URL}/count`, {
      params: {
        idSalarie: idSalarie,
        idManager: idManager,
        firstDate: startDate,
        lastDate: endDate
      }
    });
  }

  save(data) {
    return axiosInstance.post(`${API_URL}`, data);
  }

  update(data, idQuest) {
    return axiosInstance.put(`${API_URL}/entretien/${idQuest}`, data);
  }

  delete(id) {
    return axiosInstance.delete(`${API_URL}/${id}`);
  }

  getParticipantByIdEntretien(id) {
    return axiosInstance.get(`${API_URL}/${id}/participant`);
  }

  updateParticipants(id, data) {
    return axiosInstance.put(`${API_URL}/${id}/participant`, data);
  }

  deleteParticipantByIdEntretien(idSalarie, idEntretien) {
    return axiosInstance.delete(`${API_URL}/${idEntretien}/participant`, {
      params: {
        idSalarie: idSalarie
      }
    });
  }

  getAllEntretiensManagerByPage(page, size, idSalarie, idManager, startDate, endDate) {
    return axiosInstance.get(`${API_URL}/entretien-manager/${idManager}/${page}/${size}`, {
      params: {
        idSalarie: idSalarie,
        firstDate: startDate,
        lastDate: endDate
      }
    });
  }

  countEntretiensManager(idSalarie, idManager, startDate, endDate) {
    return axiosInstance.get(`${API_URL}/entretien-manager/${idManager}/count`, {
      params: {
        idSalarie: idSalarie,
        firstDate: startDate,
        lastDate: endDate
      }
    });
  }
}

export default new EntretienService();
