export const templates = [
  {
    topic: "Time and Work",
    difficulty: "medium",
    generate: () => {
      const a = 10;
      const b = 15;
      return {
        question: `A can complete a task in ${a} days and B in ${b} days. How long together?`,
        answer: (a * b) / (a + b)
      };
    }
  }
];
