import api from "./Api";

const getAllLesson = async (userId) => {
  const url = `/api/lessons?user_id=${idUser}`;
  try {
    const response = await api.get(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};


export default {
  getAllLesson
};
