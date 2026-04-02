"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Loader2, Mic, Send, Square } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import InterviewAvatar from "@/app/components/ui/InterviewAvatar";

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

export default function InterviewSimulatorPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const role = searchParams.get("role") || "Python Developer";
	const experience = searchParams.get("experience") || "fresher";
	const difficulty = searchParams.get("difficulty") || "medium";
	const skillsInput = searchParams.get("skills") || "python, fastapi, sql";

	const [interviewId, setInterviewId] = useState<string | null>(null);
	const [messages, setMessages] = useState<ConversationMessage[]>([]);
	const [questionText, setQuestionText] = useState("");
	const [questionAudioUrl, setQuestionAudioUrl] = useState<string | null>(null);
	const [questionLipSyncUrl, setQuestionLipSyncUrl] = useState<string | null>(null);
	const [latestTranscript, setLatestTranscript] = useState("");
	const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);

	const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [isTranscribing, setIsTranscribing] = useState(false);
	const [isEvaluating, setIsEvaluating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const recordedChunksRef = useRef<Blob[]>([]);
	const questionAudioRef = useRef<HTMLAudioElement | null>(null);

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
			const nextLipSyncUrl = data?.lipSyncUrl || null;
			const nextInterviewId = data?.interviewId || payloadInterviewId;

			if (!nextQuestionText) {
				throw new Error("Question text was empty");
			}

			if (nextInterviewId && !interviewId) {
				setInterviewId(nextInterviewId);
			}

			setQuestionText(nextQuestionText);
			setQuestionAudioUrl(nextAudioUrl);
			setQuestionLipSyncUrl(nextLipSyncUrl);
			appendMessage({ role: "assistant", content: nextQuestionText });
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
		setQuestionAudioUrl(null);
		setQuestionLipSyncUrl(null);
		setInterviewId(null);
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

	useEffect(() => {
		if (!questionAudioUrl || !questionAudioRef.current) {
			return;
		}

		const audio = questionAudioRef.current;
		audio.currentTime = 0;
		const playPromise = audio.play();
		if (playPromise) {
			playPromise.catch(() => {
				// Autoplay can be blocked by browser policy; controls remain available as fallback.
			});
		}
	}, [questionAudioUrl]);

	return (
		<div className="min-h-screen bg-[#09090b] px-4 py-10 text-zinc-100 md:px-8">
			<div className="mx-auto max-w-5xl space-y-6">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Interview Simulator</h1>
						<p className="mt-1 text-sm text-zinc-400">
							{role} | {experience} | {difficulty}
						</p>
					</div>
					<button
						onClick={() => router.push("/interview")}
						className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
					>
						Back to Setup
					</button>
				</div>

				<div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
					<p className="mb-4 text-sm text-zinc-400">
						Start to receive your first AI question, then respond using voice recording.
					</p>

					<div className="flex flex-wrap gap-3">
						<button
							onClick={startInterview}
							disabled={disableAction}
							className="inline-flex items-center gap-2 rounded-xl bg-indigo-500/20 px-4 py-2.5 font-semibold text-indigo-300 transition hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isLoadingQuestion ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
							{isLoadingQuestion ? "Starting..." : "Start Interview"}
						</button>

						<button
							onClick={evaluateInterview}
							disabled={!interviewId || disableAction}
							className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2.5 font-semibold text-emerald-300 transition hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isEvaluating ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
							{isEvaluating ? "Evaluating..." : "Finish & Evaluate"}
						</button>
					</div>

					{error && (
						<div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
							<div className="flex items-start gap-2">
								<AlertCircle size={16} className="mt-0.5" />
								<span>{error}</span>
							</div>
						</div>
					)}
				</div>

				<div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
					<h2 className="mb-4 text-xl font-semibold">Current Question</h2>
					<InterviewAvatar
						modelPath="/avatar/rpm-avatar.glb"
						audioRef={questionAudioRef}
						lipSyncUrl={questionLipSyncUrl}
					/>
					<p className="mt-3 text-xs text-zinc-500">
						Avatar source: Ready Player Me GLB. Place your file at /public/avatar/rpm-avatar.glb.
					</p>
					<p className="min-h-20 whitespace-pre-wrap text-zinc-200">
						{questionText || "Your first interview question will appear here."}
					</p>

					{questionAudioUrl && (
						<audio ref={questionAudioRef} controls autoPlay src={questionAudioUrl} className="mt-4 w-full">
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
					<h2 className="mb-4 text-xl font-semibold">Conversation History</h2>
					<div className="space-y-3">
						{messages.length === 0 && <p className="text-zinc-500">No messages yet. Start interview to begin.</p>}
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
					items.map((item, index) => <li key={`${title}-${index}`}>- {item}</li>)
				) : (
					<li className="text-zinc-500">No data</li>
				)}
			</ul>
		</div>
	);
}