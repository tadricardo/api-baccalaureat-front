import axiosInstance from './axiosInstance.service';
const API_URL = '/roles';
class RoleService {

  getAllRoles() {
    return axiosInstance.get(API_URL);
  }

  getAllRolesPage(page, size) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`);
  }

  getAllRolesPageAndKeyword(page, size, search, order) {
    //return axiosInstance.get(`${API_URL}/${page}/${size}/${search}`);
    return axiosInstance.get(`${API_URL}`, {
      params: {
        page,
        size,
        search,
        order,
      }
    })
  }

  getRoleById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getRoleByTitle(title) {
    return axiosInstance.get(`${API_URL}/search`, {params:{name:title}});
  }

  countRole(search) {
    return axiosInstance.get(`${API_URL}/count/${search}`);
  }

  saveRole(data) {
    return axiosInstance.post(API_URL, data);
  }

  updateRole(data) {
    return axiosInstance.put(API_URL, data);
  }

  deleteById(id) {
    return axiosInstance.delete(`${API_URL}/${id}`);
  }

  deleteDroitAccesByRole(idRole, idDA) {
    return axiosInstance.delete(`${API_URL}/delete/droit-role`, { params: { idRole: idRole, idDroitAcces: idDA }});
  }

  insertDroitAccesByRole(idRole, idDA) {
    return axiosInstance.get(`${API_URL}/insert/droit-role`, { params: { idRole: idRole, idDroitAcces: idDA }});
  }
}

export default new RoleService();
