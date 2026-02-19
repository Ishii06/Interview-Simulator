import axios from 'axios'

export const generateQuestions = async (payload) => {
  try {
    const response = await axios.post(
      'http://localhost:8000/generate',
      payload
    )

    return response.data.questions
  } catch (error) {
    console.error("Python service error:", error.message)
    throw new Error("Failed to generate questions")
  }
}
