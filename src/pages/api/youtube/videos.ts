import { NextApiRequest, NextApiResponse } from "next"
import { YoutubeResponseRaw } from "../../../types/youtube-raw"
import YoutubeRepo from "../../../lib/repo/youtube.repo"

const youtube = new YoutubeRepo()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const body = req.body

      const response = await youtube.getVideoInfo(body)

      if (response.statusCode === 200) {
        const data = response.body as YoutubeResponseRaw

        res.status(200).json(data.items)
      } else {
        res.status(204).json({ message: "No Data", data: {} })
      }
    } catch (error) {
      console.log({ error })
      return res.status(500).json({ error: "internal server error" })
    }
  } else {
    res.status(405).end()
  }
}
