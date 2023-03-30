import axiosInstance from './axiosInstance.service';
const API_URL = '/fiche-poste';
class PosteFicheService {

  getAllPosteFiche() {
    return axiosInstance.get(API_URL);
  }

  getAllPosteFicheByPageAndKeyword(page, size, search, sortBy, order) {
    return axiosInstance.get(`${API_URL}/${page}/${size}/${search}`, {
      params: {
        order: order,
        sortBy: sortBy
      }
    });
  }

  countPosteFicheByPageAndKeyword(search) {
    return axiosInstance.get(`${API_URL}/count/${search}`);
  }

  getPosteFicheById(id) {
    return axiosInstance.get(`${API_URL}/id/${id}`);
  }

  /*
  uploadFile = (event) => {
    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('posteFiche', this.props.posteFiche);
    posteFicheService.savePosteFicheWithFile(formData).then(() => {
      this.reloadFileList();
    });
  }
  */
  savePosteFicheWithFile(data) {
    return axiosInstance.post(`${API_URL}/upload`, data);
  }

  savePosteFiche(data) {
    return axiosInstance.post(API_URL, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  updatePosteFiche(data) {
    return axiosInstance.put(API_URL, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  deletePosteFiche(id) {
    return axiosInstance.delete(`${API_URL}/id/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getFile(id) {
    return axiosInstance.get(`${API_URL}/fichier/${id}`,{
      responseType: 'blob',
    })
  }
}

export default new PosteFicheService();
