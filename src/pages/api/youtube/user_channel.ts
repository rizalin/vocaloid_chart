import { YoutubeLinkType } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { YoutubeChannelRaw, YoutubeResponseRaw } from "../../../types/youtube-raw"
import YoutubeRepo from "../../../lib/repo/youtube.repo"

const youtube = new YoutubeRepo()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { vocaDbDescription, youtubeLink, userId, youtubeId } = req.body

      const responseYT = await youtube.getUserChannel(youtubeId as string)

      if (responseYT.statusCode === 200) {
        const data = responseYT.body as YoutubeResponseRaw

        if (data.pageInfo.totalResults) {
          const channel = data.items[0] as YoutubeChannelRaw

          if (parseInt(channel.statistics.viewCount) > 10000) {
            res.status(201).json({
              message: "Data created",
              data: {
                channelType: YoutubeLinkType.CUSTOM_LINK,
                vocaDbDescription,
                youtubeLink,
                youtubeId: channel.id,
                userId: userId,
                channelName: channel.snippet.title,
                createdAt: channel.snippet.publishedAt
              }
            })
          } else {
            res.status(200).json({ message: "Not eligible", res: channel })
          }
        } else {
          res.status(204).json({ message: "No Data", res: data })
        }
      } else {
        res.status(204).json({ message: "No Data", res: responseYT })
      }
    } catch (error) {
      console.log({ error })
      return res.status(500).json({ error: "internal server error" })
    }
  } else {
    res.status(405).end()
  }
}
