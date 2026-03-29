"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Flame, IdCard, Mail, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "../../store/authStore";

type InterviewHistoryItem = {
	id: number | string;
	role?: string;
	level?: string;
	status?: string;
	created_at?: string;
};

const API_BASE_URL = "http://localhost:5000/api/interviews";

const titleCase = (value: string) =>
	value
		.split(/[._-]+|\s+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");

const toDateKey = (value: string) => {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return null;
	}
	return date.toISOString().slice(0, 10);
};

const getCurrentStreak = (dates: string[]) => {
	if (dates.length === 0) return 0;

	const ordered = Array.from(new Set(dates)).sort();
	let streak = 1;

	for (let index = ordered.length - 1; index > 0; index -= 1) {
		const current = new Date(`${ordered[index]}T00:00:00Z`);
		const previous = new Date(`${ordered[index - 1]}T00:00:00Z`);
		const diffDays = (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24);

		if (diffDays === 1) {
			streak += 1;
		} else if (diffDays > 1) {
			break;
		}
	}

	return streak;
};

const getConsistency = (dates: string[]) => {
	if (dates.length === 0) return 0;

	const uniqueDates = new Set(dates);
	const today = new Date();
	const windowStart = new Date();
	windowStart.setDate(today.getDate() - 29);

	let activeDays = 0;
	for (let offset = 0; offset < 30; offset += 1) {
		const day = new Date(windowStart);
		day.setDate(windowStart.getDate() + offset);
		const key = day.toISOString().slice(0, 10);
		if (uniqueDates.has(key)) {
			activeDays += 1;
		}
	}

	return Math.round((activeDays / 30) * 100);
};

export default function Profile() {
	const { user, initialized, fetchCurrentUser } = useAuthStore();
	const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
	const [loadingHistory, setLoadingHistory] = useState(true);

	useEffect(() => {
		if (!initialized) {
			fetchCurrentUser();
		}
	}, [initialized, fetchCurrentUser]);

	useEffect(() => {
		const loadHistory = async () => {
			setLoadingHistory(true);
			try {
				const response = await fetch(API_BASE_URL + "/history", {
					method: "GET",
					credentials: "include",
				});

				if (!response.ok) {
					setHistory([]);
					return;
				}

				const data = await response.json();
				setHistory(Array.isArray(data?.history) ? data.history : []);
			} catch {
				setHistory([]);
			} finally {
				setLoadingHistory(false);
			}
		};

		if (initialized && user) {
			void loadHistory();
		} else if (initialized && !user) {
			setLoadingHistory(false);
		}
	}, [initialized, user]);

	const derivedName = useMemo(() => {
		const metadataName = user?.user_metadata?.name || user?.user_metadata?.full_name;
		if (metadataName) {
			return String(metadataName);
		}

		if (user?.email) {
			return titleCase(user.email.split("@")[0]);
		}

		return "Interview User";
	}, [user]);

	const stats = useMemo(() => {
		const dates = history
			.map((item) => (item.created_at ? toDateKey(item.created_at) : null))
			.filter((item): item is string => Boolean(item));

		return {
			streak: getCurrentStreak(dates),
			consistency: getConsistency(dates),
			sessions: history.length,
		};
	}, [history]);

	const recentInterviews = history.slice(0, 3);

	if (!initialized || (initialized && !user)) {
		return (
			<main className="min-h-screen bg-[#07070a] text-white px-6 py-28">
				<div className="mx-auto max-w-3xl rounded-3xl border border-white/8 bg-white/3 p-8">
					<p className="text-sm uppercase tracking-[0.22em] text-white/40">Profile</p>
					<h1 className="mt-4 text-3xl font-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
						Sign in to view your profile
					</h1>
					<p className="mt-4 text-white/60 leading-7">
						Your profile shows your name, user ID, streak, and consistency stats.
					</p>
					<Link
						href="/login"
						className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black"
					>
						Go to login
						<ArrowRight size={14} />
					</Link>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen overflow-x-hidden bg-[#07070a] text-white px-6 py-28">
			<div className="absolute inset-0 -z-10 opacity-60" style={{
				backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
				backgroundSize: "28px 28px",
			}} />
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.16),transparent_28%)]" />

			<section className="mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="max-w-3xl"
				>
					<div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-4 py-2 text-[11px] font-semibold tracking-[0.22em] text-white/60 uppercase">
						<ShieldCheck size={12} />
						User Profile
					</div>
					<h1 className="mt-6 text-[clamp(2.8rem,7vw,5.4rem)] font-black leading-[0.92] tracking-[-0.05em] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
						{derivedName}
					</h1>
					<p className="mt-5 max-w-2xl text-base leading-8 text-white/55">
						Track your interview rhythm, review your consistency, and keep your practice visible in one place.
					</p>
				</motion.div>

				<div className="mt-10 grid gap-5 md:grid-cols-3">
					<motion.div className="rounded-3xl border border-white/8 bg-white/3 p-6" whileHover={{ y: -4 }}>
						<div className="flex items-center gap-2 text-white/45 text-xs uppercase tracking-[0.2em]"><IdCard size={13} /> User ID</div>
						<p className="mt-4 break-all text-sm text-white/80">{user?.id || "N/A"}</p>
					</motion.div>

					<motion.div className="rounded-3xl border border-white/8 bg-white/3 p-6" whileHover={{ y: -4 }}>
						<div className="flex items-center gap-2 text-white/45 text-xs uppercase tracking-[0.2em]"><Flame size={13} /> Streak</div>
						<p className="mt-4 text-4xl font-black">{loadingHistory ? "--" : stats.streak}</p>
						<p className="mt-2 text-sm text-white/55">consecutive active days</p>
					</motion.div>

					<motion.div className="rounded-3xl border border-white/8 bg-white/3 p-6" whileHover={{ y: -4 }}>
						<div className="flex items-center gap-2 text-white/45 text-xs uppercase tracking-[0.2em]"><CalendarDays size={13} /> Consistency</div>
						<p className="mt-4 text-4xl font-black">{loadingHistory ? "--" : `${stats.consistency}%`}</p>
						<p className="mt-2 text-sm text-white/55">active days in the last 30</p>
					</motion.div>
				</div>

				<div className="mt-5 grid gap-5 md:grid-cols-2">
					<motion.div className="rounded-3xl border border-white/8 bg-white/3 p-6" whileHover={{ y: -4 }}>
						<div className="flex items-center gap-2 text-white/45 text-xs uppercase tracking-[0.2em]"><Mail size={13} /> Email</div>
						<p className="mt-4 text-sm text-white/80">{user?.email || "N/A"}</p>
					</motion.div>

					<motion.div className="rounded-3xl border border-white/8 bg-white/3 p-6" whileHover={{ y: -4 }}>
						<div className="flex items-center gap-2 text-white/45 text-xs uppercase tracking-[0.2em]"><Sparkles size={13} /> Practice Sessions</div>
						<p className="mt-4 text-4xl font-black">{loadingHistory ? "--" : stats.sessions}</p>
						<p className="mt-2 text-sm text-white/55">total interview sessions recorded</p>
					</motion.div>
				</div>

				<div className="mt-10 rounded-3xl border border-white/8 bg-white/3 p-6">
					<div className="flex items-center justify-between gap-4">
						<div>
							<p className="text-xs uppercase tracking-[0.22em] text-white/35">Recent activity</p>
							<h2 className="mt-2 text-xl font-bold">Latest interviews</h2>
						</div>
						<Link href="/practice" className="text-sm text-cyan-200 hover:text-white transition inline-flex items-center gap-1.5">
							Go to practice <ArrowRight size={14} />
						</Link>
					</div>

					<div className="mt-5 grid gap-3">
						{loadingHistory ? (
							<p className="text-sm text-white/50">Loading history...</p>
						) : recentInterviews.length > 0 ? (
							recentInterviews.map((item) => (
								<div key={item.id} className="rounded-2xl border border-white/6 bg-black/15 px-4 py-4">
									<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
										<div>
											<p className="font-semibold text-white">{item.role || "Interview"}</p>
											<p className="text-sm text-white/50">{item.level || "beginner"} · {item.status || "active"}</p>
										</div>
										<p className="text-xs uppercase tracking-[0.2em] text-white/35">
											{item.created_at ? new Date(item.created_at).toLocaleDateString() : "Unknown date"}
										</p>
									</div>
								</div>
							))
						) : (
							<p className="text-sm text-white/50">No interview sessions yet. Start a practice round to build your streak.</p>
						)}
					</div>
				</div>
			</section>
		</main>
	);
}
