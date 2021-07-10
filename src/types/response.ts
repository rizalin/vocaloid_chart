import { YoutubeChannel } from "@prisma/client"

export interface YoutubeUploadPlaylist {
  uploadPlaylistId: string
  channelInfo: YoutubeChannel
}
