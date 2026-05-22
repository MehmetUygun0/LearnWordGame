namespace Backend.Models.DTOs
{
    public class AnalysisMetricDto
    {
        public required string Label { get; set; }
        public double Percentage { get; set; }
        public int Value { get; set; }
        public int Total { get; set; }
        public string? Description { get; set; }
    }

    public class AnalysisLevelBreakdownDto
    {
        public required string Level { get; set; }
        public int TotalWords { get; set; }
        public int LearnedWords { get; set; }
        public double LearnedPercentage { get; set; }
        public double AverageKnowledgeScore { get; set; }
    }

    public class AnalysisStageBreakdownDto
    {
        public required string Stage { get; set; }
        public int WordCount { get; set; }
        public double Percentage { get; set; }
    }

    public class AnalysisWordLengthBreakdownDto
    {
        public required string Group { get; set; }
        public int WordCount { get; set; }
        public double AverageKnowledgeScore { get; set; }
    }

    public class AnalysisReviewBucketDto
    {
        public required string Bucket { get; set; }
        public int WordCount { get; set; }
        public double Percentage { get; set; }
    }

    public class AnalysisReportDto
    {
        public DateTime GeneratedAtUtc { get; set; }
        public required string UserName { get; set; }
        public required string CurrentLevel { get; set; }
        public int TotalTrackedWords { get; set; }
        public int LearnedWords { get; set; }
        public int ActiveWords { get; set; }
        public int ReadyForReviewWords { get; set; }
        public int CorrectlyRecalledWords { get; set; }
        public int UserAddedWords { get; set; }
        public double OverallMasteryPercentage { get; set; }
        public double LearnedPercentage { get; set; }
        public double ReviewHealthPercentage { get; set; }
        public double AverageProgressPercentage { get; set; }
        public double EstimatedKnowledgeScore { get; set; }
        public required List<AnalysisMetricDto> SummaryMetrics { get; set; }
        public required List<AnalysisLevelBreakdownDto> LevelBreakdown { get; set; }
        public required List<AnalysisStageBreakdownDto> StageBreakdown { get; set; }
        public required List<AnalysisWordLengthBreakdownDto> WordLengthBreakdown { get; set; }
        public required List<AnalysisReviewBucketDto> ReviewBuckets { get; set; }
        public required List<string> Strengths { get; set; }
        public required List<string> FocusAreas { get; set; }
        public required List<string> Recommendations { get; set; }
        public required string NarrativeSummary { get; set; }
    }
}
