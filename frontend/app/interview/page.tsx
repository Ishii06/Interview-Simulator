"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Clock3, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { getInterviewHistory } from "../lib/api";

type HistoryMessage = {
	id: string;
	role: "assistant" | "user";
	content: string;
	created_at: string;
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

type InterviewHistoryItem = {
	id: string;
	role: string;
	level: string;
	status: string;
	created_at: string;
	evaluation: EvaluationResponse | null;
	messages: HistoryMessage[];
};

export default function InterviewPage() {
	const router = useRouter();

	const [role, setRole] = useState("Python Developer");
	const [experience, setExperience] = useState("fresher");
	const [difficulty, setDifficulty] = useState("medium");
	const [skillsInput, setSkillsInput] = useState("python, fastapi, sql");

	const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
	const [isLoadingHistory, setIsLoadingHistory] = useState(true);
	const [isStarting, setIsStarting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const parsedSkills = useMemo(
		() =>
			skillsInput
				.split(",")
				.map((skill) => skill.trim())
				.filter(Boolean),
		[skillsInput]
	);

	const loadHistory = async () => {
		setIsLoadingHistory(true);
		try {
			const data = await getInterviewHistory();
			setHistory(data?.history || []);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to fetch history";
			setError(message);
		} finally {
			setIsLoadingHistory(false);
		}
	};

	useEffect(() => {
		loadHistory();
	}, []);

	const startInterview = () => {
		setError(null);
		setIsStarting(true);

		const params = new URLSearchParams({
			role,
			experience,
			difficulty,
			skills: parsedSkills.join(","),
		});

		router.push(`/interview/simulator?${params.toString()}`);
	};

	return (
		<div className="min-h-screen bg-[#09090b] px-4 py-10 text-zinc-100 md:px-8">
			<div className="mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 18 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<h1 className="text-4xl font-bold tracking-tight">AI Voice Interview</h1>
					<p className="mt-2 text-zinc-400">
						Set up your interview and review your recent interview history.
					</p>
				</motion.div>

				<div className="grid gap-6 lg:grid-cols-12">
					<section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 lg:col-span-4">
						<h2 className="mb-5 text-xl font-semibold">Interview Setup</h2>

						<div className="space-y-4">
							<label className="block">
								<span className="mb-1 block text-sm text-zinc-400">Role</span>
								<input
									value={role}
									onChange={(e) => setRole(e.target.value)}
									className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none transition focus:border-indigo-500"
								/>
							</label>

							<label className="block">
								<span className="mb-1 block text-sm text-zinc-400">Experience</span>
								<select
									value={experience}
									onChange={(e) => setExperience(e.target.value)}
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
									className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none transition focus:border-indigo-500"
								/>
							</label>
						</div>

						<button
							onClick={startInterview}
							disabled={isStarting}
							className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500/20 px-4 py-3 font-semibold text-indigo-300 transition hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isStarting ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
							{isStarting ? "Opening simulator..." : "Start Interview"}
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

					<section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 lg:col-span-8">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-xl font-semibold">Interview History</h2>
							<button
								onClick={loadHistory}
								disabled={isLoadingHistory}
								className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isLoadingHistory ? "Refreshing..." : "Refresh"}
							</button>
						</div>

						{isLoadingHistory ? (
							<div className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-300">
								<Loader2 size={16} className="animate-spin" /> Loading history...
							</div>
						) : history.length === 0 ? (
							<p className="text-zinc-500">No interview history yet.</p>
						) : (
							<div className="space-y-3">
								{history.map((item) => {
									const assistantCount = item.messages?.filter((m) => m.role === "assistant").length || 0;
									const lastMessage = item.messages?.[item.messages.length - 1];
									return (
										<div key={item.id} className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-4">
											<div className="mb-2 flex flex-wrap items-center justify-between gap-2">
												<p className="font-semibold text-zinc-100">{item.role || "Interview"}</p>
												<span className="rounded-full bg-zinc-800 px-2 py-1 text-xs uppercase text-zinc-300">
													{item.status}
												</span>
											</div>
											<div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
												<span className="inline-flex items-center gap-1">
													<Clock3 size={12} /> {new Date(item.created_at).toLocaleString()}
												</span>
												<span>Level: {item.level || "N/A"}</span>
												<span>Questions: {assistantCount}</span>
											</div>
											{item.evaluation && (
												<p className="mb-2 text-sm text-emerald-300">
													Tech: {item.evaluation.overall_technical_score} | Comm: {item.evaluation.communication_score} | {" "}
													{item.evaluation.hire_recommendation}
												</p>
											)}
											<p className="line-clamp-2 text-sm text-zinc-300">
												{lastMessage?.content || "No messages available"}
											</p>
										</div>
									);
								})}
							</div>
						)}
					</section>
				</div>
			</div>
		</div>
	);
}