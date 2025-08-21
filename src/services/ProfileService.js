import api from "./Api";

const getTotalAnggota = async (userId) => {
  const url = `/api/profile/${userId}`;
  try {
    const response = await api.get(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};


export default {
  getTotalAnggota
};
