from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from piper import PiperVoice, SynthesisConfig
import uuid
import os
import wave
from google import genai
from dotenv import load_dotenv

load_dotenv()



app = FastAPI()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


VOICE_PATH = "voices/en_GB-northern_english_male-medium.onnx"
voice = PiperVoice.load(VOICE_PATH)   # load once at startup
syn_config = SynthesisConfig(
    volume=1.1,
    length_scale=1.2,   # 🔥 slower
    noise_scale=0.4,
    noise_w_scale=0.4,
    normalize_audio=True,
)

os.makedirs("audio", exist_ok=True)

class TestRequest(BaseModel):
    type: str
    difficulty: str
    role: Optional[str] = None


class Question(BaseModel):
    section: str
    question: str
    options: List[str]
    correct_answer: str
    difficulty: str


class TestResponse(BaseModel):
    questions: List[Question]



def generate_aptitude_questions(difficulty):
    sections = ["numerical", "logical", "verbal"]
    questions = []

    for section in sections:
        for i in range(5):
            questions.append({
                "section": section,
                "question": f"{section} question {i+1} ({difficulty})",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "Option A",
                "difficulty": difficulty
            })

    return questions

def build_prompt(role, experience, skills, difficulty):
    return f"""
    Act as a professional technical interviewer.

    Candidate Role: {role}
    Experience Level: {experience}
    Focus Skills: {", ".join(skills)}
    Difficulty: {difficulty}

    Ask ONE interview question only.
    Do NOT give the answer.
    """


@app.post("/generate", response_model=TestResponse)
def generate_test(request: TestRequest):

    questions = generate_aptitude_questions(request.difficulty)

    return {"questions": questions}

@app.post("/tts")
def generate_tts(data: dict):
    text = data["text"]

    file_name = f"{uuid.uuid4()}.wav"
    file_path = f"audio/{file_name}"

    with wave.open(file_path, "wb") as wav_file:
        voice.synthesize_wav(text, wav_file,syn_config=syn_config)

    return {
        "audio_url": f"/audio/{file_name}"
    }

@app.post("/generate-question")
def generate_question(data: dict):
    role = data.get("role")
    experience = data.get("experience")
    skills = data.get("skills")
    difficulty = data.get("difficulty")

        # 🧠 Build prompt
    prompt = build_prompt(role, experience, skills, difficulty)

    # 🧠 Ask Gemini
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    question_text = response.text.strip()

    # 🎤 Generate audio
    file_name = f"{uuid.uuid4()}.wav"
    os.makedirs("audio", exist_ok=True)
    file_path = f"audio/{file_name}"

    with wave.open(file_path, "wb") as wav_file:
        voice.synthesize_wav(question_text, wav_file,syn_config=syn_config)

    return {
        "questionText": question_text,
        "audioUrl": f"/audio/{file_name}"
    }


@app.get("/")
def home():
    return {"message": "AI Service Running"}
