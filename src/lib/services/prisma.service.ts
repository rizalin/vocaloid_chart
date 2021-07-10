import { Statistic, Video, YoutubeChannel } from "@prisma/client"
import { UserRequestBody } from "../../types/prisma"
import { fetcher } from "../helper/async"
import Result from "../helper/Result"

export default class PrismaService {
  async createUser(user: UserRequestBody) {
    try {
      const res = await fetcher("/api/init/users", {
        method: "POST",
        body: user
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

  async getChannels() {
    try {
      const res = await fetcher("/api/channels")

      if (res.ok) {
        return Result.ok<YoutubeChannel[]>(res.data.data)
      } else {
        return Result.fail<YoutubeChannel[]>()
      }
    } catch (error) {
      return Result.fail<YoutubeChannel[]>()
    }
  }

  async getUsers() {
    try {
      const res = await fetcher("/api/users")

      if (res.ok) {
        return Result.ok<YoutubeChannel[]>(res.data.data)
      } else {
        return Result.fail<YoutubeChannel[]>()
      }
    } catch (error) {
      return Result.fail<YoutubeChannel[]>()
    }
  }

  async getVideos() {
    try {
      const res = await fetcher("/api/videos")

      if (res.ok) {
        return Result.ok<Video[]>(res.data.data)
      } else {
        return Result.fail<Video[]>()
      }
    } catch (error) {
      return Result.fail<Video[]>()
    }
  }

  async getStatistic() {
    try {
      const res = await fetcher("/api/statistic")

      if (res.ok) {
        return Result.ok<Statistic[]>(res.data.data)
      } else {
        return Result.fail<Statistic[]>()
      }
    } catch (error) {
      return Result.fail<Statistic[]>()
    }
  }

  async getVideo(id: string) {
    try {
      const res = await fetcher(`/api/video?id=${id}`)

      if (res.ok) {
        return Result.ok<Video>(res.data.data)
      } else {
        return Result.fail<Video>()
      }
    } catch (error) {
      return Result.fail<Video>()
    }
  }
}
