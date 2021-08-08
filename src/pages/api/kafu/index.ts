import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { UpdateVideo } from "../../../types/ui"

const prisma = new PrismaClient()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const response = await prisma.video.findMany({
          where: { voiceBank: "KAFU" },
          include: { statistic: true, performance: true }
        })
        res.status(200).json({ data: response })
      } catch (error) {
        console.log({ error })
        return res.status(500).json({ error: "internal server error" })
      }
      break

    default:
      res.status(405).end()
      break
  }
}
