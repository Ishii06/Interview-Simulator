"use client";

import { useMemo, useRef, useState } from "react";
import {
	generateInterviewQuestion,
	transcribeInterviewAnswer,
} from "@/app/lib/api";

type ChatMessage = {
	role: "assistant" | "user";
	content: string;
};

export default function CodingPracticePage() {
	const [role, setRole] = useState("Python Developer");
	const [level, setLevel] = useState("beginner");
	const [interviewId, setInterviewId] = useState<string | null>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [isTranscribing, setIsTranscribing] = useState(false);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const recorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	const canAskNext = useMemo(() => {
		return !!interviewId && !isGenerating && !isRecording && !isTranscribing;
	}, [interviewId, isGenerating, isRecording, isTranscribing]);

	const requestQuestion = async (
		interviewHistory: ChatMessage[],
		currentInterviewId?: string
	) => {
		setIsGenerating(true);
		setError(null);

		try {
			const data = await generateInterviewQuestion({
				role,
				experience: level,
				difficulty: level,
				skills: ["python"],
				history: interviewHistory,
				interviewId: currentInterviewId,
			});

			setInterviewId(data.interviewId);
			if (data.audioUrl) {
				setAudioUrl(data.audioUrl);
			}

			if (data.questionText) {
				setMessages((prev) => [...prev, { role: "assistant", content: data.questionText }]);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to get question");
		} finally {
			setIsGenerating(false);
		}
	};

	const startInterview = async () => {
		setMessages([]);
		setInterviewId(null);
		setAudioUrl(null);
		await requestQuestion([], undefined);
	};

	const askNextQuestion = async (historyOverride?: ChatMessage[]) => {
		const history = historyOverride || messages;
		await requestQuestion(history, interviewId || undefined);
	};

	const startRecording = async () => {
		if (!interviewId) {
			setError("Start interview first to create an interview session.");
			return;
		}

		setError(null);

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const recorder = new MediaRecorder(stream);
			chunksRef.current = [];

			recorder.ondataavailable = (event: BlobEvent) => {
				if (event.data.size > 0) {
					chunksRef.current.push(event.data);
				}
			};

			recorder.onstop = async () => {
				setIsRecording(false);
				setIsTranscribing(true);

				try {
					const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
					const data = await transcribeInterviewAnswer(audioBlob);
					const transcript = (data.text || "").trim();

					if (transcript) {
						const updatedHistory: ChatMessage[] = [
							...messages,
							{ role: "user", content: transcript },
						];

						setMessages(updatedHistory);
						await askNextQuestion(updatedHistory);
					} else {
						setError("Whisper could not detect speech. Please try again.");
					}
				} catch (err) {
					setError(err instanceof Error ? err.message : "Failed to transcribe answer");
				} finally {
					setIsTranscribing(false);
					stream.getTracks().forEach((track) => track.stop());
				}
			};

			recorderRef.current = recorder;
			recorder.start();
			setIsRecording(true);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Microphone access denied. Please allow microphone permission."
			);
		}
	};

	const stopRecording = () => {
		const recorder = recorderRef.current;
		if (recorder && recorder.state !== "inactive") {
			recorder.stop();
		}
	};

	return (
		<div className="min-h-screen bg-black text-white p-8 md:p-12">
			<div className="mx-auto max-w-4xl">
				<h1 className="text-3xl md:text-4xl font-bold mb-6">Python Voice Interview</h1>
				<p className="text-zinc-300 mb-8">
					Speak your Python answer. Your voice is transcribed with Whisper and saved to
					Supabase history in the same backend request.
				</p>

				<div className="grid md:grid-cols-2 gap-4 mb-6">
					<div>
						<label className="block text-sm text-zinc-400 mb-2">Role</label>
						<input
							value={role}
							onChange={(e) => setRole(e.target.value)}
							className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2"
						/>
					</div>

					<div>
						<label className="block text-sm text-zinc-400 mb-2">Level</label>
						<select
							value={level}
							onChange={(e) => setLevel(e.target.value)}
							className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2"
						>
							<option value="beginner">beginner</option>
							<option value="intermediate">intermediate</option>
							<option value="advanced">advanced</option>
						</select>
					</div>
				</div>

				<div className="flex flex-wrap gap-3 mb-8">
					<button
						onClick={startInterview}
						disabled={isGenerating || isRecording || isTranscribing}
						className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
					>
						{isGenerating && !interviewId ? "Starting..." : "Start Interview"}
					</button>

					{!isRecording ? (
						<button
							onClick={startRecording}
							disabled={!canAskNext}
							className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60"
						>
							Start Recording
						</button>
					) : (
						<button
							onClick={stopRecording}
							className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500"
						>
							Stop Recording
						</button>
					)}

					<button
						onClick={() => askNextQuestion()}
						disabled={!canAskNext || messages.length === 0}
						className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:opacity-60"
					>
						Ask Next Question
					</button>
				</div>

				{isTranscribing && <p className="mb-4 text-amber-300">Transcribing with Whisper...</p>}
				{error && <p className="mb-4 text-rose-400">{error}</p>}

				{audioUrl && (
					<div className="mb-8">
						<p className="text-sm text-zinc-400 mb-2">Latest AI Question Audio</p>
						<audio controls src={audioUrl} className="w-full" />
					</div>
				)}

				<div className="space-y-4">
					{messages.map((message, index) => (
						<div
							key={`${message.role}-${index}`}
							className={`rounded-xl p-4 border ${
								message.role === "assistant"
									? "bg-zinc-900 border-zinc-700"
									: "bg-emerald-950/30 border-emerald-800"
							}`}
						>
							<p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
								{message.role === "assistant" ? "Interviewer" : "You"}
							</p>
							<p className="whitespace-pre-wrap">{message.content}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
