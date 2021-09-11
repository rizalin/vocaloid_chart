import { YoutubeLinkType } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { YoutubeChannelRaw, YoutubeResponseRaw } from "../../../types/youtube-raw"
import YoutubeRepo from "../../../lib/repo/youtube.repo"

const youtube = new YoutubeRepo()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const body = req.body as any[]

      const response = await youtube.getChannelList(body)

      if (response.statusCode === 200) {
        const raw = response.body as YoutubeResponseRaw

        const rawInfos = raw.items as YoutubeChannelRaw[]

        let index = 0
        const array = []

        while (index < rawInfos.length) {
          if (parseInt(rawInfos[index].statistics.viewCount) > 10000) {
            const vocaDb = body.find((item) => item.youtubeId === rawInfos[index].id)

            array.push({
              channelType: YoutubeLinkType.ORIGINAL_ID,
              vocaDbDescription: vocaDb.vocaDbDescription,
              youtubeLink: vocaDb.youtubeLink,
              youtubeId: rawInfos[index].id,
              userId: vocaDb.userId,
              channelName: rawInfos[index].snippet.title,
              createdAt: rawInfos[index].snippet.publishedAt
            })
          }

          index++
        }

        res.status(200).json(array)
      } else {
        res.status(400).json({ message: "Bad Request" })
      }
    } catch (error) {
      console.log({ error: error.response.body })
      return res.status(500).json({ error: "internal server error" })
    }
  } else {
    res.status(405).end()
  }
}
