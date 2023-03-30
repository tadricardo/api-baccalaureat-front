import axiosInstance from './axiosInstance.service';
const API_URL = '/domaines';
class ServiceService {

  getAllService() {
    return axiosInstance.get(API_URL);
  }

  getAllServiceByPage(page,size,order) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`, {  params: {order: order}});
  }

  getAllServiceByPageAndKeyword(page,size,search,order) {
    return axiosInstance.get(`${API_URL}/${page}/${size}/${search}`, { params: {order: order}});
  }
  
  getServiceById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getServiceByTitre(title) {
    return axiosInstance.get(`${API_URL}/search`, { params: {name: title}});
  }

  countService(search) {
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

export default new ServiceService();
