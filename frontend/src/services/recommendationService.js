import axios from "axios";
const API = import.meta.env.VITE_APP_URL

export const getRecommendedRoom = async (id) => {
  const res = await axios.get(`${API}/recommendation/${id}`);
  return res.data.rooms;
}
