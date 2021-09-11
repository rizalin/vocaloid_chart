import { PrismaClient, Statistic } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { OldStatistic } from "../../../../../types/response"

const prisma = new PrismaClient()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const body = req.body as OldStatistic[]

      const statistics: Statistic[] = []

      for (const items of body) {
        if (items.views > 5000) {
          statistics.push({
            id: items.id,
            videoId: items.videoId,
            createdAt: new Date(items.createdAt),
            deletedAt: null
          })
        }
      }

      await prisma.statistic.createMany({ data: statistics, skipDuplicates: true })

      res.status(200).json({ message: "Success" })
    } catch (error) {
      console.log({ error })
      return res.status(500).json({ error: "internal server error" })
    }
  } else {
    res.status(405).end()
  }
}
