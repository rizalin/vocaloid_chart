import { NextApiRequest, NextApiResponse } from "next"
import YoutubeHelper from "../../../lib/api/raw/youtube"

const youtube = new YoutubeHelper()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { youtubeId } = req.body

      const response = await youtube.getVideosFromChannel(youtubeId as string)

      if (response.statusCode === 200) {
        const data = response.body

        res.status(200).json(data)
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
