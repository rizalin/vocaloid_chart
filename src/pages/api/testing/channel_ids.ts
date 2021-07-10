import { YoutubeLinkType } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { CHANNEL_IDS } from "../../../../database/channel_ids"
import { notIncluded } from "../../../../database/not_included"
import YoutubeHelper from "../../../lib/api/raw/youtube"
import { sleep } from "../../../lib/helper/async"
import { chunk } from "../../../lib/helper/lodash-alt"
import { YoutubeChannelRaw, YoutubeResponseRaw } from "../../../types/youtube-raw"

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  const youtube = new YoutubeHelper()
  if (req.method === "GET") {
    try {
      const chunked = chunk(notIncluded, 50)
      // const chunked = notIncluded.slice(0, 50)
      // const chunked2 = notIncluded.slice(50, 100)
      // const chunked3 = notIncluded.slice(150, 200)

      // let index = 0
      const array = []
      const noData = []

      console.log(chunked.length)

      // while (index < chunked.length) {
      //   console.log(chunked[index])
      //   const response = await youtube.getChannelList(chunked[index])
      //   console.log(index)
      //   console.log(response)

      //   const raw = response.body as YoutubeResponseRaw

      //   const rawInfos = raw.items as YoutubeChannelRaw[]

      //   let index2 = 0

      //   while (index2 < rawInfos.length) {
      //     // if (parseInt(rawInfos[index].statistics.viewCount) > 100000) {
      //     const vocaDb = chunked[index].find((item) => item.youtubeId === rawInfos[index2].id)

      //     array.push({
      //       channelType: YoutubeLinkType.ORIGINAL_ID,
      //       vocaDbDescription: vocaDb.vocaDbDescription,
      //       youtubeLink: vocaDb.youtubeLink,
      //       youtubeId: rawInfos[index].id,
      //       userId: vocaDb.userId,
      //       channelName: rawInfos[index].snippet.title,
      //       createdAt: rawInfos[index].snippet.publishedAt,
      //       viewCount: parseInt(rawInfos[index].statistics.viewCount)
      //     })
      //     // }

      //     index2++
      //   }

      //   index++
      // }
      const resAll = chunked.map((item) => {
        return youtube.getChannelList(item)
      })
      // const resAll = [chunked, chunked2, chunked3].map((item) => {
      //   return youtube.getChannelList(item)
      // })

      // const response = await youtube.getChannelList(chunked[10])
      // console.log(response.body)

      const promiseAll = await Promise.all(resAll)

      for (let index = 0; index < promiseAll.length; index++) {
        const element = promiseAll[index] as any
        console.log(index)
        const raw = element.body as YoutubeResponseRaw

        const rawInfos = raw.items as YoutubeChannelRaw[]

        let index2 = 0

        while (index2 < rawInfos.length) {
          if (
            parseInt(rawInfos[index2].statistics.viewCount) < 100000 &&
            parseInt(rawInfos[index2].statistics.viewCount) > 10000
          ) {
            const vocaDb = chunked[index].find((item) => item.youtubeId === rawInfos[index2].id)
            if (!vocaDb) {
              noData.push({
                channelType: YoutubeLinkType.ORIGINAL_ID,
                youtubeId: rawInfos[index2].id,
                channelName: rawInfos[index2].snippet.title,
                createdAt: rawInfos[index2].snippet.publishedAt,
                viewCount: parseInt(rawInfos[index2].statistics.viewCount)
              })
            } else {
              array.push({
                channelType: YoutubeLinkType.ORIGINAL_ID,
                vocaDbDescription: vocaDb.vocaDbDescription,
                youtubeLink: vocaDb.youtubeLink,
                youtubeId: rawInfos[index2].id,
                userId: vocaDb.userId,
                channelName: rawInfos[index2].snippet.title,
                createdAt: rawInfos[index2].snippet.publishedAt,
                viewCount: parseInt(rawInfos[index2].statistics.viewCount)
              })
            }
          }
          index2++
        }
      }

      // res.status(200).json({ data: array, noData })
      res.status(200).json(array)
    } catch (error) {
      console.log({ error: error })
      return res.status(500).json({ error: "internal server error" })
    }
  } else {
    res.status(405).end()
  }
}
