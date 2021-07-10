import { YoutubeLinkType } from "@prisma/client"

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
