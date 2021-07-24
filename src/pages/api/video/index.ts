import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const { id } = req.query

        const response = await prisma.video.findFirst({
          where: { videoYoutubeId: id as string },
          include: { statistic: true }
        })
        res.status(200).json({ data: response })
      } catch (error) {
        console.log({ error })
        return res.status(500).json({ error: "internal server error" })
      }
      break

    case "PUT":
      try {
        const { id } = req.body

        const response = await prisma.video.update({
          where: { videoYoutubeId: id as string },
          data: {
            show: false
          }
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
