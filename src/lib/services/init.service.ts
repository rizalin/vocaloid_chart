import { Video, YoutubeChannel } from "@prisma/client"
import { VocadbUser } from "../../types/vocadb"
import { YoutubeVideoResponse } from "../../types/youtube-raw"
import { fetcher } from "../helper/async"
import { chunk } from "../helper/lodash-alt"
import Result from "../helper/Result"

export default class InitService {
  async initUser(users: VocadbUser[]) {
    try {
      const res = await fetcher("/api/init/users", {
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

  async initChannelUser(users: any[]) {
    try {
      const res = users.map((item) => {
        return fetcher("/api/youtube/user_channel", {
          method: "POST",
          body: item
        })
      })

      const all = await Promise.allSettled(res)

      const array = []

      for (let index = 0; index < all.length; index++) {
        const element = all[index] as any
        // array.push(element)
        if (element.status === "fulfilled") {
          const value = element.value?.data
          // array.push(value)

          if (value.message === "Data created") {
            array.push(value.data)
          }
        }
      }

      await fetcher("/api/init/channels", {
        method: "POST",
        body: { data: array }
      })

      return Result.ok()
    } catch (error) {
      return Result.fail()
    }
  }

  async initChannelIds(users: any[]) {
    try {
      const res = await fetcher("/api/youtube/channel_id", {
        method: "POST",
        body: users
      })

      if (!res.ok) {
        return Result.fail()
      } else {
        // const res2 = await fetcher("/api/init/channels", {
        //   method: "POST",
        //   body: { data: res.data }
        // })

        // if (res2.ok) {
        return Result.ok(res.data)
        // } else {
        //   return Result.fail()
        // }
      }
    } catch (error) {
      return Result.fail()
    }
  }

  async initChannelVideos(channels: YoutubeChannel[]) {
    try {
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

      if (res.ok) {
        const data = res.data as YoutubeVideoResponse[]

        const array = data.map((item, i) => {
          return {
            videoId: videos[i].id,
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
