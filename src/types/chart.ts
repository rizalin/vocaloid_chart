import { Video } from "@prisma/client"

export interface CustomStatistic {
  id: string
  artist: string
  title: string
  originalTitle: string
  uploadDate: Date
  videoYoutubeId: string
  picture: string
  voiceBank: string
  videoId: string
  views: number
  likes: number
  comment: number
  week: number
}

export interface RawChart {
  id: string
  isNew: boolean
  channelName: string
  uploadDate: Date
  videoTitle: string
  thumbnail: string
  score: number
  likeModifier: number
  viewModifier: number
  likePoints: number
  viewPoints: number
  viewCount: number
  likeCount: number
  commentCount: number
}

export interface Score {
  score: number
  viewModifier: number
  likeModifier: number
  viewPoints: number
  likePoints: number
}

export interface Chart extends Video {
  isNew: boolean
  score: number
  views?: number
}

export interface UpdateVideo {
  id: string
  title: string
  artist: string
  voiceBank: string
}

export interface ChartRequestBody {
  data: Chart
  month: string
  week: number
  position: number
  isKafu?: boolean
}

export interface ChartDetail {
  isNew: boolean
  bestPosition: number
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
