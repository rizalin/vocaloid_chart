import { Statistic, Video, YoutubeChannel } from "@prisma/client"

import { fetcher } from "../helper/async"
import Result from "../class/Result"

export default class CommonService {
  async getChannels(): Promise<YoutubeChannel[]> {
    try {
      const res = await fetcher("/api/channels")

      if (res.ok) {
        return res.data.data
      } else {
        return []
      }
    } catch (error) {
      console.log(error)
      return []
    }
  }

  async getVideos(): Promise<Video[]> {
    try {
      const res = await fetcher("/api/videos")

      if (res.ok) {
        return res.data
      } else {
        return []
      }
    } catch (error) {
      return []
    }
  }

  async getStatistics(): Promise<Statistic[]> {
    try {
      const res = await fetcher("/api/statistics")

      if (res.ok) {
        return res.data.data
      } else {
        return []
      }
    } catch (error) {
      return []
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
