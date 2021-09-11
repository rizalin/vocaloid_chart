import { PrismaClient, Statistic } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { OldStatistic } from "../../../../../types/response"

const prisma = new PrismaClient()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const body = req.body as OldStatistic
      const { week } = req.query

      const statistic = await prisma.statistic.findFirst({ where: { videoId: body.videoId } })

      if (statistic) {
        await prisma.weekStatistic.create({
          data: {
            week: parseInt(week as string),
            comments: body.comments,
            views: body.views,
            likes: body.likes,
            statisticId: statistic.id,
            createdAt: new Date(body.createdAt)
          }
        })
      }

      res.status(200).json({ message: "Success" })
    } catch (error) {
      console.log({ error })
      return res.status(500).json({ error: "internal server error" })
    }
  } else {
    res.status(405).end()
  }
}
