import axiosInstance from './axiosInstance.service';
const API_URL = '/notification';
class NotificationService {

  getAllNotification() {
    return axiosInstance.get(API_URL);
  }

  getAllNotificationByPage(page, size) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`);
  }

  getAllNotificationByPageAndRecipient(idRecipient,page, size) {
    return axiosInstance.get(`${API_URL}/${idRecipient}/${page}/${size}`);
  }

  getNotificationByIdSalarie(idSalarie){
    return axiosInstance.get(`${API_URL}/salarie/${idSalarie}`);
  }

  countBySalarie(idSalarie){
    return axiosInstance.get(`${API_URL}/count/${idSalarie}`);
  }

  getNotificationNonLuesByIdSalarie(idSalarie){
    return axiosInstance.get(`${API_URL}/salarie/${idSalarie}/non-lues`);
  }

  countNonLuesBySalarie(idSalarie){
    return axiosInstance.get(`${API_URL}/count/${idSalarie}/non-lues`);
  }

  save(data) {
    return axiosInstance.post(API_URL, data);
  }

  update(data) {
    return axiosInstance.put(API_URL, data);
  }

  deleteById(id) {
    return axiosInstance.delete(`${API_URL}/${id}`);
  }
  
  count(){
    return axiosInstance.get(`${API_URL}/count`);
  }
}

export default new NotificationService();
