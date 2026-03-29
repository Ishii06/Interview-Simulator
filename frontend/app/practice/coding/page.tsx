"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Problem = {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

type Section = {
  title: string;
  problems: Problem[];
};

const DATA: Section[] = [
  {
    title: "Array / String",
    problems: [
      { name: "Merge Strings Alternately", difficulty: "Easy" },
      { name: "Greatest Common Divisor of Strings", difficulty: "Easy" },
      { name: "Kids With the Greatest Number of Candies", difficulty: "Easy" },
      { name: "Can Place Flowers", difficulty: "Easy" },
      { name: "Reverse Vowels of a String", difficulty: "Easy" },
      { name: "Reverse Words in a String", difficulty: "Medium" },
      { name: "Product of Array Except Self", difficulty: "Medium" },
      { name: "Increasing Triplet Subsequence", difficulty: "Medium" },
      { name: "String Compression", difficulty: "Medium" },
    ],
  },

  {
    title: "Two Pointers",
    problems: [
      { name: "Move Zeroes", difficulty: "Easy" },
      { name: "Is Subsequence", difficulty: "Easy" },
      { name: "Container With Most Water", difficulty: "Medium" },
      { name: "Max Number of K-Sum Pairs", difficulty: "Medium" },
    ],
  },

  {
    title: "Sliding Window",
    problems: [
      { name: "Maximum Average Subarray I", difficulty: "Easy" },
      { name: "Maximum Number of Vowels in a Substring of Given Length", difficulty: "Medium" },
      { name: "Max Consecutive Ones III", difficulty: "Medium" },
      { name: "Longest Subarray of 1's After Deleting One Element", difficulty: "Medium" },
    ],
  },

  {
    title: "Prefix Sum",
    problems: [
      { name: "Find the Highest Altitude", difficulty: "Easy" },
      { name: "Find Pivot Index", difficulty: "Easy" },
    ],
  },

  {
    title: "Hash Map / Set",
    problems: [
      { name: "Find the Difference of Two Arrays", difficulty: "Easy" },
      { name: "Unique Number of Occurrences", difficulty: "Easy" },
      { name: "Determine if Two Strings Are Close", difficulty: "Medium" },
      { name: "Equal Row and Column Pairs", difficulty: "Medium" },
    ],
  },

  {
    title: "Stack",
    problems: [
      { name: "Removing Stars From a String", difficulty: "Medium" },
      { name: "Asteroid Collision", difficulty: "Medium" },
      { name: "Decode String", difficulty: "Medium" },
    ],
  },

  {
    title: "Queue",
    problems: [
      { name: "Number of Recent Calls", difficulty: "Easy" },
      { name: "Dota2 Senate", difficulty: "Medium" },
    ],
  },

  {
    title: "Linked List",
    problems: [
      { name: "Delete the Middle Node of a Linked List", difficulty: "Medium" },
      { name: "Odd Even Linked List", difficulty: "Medium" },
      { name: "Reverse Linked List", difficulty: "Easy" },
      { name: "Maximum Twin Sum of a Linked List", difficulty: "Medium" },
    ],
  },

  {
    title: "Binary Tree - DFS",
    problems: [
      { name: "Maximum Depth of Binary Tree", difficulty: "Easy" },
      { name: "Leaf-Similar Trees", difficulty: "Easy" },
      { name: "Count Good Nodes in Binary Tree", difficulty: "Medium" },
      { name: "Path Sum III", difficulty: "Medium" },
      { name: "Longest ZigZag Path in a Binary Tree", difficulty: "Medium" },
      { name: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium" },
    ],
  },

  {
    title: "Binary Tree - BFS",
    problems: [
      { name: "Binary Tree Right Side View", difficulty: "Medium" },
      { name: "Maximum Level Sum of a Binary Tree", difficulty: "Medium" },
    ],
  },

  {
    title: "Binary Search Tree",
    problems: [
      { name: "Search in a BST", difficulty: "Easy" },
      { name: "Delete Node in a BST", difficulty: "Medium" },
    ],
  },

  {
    title: "Graphs - DFS",
    problems: [
      { name: "Keys and Rooms", difficulty: "Medium" },
      { name: "Number of Provinces", difficulty: "Medium" },
      { name: "Reorder Routes to Make All Paths Lead to the City Zero", difficulty: "Medium" },
      { name: "Evaluate Division", difficulty: "Medium" },
    ],
  },

  {
    title: "Graphs - BFS",
    problems: [
      { name: "Nearest Exit from Entrance in Maze", difficulty: "Medium" },
      { name: "Rotting Oranges", difficulty: "Medium" },
    ],
  },

  {
    title: "Heap / Priority Queue",
    problems: [
      { name: "Kth Largest Element in an Array", difficulty: "Medium" },
      { name: "Smallest Number in Infinite Set", difficulty: "Medium" },
      { name: "Maximum Subsequence Score", difficulty: "Medium" },
      { name: "Total Cost to Hire K Workers", difficulty: "Medium" },
    ],
  },

  {
    title: "Binary Search",
    problems: [
      { name: "Guess Number Higher or Lower", difficulty: "Easy" },
      { name: "Successful Pairs of Spells and Potions", difficulty: "Medium" },
      { name: "Find Peak Element", difficulty: "Medium" },
      { name: "Koko Eating Bananas", difficulty: "Medium" },
    ],
  },

  {
    title: "Backtracking",
    problems: [
      { name: "Letter Combinations of a Phone Number", difficulty: "Medium" },
      { name: "Combination Sum III", difficulty: "Medium" },
    ],
  },

  {
    title: "DP - 1D",
    problems: [
      { name: "N-th Tribonacci Number", difficulty: "Easy" },
      { name: "Min Cost Climbing Stairs", difficulty: "Easy" },
      { name: "House Robber", difficulty: "Medium" },
      { name: "Domino and Tromino Tiling", difficulty: "Medium" },
    ],
  },

  {
    title: "DP - Multidimensional",
    problems: [
      { name: "Unique Paths", difficulty: "Medium" },
      { name: "Longest Common Subsequence", difficulty: "Medium" },
      { name: "Best Time to Buy and Sell Stock with Transaction Fee", difficulty: "Medium" },
      { name: "Edit Distance", difficulty: "Medium" },
    ],
  },

  {
    title: "Bit Manipulation",
    problems: [
      { name: "Counting Bits", difficulty: "Easy" },
      { name: "Single Number", difficulty: "Easy" },
      { name: "Minimum Flips to Make a OR b Equal to c", difficulty: "Medium" },
    ],
  },

  {
    title: "Trie",
    problems: [
      { name: "Implement Trie (Prefix Tree)", difficulty: "Medium" },
      { name: "Search Suggestions System", difficulty: "Medium" },
    ],
  },

  {
    title: "Intervals",
    problems: [
      { name: "Non-overlapping Intervals", difficulty: "Medium" },
      { name: "Minimum Number of Arrows to Burst Balloons", difficulty: "Medium" },
    ],
  },

  {
    title: "Monotonic Stack",
    problems: [
      { name: "Daily Temperatures", difficulty: "Medium" },
      { name: "Online Stock Span", difficulty: "Medium" },
    ],
  },
];

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getLeetCodeUrl = (name: string) => `https://leetcode.com/problems/${toSlug(name)}/`;

const totalProblems = DATA.reduce((sum, section) => sum + section.problems.length, 0);

const STORAGE_KEY = "coding-sheet-progress";

const buildProblemId = (sectionTitle: string, problemName: string) => `${sectionTitle}::${problemName}`;

export default function CodingSheetPage() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCompleted(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors and fall back to in-memory state.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      // Ignore storage errors.
    }
  }, [completed]);

  const completedCount = useMemo(
    () => Object.values(completed).filter(Boolean).length,
    [completed]
  );

  const leftCount = totalProblems - completedCount;
  const progressPercent = totalProblems > 0 ? (completedCount / totalProblems) * 100 : 0;
  const circleRadius = 54;
  const circleStroke = 8;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleOffset = circleCircumference - (progressPercent / 100) * circleCircumference;

  const toggleProblem = (problemId: string) => {
    setCompleted((previous) => ({
      ...previous,
      [problemId]: !previous[problemId],
    }));
  };

  return (
    <div className="pt-8 min-h-screen bg-[#07070a] text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        <div className="mb-5 rounded-3xl border border-white/10 bg-linear-to-br from-white/6 via-white/3 to-transparent px-6 py-5 shadow-2xl shadow-black/20 text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-indigo-300/80">Coding Practice</p>
          <h1 className="text-2xl font-black md:text-3xl">DSA Cheat Sheet</h1>
          <p className="mx-auto mt-2 max-w-3xl text-sm text-white/65">
            Ace the coding interview with 75 Questions. Mark each problem as done and track your progress on the right.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-3">
            {DATA.map((section) => (
              <section key={section.title} className="rounded-3xl border border-white/10 bg-white/3 p-3.5 md:p-4">
                <div className="mb-2.5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base md:text-lg font-semibold text-white">{section.title}</h2>
                    <p className="mt-0.5 text-[11px] md:text-xs text-white/45">{section.problems.length} problems</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-wide text-white/60">
                    {section.problems.length}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {section.problems.map((problem) => {
                    const problemId = buildProblemId(section.title, problem.name);
                    const isDone = Boolean(completed[problemId]);

                    return (
                      <div
                        key={problem.name}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-indigo-400/30 hover:bg-white/5"
                      >
                        <label className="flex items-center gap-3 cursor-pointer min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => toggleProblem(problemId)}
                            className="h-4 w-4 shrink-0 accent-emerald-500"
                          />
                          <span className={`min-w-0 truncate text-sm leading-snug ${isDone ? "text-white/45 line-through" : "text-white"}`}>
                            {problem.name}
                          </span>
                        </label>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              problem.difficulty === "Easy"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : problem.difficulty === "Medium"
                                ? "bg-amber-500/15 text-amber-300"
                                : "bg-rose-500/15 text-rose-300"
                            }`}
                          >
                            {problem.difficulty}
                          </span>

                          <Link
                            href={getLeetCodeUrl(problem.name)}
                            target="_blank"
                            className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1.5 text-[11px] md:text-xs font-medium text-indigo-300 transition hover:border-indigo-400/50 hover:bg-indigo-500/20"
                          >
                            Solve →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <aside className="lg:sticky lg:top-6 h-fit rounded-3xl border border-white/10 bg-white/3 p-5 md:p-6 shadow-lg shadow-black/20">
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-300/80">Progress</p>
            <h2 className="mt-2 text-xl font-bold">Your Checklist</h2>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-center">
                <div className="relative h-40 w-40">
                  <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r={circleRadius}
                      stroke="rgba(255,255,255,0.10)"
                      strokeWidth={circleStroke}
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r={circleRadius}
                      stroke="url(#progressGradient)"
                      strokeWidth={circleStroke}
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={circleCircumference}
                      strokeDashoffset={circleOffset}
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-3xl font-black text-white">{completedCount}</p>
                    <p className="text-sm text-white/45">/{totalProblems}</p>
                    <p className="mt-1 text-sm text-white/55">Solved</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-3 text-center">
                  <p className="text-white/45">Completed</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-300">{completedCount}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-3 text-center">
                  <p className="text-white/45">Left</p>
                  <p className="mt-1 text-2xl font-bold text-rose-300">{leftCount}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-white/45">Sections</p>
                <p className="mt-1 text-2xl font-bold text-white">{DATA.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-white/45">Problems</p>
                <p className="mt-1 text-2xl font-bold text-white">{totalProblems}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}