import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { CustomStatistic } from "../../../types/chart"

const prisma = new PrismaClient()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { week } = req.query

    try {
      const response = await prisma.statistic.findMany({
        include: { video: true, statistics: { where: { week: parseInt(week as string) } } }
      })

      const newResponse: CustomStatistic[] = []

      for (const item of response) {
        if (item.statistics.length) {
          const statistic = item.statistics[0]
          const video = item.video

          newResponse.push({
            id: item.id,
            artist: video.customArtist,
            comment: statistic.comments,
            likes: statistic.likes,
            originalTitle: video.originalTitle,
            picture: video.picture,
            title: video.title,
            uploadDate: video.uploadDate,
            week: statistic.week,
            videoId: video.id,
            views: statistic.views,
            videoYoutubeId: video.videoYoutubeId,
            voiceBank: video.voiceBank
          })
        }
      }

      res.status(200).json({ data: newResponse })
    } catch (error) {
      console.log({ error })
      return res.status(500).json({ error: "internal server error" })
    }
  } else {
    res.status(405).end()
  }
}
