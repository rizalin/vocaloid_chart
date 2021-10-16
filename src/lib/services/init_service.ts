import { Video } from "@prisma/client"

import { chunk } from "../helper/lodash-alt"
import { fetcher } from "../helper/async"
import Result from "../class/Result"
import CommonService from "./common_service"
import { YoutubeVideoResponse } from "../../types/youtube-raw"

export default class InitService extends CommonService {
  async initChannelVideos() {
    try {
      const channels = await this.getChannels()

      const chunked = chunk(channels, 50)

      let index = 0

      while (index < chunked.length) {
        const element = chunked[index]

        const res = await fetcher("/api/youtube/upload_ids", {
          method: "POST",
          body: { channels: element }
        })

        if (res.ok) {
          const data = res.data

          const res2 = data.map((item) => {
            return fetcher("/api/init/videos", {
              method: "POST",
              body: item
            })
          })

          await Promise.allSettled(res2)
        }

        index++
      }

      return Result.ok()
    } catch (error) {
      return Result.fail()
    }
  }

  async initStatistic() {
    try {
      const data = await this.getVideos()
      const chunked = chunk(data, 50)

      for (const chunkedElement of chunked) {
        const res = await fetcher("/api/youtube/videos", {
          method: "POST",
          body: chunkedElement
        })

        if (res.ok) {
          const statistics = []
          const data = res.data as YoutubeVideoResponse[]

          data.map((value) => {
            const find = chunkedElement.find((value1) => value1.videoYoutubeId === value.id)
            if (parseInt(value.statistics.viewCount) > 5000) {
              statistics.push({
                videoId: find.id,
                deletedAt: null
              })
            }
          })

          await fetcher("/api/init/statistics", { method: "post", body: statistics })
        }
      }
      return Result.ok()
    } catch (error) {
      console.log(error)
      return Result.fail()
    }
  }

  async initWeekStatistic(week: number) {
    try {
      const statistics = await this.getStatistics()

      const videos = statistics.map((item) => {
        // @ts-ignore
        return item.video as Video
      })
      console.log(videos)

      const chunkedVideos = chunk(videos, 50)
      const weekStatistics = []

      for (let i = 0; i < chunkedVideos.length; i++) {
        const v = chunkedVideos[i]

        const res = await fetcher("/api/youtube/videos", {
          method: "POST",
          body: v
        })

        if (res.ok) {
          const data = res.data as YoutubeVideoResponse[]

          data.map((value) => {
            if (parseInt(value.statistics.viewCount) > 5000) {
              const ytStatistics = value.statistics
              const findVideo = v.find((value1) => value1.videoYoutubeId === value.id)
              const findStatistic = statistics.find((value1) => value1.videoId === findVideo.id)

              weekStatistics.push({
                statisticId: findStatistic.id,
                week,
                views: ytStatistics.viewCount ? parseInt(ytStatistics.viewCount) : 0,
                comments: ytStatistics.commentCount ? parseInt(ytStatistics.commentCount) : 0,
                likes: ytStatistics.likeCount ? parseInt(ytStatistics.likeCount) : 0
              })
            }
          })
        }
      }

      const chunkedStatistics = chunk(weekStatistics, 100)
      chunkedStatistics.map(async (value) => {
        await fetcher("/api/init/week_statistic", { method: "post", body: value })
      })

      return Result.ok()
    } catch (error) {
      console.log(error)
      return Result.fail()
    }
  }
}
