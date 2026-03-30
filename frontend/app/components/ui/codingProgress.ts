"use client";

import { useEffect, useMemo, useState } from "react";

export type Problem = {
	name: string;
	difficulty: "Easy" | "Medium" | "Hard";
};

export type Section = {
	title: string;
	problems: Problem[];
};

export const CODING_PROGRESS_STORAGE_KEY = "coding-sheet-progress";

export const CODING_PROGRESS_EVENT = "coding-sheet-progress-updated";

export const CODING_PROGRESS_DATA: Section[] = [
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

export const TOTAL_CODING_PROBLEMS = CODING_PROGRESS_DATA.reduce(
	(sum, section) => sum + section.problems.length,
	0
);

const buildProblemId = (sectionTitle: string, problemName: string) => `${sectionTitle}::${problemName}`;

const readStoredProgress = () => {
	if (typeof window === "undefined") {
		return {} as Record<string, boolean>;
	}

	try {
		const saved = window.localStorage.getItem(CODING_PROGRESS_STORAGE_KEY);
		if (!saved) {
			return {} as Record<string, boolean>;
		}

		return JSON.parse(saved) as Record<string, boolean>;
	} catch {
		return {} as Record<string, boolean>;
	}
};

const writeStoredProgress = (progress: Record<string, boolean>) => {
	try {
		window.localStorage.setItem(CODING_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
		window.dispatchEvent(new Event(CODING_PROGRESS_EVENT));
	} catch {
		// Ignore storage errors.
	}
};

export const getProblemId = buildProblemId;

export const useCodingProgress = () => {
	const [completed, setCompleted] = useState<Record<string, boolean>>({});

	useEffect(() => {
		setCompleted(readStoredProgress());
	}, []);

	useEffect(() => {
		const syncFromStorage = () => {
			setCompleted(readStoredProgress());
		};

		window.addEventListener("storage", syncFromStorage);
		window.addEventListener(CODING_PROGRESS_EVENT, syncFromStorage);

		return () => {
			window.removeEventListener("storage", syncFromStorage);
			window.removeEventListener(CODING_PROGRESS_EVENT, syncFromStorage);
		};
	}, []);

	const completedCount = useMemo(
		() => Object.values(completed).filter(Boolean).length,
		[completed]
	);

	const leftCount = TOTAL_CODING_PROBLEMS - completedCount;
	const progressPercent = TOTAL_CODING_PROBLEMS > 0 ? (completedCount / TOTAL_CODING_PROBLEMS) * 100 : 0;

	const toggleProblem = (problemId: string) => {
		setCompleted((previous) => {
			const next = {
				...previous,
				[problemId]: !previous[problemId],
			};

			writeStoredProgress(next);
			return next;
		});
	};

	return {
		completed,
		completedCount,
		leftCount,
		progressPercent,
		toggleProblem,
	};
};