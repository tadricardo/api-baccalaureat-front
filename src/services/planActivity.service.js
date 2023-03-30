import axiosInstance from './axiosInstance.service';
const API_URL = '/annualActivityPlan';
class PlanActivityService {

  export (idPaa) {
    return axiosInstance.get(`${API_URL}/export/excel`, {
      responseType: 'blob',
      params: {
        paa: idPaa
      }
    });
  }

  getBySalarie(id, page, size) {
    return axiosInstance.get(`${API_URL}/salarie/${id}/${page}/${size}`);
  }

  getById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getByYearAndIdSalarie(year, idSalarie) {
    return axiosInstance.get(`${API_URL}/paa`, {
      params: {
        year: year,
        idSalarie: idSalarie
      }
    });
  }

  

  getAll() {
    return axiosInstance.get(API_URL);
  }

  count(idSalarie, year) {
    return axiosInstance.get(`${API_URL}/count`, {
      params: {
        salarie: idSalarie,
        year: year
      }
    });
  }

  getAllByPage(page, size, idSalarie, year) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`, {
      params: {
        salarie: idSalarie,
        year: year
      }
    });
  }

  getAllByPageManager(page, size, idSalarie, year){
    return axiosInstance.get(`${API_URL}/manager/${page}/${size}`, {
      params: {
        salarie: idSalarie,
        year: year
      }
    });
  }

  getByYear(id, year) {
    return axiosInstance.get(`${API_URL}/salarie/${id}/${year}`);
  }

  delete(id) {
    return axiosInstance.delete(`${API_URL}/${id}`);
  }
}

export default new PlanActivityService();
