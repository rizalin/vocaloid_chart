import { YoutubeChannel } from "@prisma/client"

export interface YoutubeUploadPlaylist {
  uploadPlaylistId: string
  channelInfo: YoutubeChannel
}

export interface OldStatistic {
  id: string
  videoId: string
  createdAt: string
  deletedAt: string
  comments: number
  likes: number
  views: number
  week: number
}
