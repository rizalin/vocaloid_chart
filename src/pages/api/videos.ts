import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const response = await prisma.video.findMany({ where: { show: true } })
      res.status(200).json(response)
    } catch (error) {
      console.log({ error })
      return res.status(500).json({ error: "internal server error" })
    }
  } else {
    res.status(405).end()
  }
}
