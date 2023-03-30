import axiosInstance from './axiosInstance.service';
const API_URL = '/organisme-de-formation';
class OrganismeDeFormationService {

  getAllOrganismeDeFormation() {
    return axiosInstance.get(`${API_URL}`);
  }
  getAllOrganismesInternes() {
    return axiosInstance.get( `${API_URL}/internes`);
  }

  getAllOrganismesExternes() {
    return axiosInstance.get(`${API_URL}/externes`);
  }

  findByName(name) {
    return axiosInstance.get(`${API_URL}/search/${name}`);
  }
 
  getOrganismeDeFormationById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

 

  saveOrUpdateOrganismeDeFormation(data) {
    return axiosInstance.post(API_URL, data);
  }

 

  deleteById(id) {
    return axiosInstance.delete(`${API_URL}/${id}`);
  }

}

export default new OrganismeDeFormationService();
