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
  isNew: boolean
  score: number
  views?: number
}

export interface ChartDetail {
  isNew: boolean,
  bestPosition: number,
  currentPosition: number
  weeksInChart: number
  lastWeek: number
  id: string
  title: string
  artist: string
  uploadDate: Date
  picture: string
  voiceBank: string
  score: number
  views?: number
}

export interface Rank {
  rankProgress: "NEW" | number | string
  highestRank: number
}

export interface UpdateVideo {
  id: string
  title: string
  artist: string
  voiceBank: string
}