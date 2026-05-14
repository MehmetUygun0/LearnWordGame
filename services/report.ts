export async function getReportSummary() {
  return {
    learnedCount: 14,
    inProgressCount: 11,
    successRate: 74,
    weeklyTrend: [52, 61, 58, 72, 76, 69, 81],
    stageDistribution: [
      { label: "Stage 0", value: 5 },
      { label: "Stage 1", value: 4 },
      { label: "Stage 2", value: 6 },
      { label: "Stage 3", value: 3 },
      { label: "Stage 4+", value: 7 }
    ],
    difficultWords: ["resilient", "articulate", "journey"]
  };
}
