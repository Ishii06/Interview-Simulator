const BASE_URL = "http://localhost:5000";

export const getInterviewHistory = async () => {
  const res = await fetch(`${BASE_URL}/api/interview/history`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Failed to fetch interview history");
  }

  return data;
};

export const createTest = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/api/tests/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
};

export const getQuestionsByTestId = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/questions/${id}`);
  return res.json();
};

export const submitTest = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/api/results/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
};