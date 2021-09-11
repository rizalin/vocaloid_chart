import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { UpdateVideo } from "../../../types/chart"

const prisma = new PrismaClient()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const { id } = req.query

        const response = await prisma.video.findFirst({
          where: { videoYoutubeId: id as string },
          include: { statistic: true, performance: true }
        })
        res.status(200).json({ data: response })
      } catch (error) {
        console.log({ error })
        return res.status(500).json({ error: "internal server error" })
      }
      break

    case "PUT":
      try {
        const { id, title, artist, voiceBank } = req.body as UpdateVideo

        const response = await prisma.video.update({
          where: { videoYoutubeId: id as string },
          data: {
            title,
            customArtist: artist,
            voiceBank
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
