import axios from "axios";

export const generateQuestionFromAI = async (payload) => {
  const response = await axios.post(
    "http://localhost:8000/generate-question",
    payload
  );

  return response.data;
};
