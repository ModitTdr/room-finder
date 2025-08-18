import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export const getReviews = async (roomdId) => {
   const res = await axios.get(`{API/reviews/${roomId}}`);
   return res.data;
}

export const createReview = async ({ roomId, comment }) => {
   const res = await axios.post(`${API}/reviews/${roomId}`, { comment }, { withCredentials: true });
   return res.data;
}

export const deleteReview = async ({ roomId }) => {
   const res = await axios.delete(`${API}/reviews/${roomId}`, {
      withCredentials: true
   });
   return res.data;
} 