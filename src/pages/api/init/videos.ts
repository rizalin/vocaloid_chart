import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { YoutubeUploadPlaylist } from "../../../types/response"
import { YoutubeChannelRaw, YoutubeResponseRaw } from "../../../types/youtube-raw"
import YoutubeRepo from "../../../lib/repo/youtube.repo"

const prisma = new PrismaClient()
const youtube = new YoutubeRepo()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { channelInfo, uploadPlaylistId } = req.body as YoutubeUploadPlaylist

      const array = []
      let isLooping = true
      let nextToken: string

      while (isLooping) {
        const response = await youtube.getPlaylistItems(uploadPlaylistId, nextToken)

        if (response.statusCode !== 200) {
          return res.status(500).json({ error: "internal server error" })
        } else {
          const body = response.body as YoutubeResponseRaw
          const items = body.items as YoutubeChannelRaw[]

          items.map((item) =>
            array.push({
              videoYoutubeId: item.snippet.resourceId.videoId,
              customArtist: item.snippet.channelTitle,
              originalTitle: item.snippet.title,
              uploadDate: item.snippet.publishedAt,
              picture: item.snippet.thumbnails.maxres
                ? item.snippet.thumbnails.maxres.url
                : item.snippet.thumbnails.standard
                ? item.snippet.thumbnails.standard.url
                : item.snippet.thumbnails.high.url,
              channelId: channelInfo.id
            })
          )

          if (body.nextPageToken) {
            nextToken = body.nextPageToken
          } else {
            nextToken = ""
            isLooping = false
          }
        }
      }

      await prisma.video.createMany({ data: array, skipDuplicates: true })

      res.status(200).json({ message: "Success", data: array })
    } catch (error) {
      console.log({ error: error.response })
      return res.status(500).json({ error: "internal server error" })
    }
  } else {
    res.status(405).end()
  }
}
