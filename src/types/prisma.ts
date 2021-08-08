import { YoutubeLinkType } from "@prisma/client"
import { Chart, RawChart } from "./ui"

export interface UserRequestBody {
  artistType: string
  defaultName: string
  createdDate: Date
  id: number
}

export interface ChannelRequestBody {
  channelType: YoutubeLinkType
  vocaDbDescription: string
  youtubeLink: string
  youtubeId: string
  userId: number
  channelName: string
  createdAt: Date
}

export interface ChartRequestBody {
  data: Chart
  month: string
  week: number
  position: number
  isKafu?: boolean
}
