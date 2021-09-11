import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { week } = req.query

    try {
      const weekPerformance = await prisma.weekPerformance.findMany({
        where: {
          week: parseInt(week as string)
        },
        include: {
          performance: true
        }
      })

      const array = []

      for (let i = 0; i < weekPerformance.length; i++) {
        const element = weekPerformance[i]

        const res = await prisma.performance.findFirst({
          where: { id: element.performanceId },
          include: { video: true, weekPerformances: true }
        })

        array.push(res)
      }

      res.status(200).json({ data: array })
    } catch (error) {
      console.log({ error })
      return res.status(500).json({ error: "internal server error" })
    }
  } else {
    res.status(405).end()
  }
}
