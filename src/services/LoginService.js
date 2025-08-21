import axios from "axios";

const auth = async (username, password) => {
  const apiUrl = window.env?.REACT_APP_API_URL || process.env.REACT_APP_API_URL;
  // const baseUrl = apiUrl || "https://pangruktilaya.parokiungaran.or.id/pangruktilaya-api";
  const baseUrl = "http://localhost:3001"
  const url = `${baseUrl}/login`;
  const requestBody = {
    username,
    password,
  };
  try {
    const response = await axios.post(url, requestBody);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

export default auth;
