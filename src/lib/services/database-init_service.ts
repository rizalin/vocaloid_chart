import { User, YoutubeChannel, Video, Performance, WeekPerformance } from "@prisma/client"
import Result from "../class/Result"
import { fetcher } from "../helper/async"
import { chunk } from "../helper/lodash-alt"
import { VocaDbYoutubeInfo } from "../../types/vocadb"
import { OldStatistic } from "../../types/response"

export default class DatabaseInitService {
  async initUsers() {
    try {
      const res = await fetcher("http://localhost:9000/users")
      const data = res.data as any[]
      const chunked = chunk(data, 500)

      for (const chunkedElement of chunked) {
        const users: User[] = []

        for (let i = 0; i < chunkedElement.length; i++) {
          const user = chunkedElement[i]

          users.push({
            ...user,
            isActive: user.isActive === 1,
            createdDate: new Date(user.createdDate),
            createdAt: new Date(user.createdAt)
          })
        }

        await fetcher("/api/init/from-file/users", { body: users, method: "POST" })
      }

      return Result.ok<string>("success")
    } catch (error) {
      console.log(error)
      return Result.fail<string>("error")
    }
  }

  async initNewUsers() {
    try {
      const res = await fetcher("http://localhost:9000/new_users")
      const data = res.data as VocaDbYoutubeInfo[][]

      for (const dataElement of data) {
        const users: User[] = []

        for (let i = 0; i < dataElement.length; i++) {
          const user = dataElement[i]

          users.push({
            id: user.artistId,
            isActive: true,
            createdDate: new Date(user.createDate),
            createdAt: new Date(),
            artistType: user.artistType,
            defaultName: user.defaultName,
            name: user.name,
            deletedAt: null,
            picture: user.defaultName
          })
        }

        await fetcher("/api/init/from-file/users", { body: users, method: "POST" })
      }

      return Result.ok<string>("success")
    } catch (error) {
      console.log(error)
      return Result.fail<string>("error")
    }
  }

  async initChannels() {
    try {
      const res = await fetcher("http://localhost:9000/channels")
      const data = res.data as any[]
      const chunked = chunk(data, 500)

      for (const chunkedElement of chunked) {
        const channels: YoutubeChannel[] = []

        for (let i = 0; i < chunkedElement.length; i++) {
          const channel = chunkedElement[i]

          channels.push({
            id: channel.id,
            deletedAt: null,
            createdAt: new Date(channel.createdAt),
            insertAt: new Date(channel.insertAt),
            type: channel.included === 1 ? "INCLUDED" : "NOT_REVIEWED_YET",
            name: channel.name,
            channelName: channel.channelName,
            channelType: channel.channelType,
            userId: channel.userId,
            vocaDbDescription: channel.vocaDbDescription,
            youtubeId: channel.youtubeId,
            youtubeLink: channel.youtubeLink
          })
        }

        await fetcher("/api/init/from-file/channels", { body: channels, method: "POST" })
      }

      return Result.ok<string>("success")
    } catch (error) {
      console.log(error)
      return Result.fail<string>("error")
    }
  }

  async initVideos() {
    try {
      const res = await fetcher("http://localhost:9000/videos")
      const data = res.data as any[]
      const chunked = chunk(data, 500)

      for (const chunkedElement of chunked) {
        const videos: Video[] = []

        for (let i = 0; i < chunkedElement.length; i++) {
          const video = chunkedElement[i]

          videos.push({
            ...video,
            show: video.show === 1,
            uploadDate: new Date(video.uploadDate),
            createdAt: new Date(video.createdAt),
            deletedAt: null
          })
        }

        await fetcher("/api/init/from-file/videos", { body: videos, method: "POST" })
      }

      return Result.ok<string>("success")
    } catch (error) {
      console.log(error)
      return Result.fail<string>("error")
    }
  }

  async initStatistic(week: number) {
    try {
      const res = await fetcher(`http://localhost:9000/statistic/week/${week}`)
      const data = res.data as OldStatistic[]
      const chunked = chunk(data, 500)

      for (const chunkedKey of chunked) {
        await fetcher(`/api/init/from-file/statistics`, {
          body: chunkedKey,
          // body: chunked[0],
          method: "POST"
        })

        const promises = chunkedKey.map((value) => {
          // const promises = chunked[0].map((value) => {
          return fetcher(`/api/init/from-file/statistics/${week}`, {
            body: value,
            method: "POST"
          })
        })

        await Promise.all(promises)
      }

      return Result.ok<string>("success")
    } catch (error) {
      console.log(error)
      return Result.fail<string>("error")
    }
  }

  async initPerformance() {
    try {
      const res = await fetcher("http://localhost:9000/performances")
      const data = res.data as Performance[]
      const chunked = chunk(data, 500)

      for (const chunkedElement of chunked) {
        const performances: Performance[] = []

        for (let i = 0; i < chunkedElement.length; i++) {
          const performance = chunkedElement[i]

          performances.push({
            ...performance,
            createdAt: new Date(performance.createdAt),
            deletedAt: null
          })
        }

        await fetcher("/api/init/from-file/performances", { body: performances, method: "POST" })
      }

      return Result.ok<string>("success")
    } catch (error) {
      console.log(error)
      return Result.fail<string>("error")
    }
  }

  async initWeekPerformances() {
    try {
      const res = await fetcher("http://localhost:9000/week-performances")
      const data = res.data as WeekPerformance[]
      const chunked = chunk(data, 500)

      for (const chunkedElement of chunked) {
        const performances: WeekPerformance[] = []

        for (let i = 0; i < chunkedElement.length; i++) {
          const performance = chunkedElement[i]

          performances.push({
            ...performance
          })
        }

        await fetcher("/api/init/from-file/week_performances", {
          body: performances,
          method: "POST"
        })
      }

      return Result.ok<string>("success")
    } catch (error) {
      console.log(error)
      return Result.fail<string>("error")
    }
  }
}
