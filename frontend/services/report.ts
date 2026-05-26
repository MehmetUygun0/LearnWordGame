import config from '@/lib/config';
import { apiRequest, readResponsePayload } from '@/lib/api';
import { AuthUser } from '@/services/auth';
import { getWords } from '@/services/words';

export type ReportSummary = {
  userName: string;
  level: string;
  generatedAt?: string;
  totalLearnedWords: number;
  totalTrackedWords?: number;
  activeWords?: number;
  userAddedWords?: number;
  dailyNewWords: number;
  correctRate: number;
  reviewDueCount: number;
  progressPercent: number;
  narrativeSummary?: string;
  strengths?: string[];
  focusAreas?: string[];
  recommendations?: string[];
  createdAt?: string;
  levelStats: {
    level: string;
    words: number;
    totalWords?: number;
    learnedPercentage?: number;
    averageKnowledgeScore?: number;
  }[];
  stageStats: {
    stage: number;
    label: string;
    words: number;
    percentage?: number;
  }[];
  topicStats: {
    topic: string;
    words: number;
    learnedWords: number;
    successRate: number;
  }[];
  weeklyTrend: {
    day: string;
    correctRate: number;
  }[];
  difficultWords: {
    id: number;
    word: string;
    wrongCount: number;
    stage: number;
  }[];
  source: 'api' | 'profile';
};

export const getReportSummary = async (
  user: AuthUser | null,
  token?: string | null
): Promise<ReportSummary> => {
  if (token && token !== 'demo-session') {
    const response = await apiRequest({
      endpoint: config.ENDPOINTS.REPORT.SUMMARY,
      method: 'GET',
      token,
    });
    const payload = await readResponsePayload(response);

    if (response.ok && payload && typeof payload === 'object') {
      const words = await getWords(token);
      return {
        ...normalizeApiReport(payload, user),
        topicStats: buildTopicStats(words),
      };
    }
  }

  const words = await getWords(token);
  const totalLearnedWords = user?.totalLearnedWords ?? words.filter((word) => (word.stage ?? 0) >= 6).length;
  const dailyNewWords = user?.dailyNewWords ?? 10;
  const levelStats =
    user?.levelBasedLearnedWords?.length
      ? user.levelBasedLearnedWords
      : ['A1', 'A2', 'B1', 'B2', 'C1'].map((level) => ({
          level,
          words: words.filter((word) => word.level === level).length,
        }));
  const levelTotal = Math.max(levelStats.reduce((total, item) => total + item.words, 0), 1);
  const totalCorrect = words.reduce((total, word) => total + (word.successCount ?? 0), 0);
  const totalWrong = words.reduce((total, word) => total + (word.wrongCount ?? 0), 0);

  return {
    userName: user?.userName ?? '-',
    level: user?.level ?? 'A1',
    totalLearnedWords,
    dailyNewWords,
    correctRate: totalCorrect + totalWrong ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0,
    reviewDueCount: words.filter((word) => word.nextReviewLabel === 'Bugün').length,
    progressPercent: Math.min(Math.round((totalLearnedWords / levelTotal) * 100), 100),
    createdAt: user?.createdAt,
    levelStats,
    stageStats: Array.from({ length: 7 }).map((_, stage) => ({
      stage,
      label: stage === 0 ? 'Yeni' : `${stage}. adım`,
      words: words.filter((word) => (word.stage ?? 0) === stage).length,
    })),
    topicStats: buildTopicStats(words),
    weeklyTrend: [
      { day: 'Pzt', correctRate: 62 },
      { day: 'Sal', correctRate: 70 },
      { day: 'Çar', correctRate: 68 },
      { day: 'Per', correctRate: 76 },
      { day: 'Cum', correctRate: 82 },
      { day: 'Cmt', correctRate: 78 },
      { day: 'Paz', correctRate: 86 },
    ],
    difficultWords: words
      .filter((word) => (word.wrongCount ?? 0) > 0)
      .sort((left, right) => (right.wrongCount ?? 0) - (left.wrongCount ?? 0))
      .slice(0, 4)
      .map((word) => ({
        id: word.id,
        word: word.engWordName,
        wrongCount: word.wrongCount ?? 0,
        stage: word.stage ?? 0,
      })),
    source: 'profile',
  };
};

const normalizeApiReport = (payload: any, user: AuthUser | null): ReportSummary => {
  const levelStats = Array.isArray(payload.levelBreakdown)
    ? payload.levelBreakdown.map((item: any) => ({
        level: String(item.level ?? '-'),
        words: Number(item.learnedWords ?? item.totalWords ?? 0),
        totalWords: Number(item.totalWords ?? item.learnedWords ?? 0),
        learnedPercentage: Math.round(Number(item.learnedPercentage ?? 0)),
        averageKnowledgeScore: Math.round(Number(item.averageKnowledgeScore ?? 0)),
      }))
    : [];

  const stageStats = Array.isArray(payload.stageBreakdown)
    ? payload.stageBreakdown.map((item: any) => ({
        stage: stepToNumber(item.stage),
        label: String(item.stage ?? 'Yeni'),
        words: Number(item.wordCount ?? 0),
        percentage: Math.round(Number(item.percentage ?? 0)),
      }))
    : [];

  return {
    userName: String(payload.userName ?? user?.userName ?? '-'),
    level: String(payload.currentLevel ?? user?.level ?? 'A1'),
    generatedAt: payload.generatedAtUtc ? String(payload.generatedAtUtc) : undefined,
    totalLearnedWords: Number(payload.learnedWords ?? user?.totalLearnedWords ?? 0),
    totalTrackedWords: Number(payload.totalTrackedWords ?? 0),
    activeWords: Number(payload.activeWords ?? 0),
    userAddedWords: Number(payload.userAddedWords ?? 0),
    dailyNewWords: user?.dailyNewWords ?? 10,
    correctRate: Math.round(Number(payload.estimatedKnowledgeScore ?? payload.overallMasteryPercentage ?? 0)),
    reviewDueCount: Number(payload.readyForReviewWords ?? 0),
    progressPercent: Math.round(Number(payload.overallMasteryPercentage ?? payload.learnedPercentage ?? 0)),
    narrativeSummary: payload.narrativeSummary ? String(payload.narrativeSummary) : undefined,
    strengths: toStringList(payload.strengths),
    focusAreas: toStringList(payload.focusAreas),
    recommendations: toStringList(payload.recommendations),
    createdAt: user?.createdAt,
    levelStats: levelStats.length ? levelStats : user?.levelBasedLearnedWords ?? [],
    stageStats: stageStats.length
      ? stageStats
      : Array.from({ length: 7 }).map((_, stage) => ({
          stage,
          label: stage === 0 ? 'Yeni' : `${stage}. adım`,
          words: 0,
        })),
    topicStats: [],
    weeklyTrend: Array.isArray(payload.reviewBuckets)
      ? payload.reviewBuckets.map((item: any) => ({
          day: String(item.bucket ?? '-').slice(0, 12),
          correctRate: Math.round(Number(item.percentage ?? 0)),
        }))
      : [],
    difficultWords: [],
    source: 'api',
  };
};

const topicRules = [
  {
    topic: 'Seyahat ve yönler',
    keywords: ['route', 'journey', 'travel', 'trip', 'road', 'way', 'path', 'map', 'station', 'airport', 'hotel'],
  },
  {
    topic: 'Doğa ve hayvanlar',
    keywords: ['tree', 'forest', 'river', 'mountain', 'sea', 'rain', 'snow', 'tiger', 'bird', 'robin', 'animal', 'flower'],
  },
  {
    topic: 'İnsan ve duygu',
    keywords: ['people', 'person', 'child', 'family', 'friend', 'happy', 'sad', 'fear', 'hope', 'brain', 'mind', 'memory'],
  },
  {
    topic: 'İş ve eğitim',
    keywords: ['work', 'job', 'school', 'learn', 'study', 'plan', 'project', 'office', 'meeting', 'class', 'teacher'],
  },
  {
    topic: 'Soyut kavramlar',
    keywords: ['idea', 'noble', 'resilient', 'articulate', 'success', 'failure', 'change', 'reason', 'truth', 'value'],
  },
  {
    topic: 'Günlük yaşam',
    keywords: ['home', 'food', 'water', 'car', 'phone', 'time', 'day', 'night', 'morning', 'evening', 'shop'],
  },
];

const buildTopicStats = (words: any[]) => {
  const buckets = new Map<string, any>();

  for (const word of words) {
    const topic = detectTopic(word);
    const current = buckets.get(topic) ?? {
      topic,
      words: 0,
      learnedWords: 0,
      totalCorrect: 0,
      totalAttempts: 0,
    };

    current.words += 1;
    current.learnedWords += (word.stage ?? 0) >= 6 ? 1 : 0;
    current.totalCorrect += word.successCount ?? 0;
    current.totalAttempts += (word.successCount ?? 0) + (word.wrongCount ?? 0);
    buckets.set(topic, current);
  }

  return Array.from(buckets.values())
    .map((item) => ({
      topic: item.topic,
      words: item.words,
      learnedWords: item.learnedWords,
      successRate: item.totalAttempts
        ? Math.round((item.totalCorrect / item.totalAttempts) * 100)
        : Math.round((item.learnedWords / Math.max(item.words, 1)) * 100),
    }))
    .sort((left, right) => right.words - left.words || right.successRate - left.successRate);
};

const detectTopic = (word: any) => {
  const haystack = [
    word.engWordName,
    word.turWordName,
    ...(Array.isArray(word.samples) ? word.samples : []),
  ]
    .join(' ')
    .toLocaleLowerCase('en-US');

  const matchedRule = topicRules.find((rule) =>
    rule.keywords.some((keyword) => haystack.includes(keyword))
  );

  return matchedRule?.topic ?? 'Genel kelime havuzu';
};

const toStringList = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item)).filter(Boolean);
};

const stepToNumber = (stage: unknown) => {
  if (typeof stage === 'number') {
    return stage;
  }

  const value = String(stage ?? 'Start');
  if (value === 'Start') {
    return 0;
  }

  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 0;
};
