const BASE_URL = "http://localhost:5000"

export const createTest = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })

  return res.json()
}

export const getTestById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/tests/${id}`)
  return res.json()
}

export const submitTest = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })

  return res.json()
}