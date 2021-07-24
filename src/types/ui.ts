import { Video } from "@prisma/client"

export interface RawChart {
  id: string
  isNew: boolean
  channelName: string
  publishedAt: string
  videoTitle: string
  thumbnail: string
  score: number
  views?: number
  lastWeek?: number
  bestPosition?: number
  weeksInChart?: number
}

export interface RawChartId {
  id: string
  views: number
  title: string
  lastWeek?: number
  isNew?: true
}

export interface Chart extends Video {
  lastWeek: number
  bestPosition: number
  weeksInChart: number
  isNew: boolean
  score: number
  views?: number
}

export interface Rank {
  rankProgress: "NEW" | number | string
  highestRank: number
}
