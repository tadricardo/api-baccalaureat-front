import axiosInstance from './axiosInstance.service';
const API_URL = '/questionnaire';
class QuestionnaireService {

  getAllQuestionnaire() {
    return axiosInstance.get(API_URL);
  }


  getAllQuestionnaireByPage(page, size, ord, sort) {
    return axiosInstance.get(`${API_URL}/${page}/${size}`, {
      params: {
        sortBy: sort,
        order: ord
      }
    });
  }

  getAllByPageAndKeyword(page, size, search, ord, sort) {
    return axiosInstance.get(`${API_URL}/${page}/${size}/${search}`, {
      params: {
        sortBy: sort,
        order: ord
      }
    });
  }

  getQuestionnaireById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getQuestionByIdQuestionnaire(idQuestionnaire) {
    return axiosInstance.get(`${API_URL}/questions/${idQuestionnaire}`);
  }

  getQuestionByIdTypeEntretien(idTypeEntretien) {
    return axiosInstance.get(`${API_URL}/typeEntretien/${idTypeEntretien}`);
  }
  getQuestionnaireByTitleAndIdTypeEntretien(title, idTypeEntretien) {
    return axiosInstance.get(`${API_URL}/search`, {
      params: {
        name: title,
        idTypeEntretien: idTypeEntretien
      }
    })
  }

  count(search) {
    return axiosInstance.get(`${API_URL}/count/${search}`);
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

  deleteQuestionForQuestionnaire(idQuest, idQuestion) {
    return axiosInstance.delete(`${API_URL}/delete/question-questionnaire`, {
      params: {
        idQuestionnaire: idQuest,
        idQuestion: idQuestion
      }
    });
  }

  insertQuestionForQuestionnaire(idQuest, idQuestion) {
    return axiosInstance.get(`${API_URL}/insert/question-questionnaire`, {
      params: {
        idQuestionnaire: idQuest,
        idQuestion: idQuestion
      }
    });
  }

  countQuestionsByQuestionnaire(idQuestionnaire, search){
    return search !== undefined ? axiosInstance.get(`${API_URL}/${idQuestionnaire}/questions/count/${search}`):
      axiosInstance.get(`${API_URL}/${idQuestionnaire}/questions/count`);
  }


  getQuestionsByIdQuestionnaire(idQuestionnaire, page, size, search) {
    return search !== undefined ? axiosInstance.get(`${API_URL}/${idQuestionnaire}/questions/${page}/${size}/${search}`):
    axiosInstance.get(`${API_URL}/${idQuestionnaire}/questions/${page}/${size}`);
  }
}

export default new QuestionnaireService();
