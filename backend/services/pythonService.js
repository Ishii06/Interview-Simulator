import axios from 'axios'

export const generateQuestions = async (payload) => {
  try {
    const response = await axios.post(
      'http://localhost:8000/generate-mock-test',
      payload
    )

    return response.data.questions
  } catch (error) {
    console.error("Python service error:", error.message)
    throw new Error("Failed to generate questions")
  }
}

export const generateAnswerExplanation = async (payload) => {
  try {
    const response = await axios.post(
      'http://localhost:8000/generate-answer-explanation',
      payload,
      { timeout: 20000 }
    )

    return response.data.explanation
  } catch (error) {
    console.error("Python service explanation error:", error.message)
    throw new Error("Failed to generate explanation")
  }
}
