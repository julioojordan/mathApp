import api from "./Api";

const getTotalAnggota = async (user_id) => {
  const url = `/api/profile/${user_id}`;
  try {
    const response = await api.get(url);
    return Promise.resolve(response.data.response);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};


export default {
  getTotalAnggota
};
