import { PrismaClient, WeekStatistic } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const body = req.body as WeekStatistic

      await prisma.weekStatistic.createMany({ data: body })

      res.status(200).json({ error: "Success" })
    } catch (error) {
      console.log({ error })
      return res.status(500).json({ error: "internal server error" })
    }
  } else {
    res.status(405).end()
  }
}
