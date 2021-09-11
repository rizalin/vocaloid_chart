import got from "got/dist/source"
import { NextApiRequest, NextApiResponse } from "next"

export default async function artist_with_youtube_channels(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const response = await got("https://vocaloid.eu/vocaloid/artists-with-youtube-channels.json")

      if (response.statusCode === 200) {
        const body = JSON.parse(response.body)

        res.status(200).json(body)
      } else {
        res.status(204).json([])
      }
    } catch (error) {
      return res.status(500).json({ error: "internal server error" })
    }
  } else {
    res.status(405).end()
  }
}
