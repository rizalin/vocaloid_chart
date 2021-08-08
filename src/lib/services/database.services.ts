import { User, Video, Performance, WeekPerformance } from "@prisma/client"
import { VocadbUser } from "../../types/vocadb"
import { YoutubeVideoResponse } from "../../types/youtube-raw"
import { fetcher } from "../helper/async"
import { chunk } from "../helper/lodash-alt"
import Result from "../helper/Result"

export default class DatabaseService {
  async initUser(users: User[]) {
    try {
      const res = await fetcher("/api/database/users", {
        method: "POST",
        body: users
      })

      if (res.ok) {
        return Result.ok(res.data)
      } else {
        return Result.fail()
      }
    } catch (error) {
      return Result.fail()
    }
  }

  async initChannels(channels: any[]) {
    try {
      await fetcher("/api/database/channels", {
        method: "POST",
        body: channels
      })

      return Result.ok()
    } catch (error) {
      return Result.fail()
    }
  }

  async initVideos(videos: Video[]) {
    try {
      await fetcher("/api/database/videos", {
        method: "POST",
        body: videos
      })

      return Result.ok()
    } catch (error) {
      console.log(error)
      return Result.fail()
    }
  }

  async initPerformance(performances: Performance[]) {
    try {
      await fetcher("/api/database/performance", {
        method: "POST",
        body: performances
      })

      return Result.ok()
    } catch (error) {
      console.log(error)
      return Result.fail()
    }
  }

  async initWeekPerformance(weekPerformances: WeekPerformance[]) {
    try {
      await fetcher("/api/database/week-performance", {
        method: "POST",
        body: weekPerformances
      })

      return Result.ok()
    } catch (error) {
      console.log(error)
      return Result.fail()
    }
  }

  async initStatistic(videos: Video[], week: number) {
    try {
      const res = await fetcher("/api/youtube/videos", {
        method: "POST",
        body: videos
      })

      const findId = (id) => {
        const find = videos.find((item) => item.videoYoutubeId === id)

        return find.id
      }

      if (res.ok) {
        const data = res.data as YoutubeVideoResponse[]

        const array = data.map((item) => {
          return {
            videoId: findId(item.id),
            week,
            views: item.statistics.viewCount ? parseInt(item.statistics.viewCount) : 0,
            comments: item.statistics.commentCount ? parseInt(item.statistics.commentCount) : 0,
            likes: item.statistics.likeCount ? parseInt(item.statistics.likeCount) : 0,
            deletedAt: null
          }
        })

        await fetcher("/api/init/statistic", {
          method: "POST",
          body: array
        })

        return Result.ok(array)
      } else {
        return Result.fail()
      }
    } catch (error) {
      return Result.fail()
    }
  }
}
