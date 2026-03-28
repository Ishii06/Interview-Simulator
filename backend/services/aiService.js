import axios from "axios";

export const generateQuestionFromAI = async (payload) => {
  const response = await axios.post(
    "http://localhost:8000/generate-question",
    payload
  );

  return response.data;
};

export const evaluateInterviewFromAI = async (payload) => {
  const response = await axios.post(
    "http://localhost:8000/evaluate-interview",
    payload
  );

  return response.data;
};
