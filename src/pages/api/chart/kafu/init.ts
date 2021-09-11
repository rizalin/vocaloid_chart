import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { ChartRequestBody } from "../../../../types/chart"

const prisma = new PrismaClient()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    try {
      const { id } = req.query
      const { position, data, week, month } = req.body as ChartRequestBody

      const video = await prisma.video.findFirst({
        where: { videoYoutubeId: id as string },
        include: { kafu: true }
      })

      const performance = video.kafu

      if (performance) {
        const update = prisma.kAFUPerformance.updateMany({
          where: { videoId: { equals: video.id as string } },
          data: {
            bestPosition: performance.bestPosition < position ? performance.bestPosition : position,
            weeksInChart: performance.weeksInChart ? performance.weeksInChart + 1 : 1
          }
        })

        const weekPerformance = prisma.kAFUWeekPerformance.create({
          data: {
            performanceId: performance.id as string,
            week,
            score: data.score,
            month: month as string,
            position
          }
        })

        await Promise.all([update, weekPerformance])
      } else {
        const performanceId = await prisma.kAFUPerformance.create({
          data: {
            bestPosition: position,
            weeksInChart: 1,
            videoId: video.id,
            deletedAt: new Date()
          }
        })

        await prisma.kAFUWeekPerformance.create({
          data: {
            performanceId: performanceId.id,
            week,
            score: data.score,
            month: month as string,
            position
          }
        })
      }

      res.status(200).json({ data: video })
    } catch (error) {
      console.log({ error })
      return res.status(500).json({ error: "internal server error" })
    }
  } else {
    res.status(405).end()
  }
}
