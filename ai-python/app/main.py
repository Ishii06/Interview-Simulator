from fastapi import FastAPI,APIRouter, UploadFile, File ,HTTPException
from pydantic import BaseModel
from typing import List, Optional
from piper import PiperVoice, SynthesisConfig
import uuid
import os
import json
import wave
from google import genai
from dotenv import load_dotenv
import whisper
import tempfile
import shutil
import json
import re

load_dotenv()



app = FastAPI()

model = whisper.load_model("base") 

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
 
#ishimishi
class MockTestRequest(BaseModel):
    role: str
    experience: str
    difficulty: str

def build_mock_test_prompt(role: str, experience: str, difficulty: str):
    return f"""
You are an aptitude test creator.

Generate exactly 15 multiple choice questions.

Sections:
- 5 Verbal
- 5 Logical
- 5 Numerical

For:
Role: {role}
Experience: {experience}
Difficulty: {difficulty}

Return ONLY valid JSON.

Format strictly like this:

[
  {{
    "section": "Verbal",
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option A"
  }}
]

Rules:
- Exactly 15 questions
- Exactly 4 options each
- correct_answer must match one option exactly
- Do NOT add explanation
- Do NOT add markdown
- Do NOT add text outside JSON

For each question:
- First internally solve it.
- Then generate 4 options including the correct one.
- Ensure correct_answer exactly matches one option.
- Double check logic before returning JSON.
"""

#tejapeja


def build_prompt(role, experience, skills, difficulty, history=None):
    base_context = f"""
You are a professional technical interviewer.

Candidate Role: {role}
Experience Level: {experience}
Focus Skills: {", ".join(skills)}
Difficulty: {difficulty}

"""

    if history:
        formatted_history = "\n".join(
            [f"{msg['role'].capitalize()}: {msg['content']}" for msg in history]
        )

        return base_context + f"""
Here is the conversation so far:

{formatted_history}

Based on the last user answer, ask ONE relevant follow-up question.
Do NOT give feedback.
Do NOT give score.
Only ask the next interview question.
"""

    else:
        return base_context + """
Ask ONE interview question only.
Do NOT give the answer.
"""

def build_evaluation_prompt(role, experience, skills, conversation):
    user_answers = [
        msg["content"]
        for msg in conversation
        if msg["role"] == "user"
    ]

    formatted_answers = "\n\n".join(
        [f"Answer {i+1}:\n{ans}" for i, ans in enumerate(user_answers)]
    )

    return f"""
You are a senior technical interviewer.

Candidate Role: {role}
Experience Level: {experience}
Focus Skills: {", ".join(skills)}

Below are the candidate's answers from the interview:

{formatted_answers}

For EACH answer:
- Give a score out of 10
- Mention 1 strength
- Mention 1 improvement

Then provide:
- Overall technical score (out of 10)
- Communication score (out of 10)
- 3 key strengths
- 3 areas to improve
- Final hiring recommendation (Hire / Borderline / No Hire)

IMPORTANT:
Return response strictly in valid JSON format like this:

{{
  "answers": [
    {{
      "answer_number": 1,
      "score": 7,
      "strength": "...",
      "improvement": "..."
    }}
  ],
  "overall_technical_score": 7.5,
  "communication_score": 8,
  "key_strengths": ["...", "...", "..."],
  "areas_to_improve": ["...", "...", "..."],
  "hire_recommendation": "Borderline"
}}
"""

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
    history = data.get("history", []) 

        # 🧠 Build prompt
    prompt = build_prompt(role, experience, skills, difficulty,history)

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

@app.post("/speech-to-text")
async def speech_to_text(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        shutil.copyfileobj(file.file, tmp)
        temp_path = tmp.name

    result = model.transcribe(temp_path)

    return {
        "text": result["text"]
    }

def clean_json_response(text: str):
    """
    Removes markdown code blocks like ```json ... ``` 
    and returns clean JSON string.
    """
    # Remove ```json and ``` wrappers
    text = re.sub(r"```json", "", text)
    text = re.sub(r"```", "", text)
    return text.strip()

@app.post("/evaluate-interview")
def evaluate_interview(data: dict):
    role = data.get("role")
    experience = data.get("experience")
    skills = data.get("skills")
    conversation = data.get("history", [])

    if not conversation:
        return {"error": "Conversation history required"}

    prompt = build_evaluation_prompt(
        role,
        experience,
        skills,
        conversation
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        raw_text = response.text.strip()

        # ✅ Clean markdown if model still adds it
        cleaned_text = clean_json_response(raw_text)

        # ✅ Parse JSON safely
        parsed_json = json.loads(cleaned_text)

        return parsed_json

    except json.JSONDecodeError:
        return {
            "error": "Model did not return valid JSON",
            "raw_response": raw_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-mock-test")
def generate_mock_test(data: MockTestRequest):

    prompt = build_mock_test_prompt(
        data.role,
        data.experience,
        data.difficulty
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    raw_text = response.text.strip()

    try:
        questions = json.loads(raw_text)
    except Exception:
        return {
            "error": "AI returned invalid JSON",
            "raw_response": raw_text
        }

    # Extra validation safety
    if not isinstance(questions, list) or len(questions) != 15:
        return {
            "error": "AI did not return exactly 15 questions",
            "raw_response": raw_text
        }

    return {"questions": questions}

@app.get("/")
def home():
    return {"message": "AI Service Running"}
