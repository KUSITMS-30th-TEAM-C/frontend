export interface CalendarResponse {
  summary: {
    registrationDate: string
    totalSavedTime: number
    monthlyActivityCount: number
  }
  monthlyActivities: Activity[]
}

export interface Activity {
  category: Category
  title: string
  savedTime: number
  activityCreatedAt: string
}

export interface KeywordsResponse {
  joinedYear: number
  joinedMonth: string
  monthlySavedTimeAndActivityCount: KeywordsTotal
  activitiesByKeywordSummary: KeywordsPerSummary[]
}

export interface KeywordsTotal {
  monthlyTotalSavedTime: number
  monthlyTotalActivityCount: number
}

export interface KeywordsPerSummary {
  keyword: KeywordData
  activityCount: number
}

export interface KeywordData {
  category: string
  image: string
}

export type Category =
  | 'SELF_DEVELOPMENT'
  | 'HEALTH'
  | 'NATURE'
  | 'CULTURE_ART'
  | 'ENTERTAINMENT'
  | 'RELAXATION'
  | 'SOCIAL'

export const categoryLabels: Record<string, string> = {
  SELF_DEVELOPMENT: '자기개발',
  HEALTH: '건강',
  NATURE: '자연',
  CULTURE_ART: '문화/예술',
  ENTERTAINMENT: '엔터테인먼트',
  RELAXATION: '휴식',
  SOCIAL: '소셜',
}

export interface KeywordActivityData {
  title: string
  savedTime: number
  dateOfActivity: string
}

export interface KeyWordData {
  category: Category
  image: string
}

export interface keywordMontDataResponse {
  totalSavedTimeByKeywordInMonth: number
  totalActivityCountByKeywordInMonth: number
  activities: KeywordActivityData[]
  Keyword: KeyWordData
}
