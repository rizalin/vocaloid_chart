import { YoutubeChannel } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { YoutubeUploadPlaylist } from "../../../types/response"
import { YoutubeChannelRaw, YoutubeResponseRaw } from "../../../types/youtube-raw"
import YoutubeRepo from "../../../lib/repo/youtube.repo"

const youtube = new YoutubeRepo()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const body = req.body

      const channels = body.channels as YoutubeChannel[]
      const playlistIds: YoutubeUploadPlaylist[] = []

      const response = await youtube.getChannelContentDetail(channels)

      if (response.statusCode !== 200) {
        return res.status(500).json({ error: "internal server error" })
      } else {
        const body = response.body as YoutubeResponseRaw
        const items = body.items as YoutubeChannelRaw[]

        for (let index = 0; index < items.length; index++) {
          const element = items[index]

          const info = channels.find((item) => item.youtubeId === element.id)
          playlistIds.push({
            uploadPlaylistId: element.contentDetails.relatedPlaylists.uploads,
            channelInfo: info
          })
        }
      }

      res.status(200).json(playlistIds)
    } catch (error) {
      console.log({ error: error?.response?.body ?? error })
      return res.status(500).json({ error: "internal server error" })
    }
  } else {
    res.status(405).end()
  }
}
