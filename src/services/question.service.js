import axiosInstance from './axiosInstance.service';
const API_URL = '/question';
class QuestionService {

  getAllQuestion(filtre, sort) {
    return axiosInstance.get(`${API_URL}/`, {
      params: {
        filtre: filtre,
        sort: sort
      }
    });
  }

  getAllQuestionByPage(page, size, sortBy, order) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`, {
      params: {
        order: order,
        sortBy: sortBy
      }
    });
  }
  getAllByPageAndKeyword(page, size, search, order, sortBy) {
    return axiosInstance.get(`${API_URL}/${page}/${size}/${search}`, {
      params: {
        sortBy: sortBy,
        order: order
      }
    });
  }

  getAllByPageAndKeywordAndNotInQuestionnaire(page, size, search, order, sortBy, idQuestionnaire) {
    return axiosInstance.get(`${API_URL}/questionnaire/${page}/${size}`, {
      params: {
        sortBy: sortBy,
        order: order,
        search: search,
        idQuestionnaire: idQuestionnaire
      }
    });
  }

  getQuestionById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getQuestionByIntitule(name) {
    return axiosInstance.get(`${API_URL}/search`, {
      params: {
        name: name
      }
    })
  }

  count(search) {
    return axiosInstance.get(`${API_URL}/count/${search}`);
  }

  countQuestion() {
    return axiosInstance.get(`${API_URL}/count`);
  }

  saveQuestion(data) {
    return axiosInstance.post(API_URL, data);
  }

  updateQuestion(data) {
    return axiosInstance.put(API_URL, data);
  }

  deleteQuestionById(id) {
    return axiosInstance.delete(`${API_URL}/${id}`);
  }
}

export default new QuestionService();
