"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
	AlertCircle,
	Loader2,
	Mic,
	PauseCircle,
	Play,
	Send,
	Sparkles,
	Square,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000";

type RoleType = "assistant" | "user";

type ConversationMessage = {
	role: RoleType;
	content: string;
};

type EvaluationAnswer = {
	answer_number: number;
	score: number;
	strength: string;
	improvement: string;
};

type EvaluationResponse = {
	answers: EvaluationAnswer[];
	overall_technical_score: number;
	communication_score: number;
	key_strengths: string[];
	areas_to_improve: string[];
	hire_recommendation: string;
};

export default function InterviewPage() {
	const [role, setRole] = useState("Python Developer");
	const [experience, setExperience] = useState("fresher");
	const [difficulty, setDifficulty] = useState("medium");
	const [skillsInput, setSkillsInput] = useState("python, fastapi, sql");

	const [interviewId, setInterviewId] = useState<string | null>(null);
	const [isInterviewStarted, setIsInterviewStarted] = useState(false);
	const [messages, setMessages] = useState<ConversationMessage[]>([]);
	const [questionText, setQuestionText] = useState("");
	const [questionAudioUrl, setQuestionAudioUrl] = useState<string | null>(null);
	const [latestTranscript, setLatestTranscript] = useState("");
	const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);

	const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [isTranscribing, setIsTranscribing] = useState(false);
	const [isEvaluating, setIsEvaluating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const recordedChunksRef = useRef<Blob[]>([]);

	const parsedSkills = useMemo(
		() =>
			skillsInput
				.split(",")
				.map((skill) => skill.trim())
				.filter(Boolean),
		[skillsInput]
	);

	const appendMessage = (message: ConversationMessage) => {
		setMessages((prev) => [...prev, message]);
	};

	const generateQuestion = async (payloadInterviewId?: string) => {
		setIsLoadingQuestion(true);
		setError(null);

		try {
			const res = await fetch(`${API_BASE_URL}/api/interview/question`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					role,
					experience,
					difficulty,
					level: experience,
					skills: parsedSkills,
					interviewId: payloadInterviewId,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data?.error || "Failed to generate interview question");
			}

			const nextQuestionText = (data?.questionText || "").trim();
			const nextAudioUrl = data?.audioUrl || null;
			const nextInterviewId = data?.interviewId || payloadInterviewId;

			if (!nextQuestionText) {
				throw new Error("Question text was empty");
			}

			if (nextInterviewId && !interviewId) {
				setInterviewId(nextInterviewId);
			}

			setQuestionText(nextQuestionText);
			setQuestionAudioUrl(nextAudioUrl);
			appendMessage({ role: "assistant", content: nextQuestionText });

			if (!isInterviewStarted) {
				setIsInterviewStarted(true);
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : "Unexpected error";
			setError(message);
		} finally {
			setIsLoadingQuestion(false);
		}
	};

	const startInterview = async () => {
		setMessages([]);
		setLatestTranscript("");
		setEvaluation(null);
		await generateQuestion();
	};

	const startRecording = async () => {
		setError(null);

		if (!interviewId) {
			setError("Start the interview before recording an answer.");
			return;
		}

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

			recordedChunksRef.current = [];
			mediaRecorderRef.current = recorder;

			recorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					recordedChunksRef.current.push(event.data);
				}
			};

			recorder.onstop = async () => {
				stream.getTracks().forEach((track) => track.stop());
				await transcribeAndAskNext();
			};

			recorder.start();
			setIsRecording(true);
		} catch {
			setError("Microphone access failed. Please allow mic permissions.");
		}
	};

	const stopRecording = () => {
		const recorder = mediaRecorderRef.current;
		if (recorder && recorder.state !== "inactive") {
			recorder.stop();
			setIsRecording(false);
		}
	};

	const transcribeAndAskNext = async () => {
		if (!interviewId) {
			setError("Missing interview ID. Restart interview and try again.");
			return;
		}

		const audioBlob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
		if (audioBlob.size === 0) {
			setError("No audio captured. Please record again.");
			return;
		}

		setIsTranscribing(true);
		setError(null);

		try {
			const formData = new FormData();
			formData.append("file", audioBlob, "answer.webm");
			formData.append("interviewId", interviewId);

			const transcribeRes = await fetch(`${API_BASE_URL}/api/interview/transcribe`, {
				method: "POST",
				credentials: "include",
				body: formData,
			});

			const transcribeData = await transcribeRes.json();
			if (!transcribeRes.ok) {
				throw new Error(transcribeData?.error || "Transcription failed");
			}

			const transcript = (transcribeData?.text || "").trim();
			if (!transcript) {
				throw new Error("Empty transcript returned. Please answer again.");
			}

			setLatestTranscript(transcript);
			appendMessage({ role: "user", content: transcript });

			await generateQuestion(interviewId);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Unexpected error";
			setError(message);
		} finally {
			setIsTranscribing(false);
			recordedChunksRef.current = [];
		}
	};

	const evaluateInterview = async () => {
		if (!interviewId) {
			setError("Start interview before evaluation.");
			return;
		}

		setIsEvaluating(true);
		setError(null);

		try {
			const res = await fetch(`${API_BASE_URL}/api/interview/evaluate`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ interviewId }),
			});

			const data = await res.json();
			if (!res.ok) {
				throw new Error(data?.error || "Failed to evaluate interview");
			}

			setEvaluation(data?.evaluation || null);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Unexpected error";
			setError(message);
		} finally {
			setIsEvaluating(false);
		}
	};

	const disableAction = isLoadingQuestion || isTranscribing || isEvaluating;

	return (
		<div className="min-h-screen bg-[#09090b] text-zinc-100 px-4 py-10 md:px-8">
			<div className="mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 18 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<h1 className="text-4xl font-bold tracking-tight">AI Voice Interview</h1>
					<p className="mt-2 text-zinc-400">
						Start a role-based interview, answer by voice, and get evaluation instantly.
					</p>
				</motion.div>

				<div className="grid gap-6 lg:grid-cols-12">
					<section className="lg:col-span-4 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
						<h2 className="mb-5 text-xl font-semibold">Interview Setup</h2>

						<div className="space-y-4">
							<label className="block">
								<span className="mb-1 block text-sm text-zinc-400">Role</span>
								<input
									value={role}
									onChange={(e) => setRole(e.target.value)}
									disabled={isInterviewStarted}
									className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none transition focus:border-indigo-500"
								/>
							</label>

							<label className="block">
								<span className="mb-1 block text-sm text-zinc-400">Experience</span>
								<select
									value={experience}
									onChange={(e) => setExperience(e.target.value)}
									disabled={isInterviewStarted}
									className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none transition focus:border-indigo-500"
								>
									<option value="fresher">Fresher</option>
									<option value="junior">Junior</option>
									<option value="mid">Mid</option>
									<option value="senior">Senior</option>
								</select>
							</label>

							<label className="block">
								<span className="mb-1 block text-sm text-zinc-400">Difficulty</span>
								<select
									value={difficulty}
									onChange={(e) => setDifficulty(e.target.value)}
									disabled={isInterviewStarted}
									className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none transition focus:border-indigo-500"
								>
									<option value="easy">Easy</option>
									<option value="medium">Medium</option>
									<option value="hard">Hard</option>
								</select>
							</label>

							<label className="block">
								<span className="mb-1 block text-sm text-zinc-400">Skills (comma separated)</span>
								<input
									value={skillsInput}
									onChange={(e) => setSkillsInput(e.target.value)}
									disabled={isInterviewStarted}
									className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none transition focus:border-indigo-500"
								/>
							</label>
						</div>

						<button
							onClick={startInterview}
							disabled={disableAction || isInterviewStarted}
							className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500/20 px-4 py-3 font-semibold text-indigo-300 transition hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isLoadingQuestion ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
							{isLoadingQuestion ? "Starting..." : "Start Interview"}
						</button>

						<button
							onClick={evaluateInterview}
							disabled={!interviewId || disableAction}
							className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-3 font-semibold text-emerald-300 transition hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isEvaluating ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
							{isEvaluating ? "Evaluating..." : "Finish & Evaluate"}
						</button>

						{error && (
							<div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
								<div className="flex items-start gap-2">
									<AlertCircle size={16} className="mt-0.5" />
									<span>{error}</span>
								</div>
							</div>
						)}
					</section>

					<section className="lg:col-span-8 space-y-6">
						<div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
							<h2 className="mb-4 text-xl font-semibold">Current Question</h2>
							<p className="min-h-20 whitespace-pre-wrap text-zinc-200">
								{questionText || "Your first interview question will appear here."}
							</p>

							{questionAudioUrl && (
								<audio
									controls
									src={questionAudioUrl}
									className="mt-4 w-full"
								>
									Your browser does not support audio playback.
								</audio>
							)}

							<div className="mt-6 flex flex-wrap gap-3">
								<button
									onClick={startRecording}
									disabled={!interviewId || isRecording || disableAction}
									className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2.5 font-semibold text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
								>
									<Mic size={16} />
									Start Recording
								</button>
								<button
									onClick={stopRecording}
									disabled={!isRecording}
									className="inline-flex items-center gap-2 rounded-xl bg-rose-500/20 px-4 py-2.5 font-semibold text-rose-300 transition hover:bg-rose-500/30 disabled:cursor-not-allowed disabled:opacity-60"
								>
									<Square size={16} />
									Stop Recording
								</button>
							</div>

							{(isTranscribing || isLoadingQuestion) && (
								<div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-300">
									<Loader2 size={16} className="animate-spin" />
									{isTranscribing ? "Transcribing your answer..." : "Generating next question..."}
								</div>
							)}

							{latestTranscript && (
								<div className="mt-5 rounded-xl border border-zinc-700 bg-zinc-950/70 p-4">
									<p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">Latest Transcript</p>
									<p className="text-sm text-zinc-200">{latestTranscript}</p>
								</div>
							)}
						</div>

						<div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
							<h2 className="mb-4 text-xl font-semibold">Interview Timeline</h2>
							<div className="space-y-3">
								{messages.length === 0 && (
									<p className="text-zinc-500">No messages yet. Start interview to begin.</p>
								)}

								{messages.map((message, index) => (
									<div
										key={`${message.role}-${index}`}
										className={`rounded-xl border p-3 text-sm ${
											message.role === "assistant"
												? "border-indigo-500/30 bg-indigo-500/10 text-indigo-100"
												: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
										}`}
									>
										<p className="mb-1 text-xs uppercase tracking-wide opacity-80">{message.role}</p>
										<p className="whitespace-pre-wrap">{message.content}</p>
									</div>
								))}
							</div>
						</div>

						{evaluation && (
							<div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
								<h2 className="mb-4 text-xl font-semibold">Evaluation Report</h2>

								<div className="mb-5 grid gap-3 sm:grid-cols-3">
									<MetricCard label="Technical" value={String(evaluation.overall_technical_score)} />
									<MetricCard label="Communication" value={String(evaluation.communication_score)} />
									<MetricCard label="Recommendation" value={evaluation.hire_recommendation} />
								</div>

								<div className="mb-5 grid gap-4 md:grid-cols-2">
									<SimpleList title="Key Strengths" items={evaluation.key_strengths} />
									<SimpleList title="Areas To Improve" items={evaluation.areas_to_improve} />
								</div>

								<div className="space-y-3">
									<h3 className="text-sm uppercase tracking-wide text-zinc-400">Answer Breakdown</h3>
									{evaluation.answers?.map((item) => (
										<div
											key={item.answer_number}
											className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-4"
										>
											<div className="mb-2 flex items-center justify-between text-sm">
												<span className="font-semibold">Answer {item.answer_number}</span>
												<span className="rounded-full bg-zinc-800 px-2 py-1 text-xs">Score: {item.score}/10</span>
											</div>
											<p className="text-sm text-zinc-300">
												<span className="font-medium text-zinc-100">Strength:</span> {item.strength}
											</p>
											<p className="mt-1 text-sm text-zinc-300">
												<span className="font-medium text-zinc-100">Improve:</span> {item.improvement}
											</p>
										</div>
									))}
								</div>
							</div>
						)}
					</section>
				</div>
			</div>
		</div>
	);
}

function MetricCard({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl border border-zinc-700 bg-zinc-950/70 p-3">
			<p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
			<p className="mt-1 text-lg font-semibold text-zinc-100">{value}</p>
		</div>
	);
}

function SimpleList({ title, items }: { title: string; items: string[] }) {
	return (
		<div className="rounded-xl border border-zinc-700 bg-zinc-950/70 p-4">
			<h3 className="mb-2 text-sm uppercase tracking-wide text-zinc-400">{title}</h3>
			<ul className="space-y-1 text-sm text-zinc-200">
				{items?.length ? (
					items.map((item, index) => <li key={`${title}-${index}`}>• {item}</li>)
				) : (
					<li className="text-zinc-500">No data</li>
				)}
			</ul>
		</div>
	);
}
