import {
  Performance,
  Statistic,
  Video,
  WeekPerformance,
  YoutubeChannel,
  KAFUPerformance,
  KAFUWeekPerformance
} from "@prisma/client"
import { ChartRequestBody, UserRequestBody } from "../../types/prisma"
import { fetcher } from "../helper/async"
import Result from "../helper/Result"
import { ChartDetail, UpdateVideo } from "../../types/ui"
import dayjs from "dayjs"

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

  async ignoreVideo(id: string) {
    try {
      const res = await fetcher(`/api/video/ignore`, { method: "put", body: { id } })

      if (res.ok) {
        return Result.ok()
      } else {
        return Result.fail()
      }
    } catch (error) {
      return Result.fail()
    }
  }

  async updateVideo(body: UpdateVideo) {
    try {
      const res = await fetcher(`/api/video`, { method: "put", body })

      if (res.ok) {
        return Result.ok()
      } else {
        return Result.fail()
      }
    } catch (error) {
      return Result.fail()
    }
  }

  async initChart(id: string, body: ChartRequestBody) {
    try {
      const res = await fetcher(`/api/init/chart?id=${id}`, { method: "put", body })

      if (res.ok) {
        return Result.ok<Video>(res.data.data)
      } else {
        return Result.fail<Video>()
      }
    } catch (error) {
      return Result.fail<Video>()
    }
  }

  async getCurrentChart(week: number) {
    try {
      const res = await fetcher(`/api/chart/current?week=${week}`)

      if (res.ok) {
        const performance = res.data.data as Performance[]
        console.log({ performance })

        const charts: ChartDetail[] = []

        for (let i = 0; i < performance.length; i++) {
          const element = performance[i]
          // @ts-ignore
          const weekPerformances = element.weekPerformances as WeekPerformance[]
          const currentPerformance = weekPerformances[weekPerformances.length - 1]
          const lastWeekPerformance = weekPerformances.find((item) => item.week === week - 1)
          // @ts-ignore
          const video = element.video as Video

          const now = dayjs(new Date())
          const uploadMoment = dayjs(video.uploadDate)

          charts.push({
            id: video.videoYoutubeId,
            artist: video.customArtist,
            isNew: !(now.diff(uploadMoment, "days") > 7),
            weeksInChart: element.weeksInChart,
            score: currentPerformance.score,
            currentPosition: currentPerformance.position,
            lastWeek: lastWeekPerformance ? lastWeekPerformance.position : 0,
            bestPosition: element.bestPosition,
            picture: video.picture,
            title: video.title,
            uploadDate: video.uploadDate,
            voiceBank: video.voiceBank
          })
        }

        return Result.ok<ChartDetail[]>(charts)
      } else {
        return Result.fail<ChartDetail[]>()
      }
    } catch (e) {
      console.log(e)
      return Result.fail<ChartDetail[]>()
    }
  }

  async getKafuVideo() {
    try {
      const res = await fetcher(`/api/kafu`)

      if (res.ok) {
        return Result.ok<Video[]>(res.data.data)
      } else {
        return Result.fail<Video[]>()
      }
    } catch (error) {
      return Result.fail<Video[]>()
    }
  }

  async initKafuChart(id: string, body: ChartRequestBody) {
    try {
      const res = await fetcher(`/api/kafu/init?id=${id}`, { method: "put", body })

      if (res.ok) {
        return Result.ok<Video>(res.data.data)
      } else {
        return Result.fail<Video>()
      }
    } catch (error) {
      return Result.fail<Video>()
    }
  }

  async getKafuCurrentChart(week: number) {
    try {
      const res = await fetcher(`/api/kafu/chart?week=${week}`)

      if (res.ok) {
        const performance = res.data.data as KAFUPerformance[]
        console.log({ performance })

        const charts: ChartDetail[] = []

        for (let i = 0; i < performance.length; i++) {
          const element = performance[i]
          // @ts-ignore
          const weekPerformances = element.weekPerformances as KAFUWeekPerformance[]
          const currentPerformance = weekPerformances[weekPerformances.length - 1]
          const lastWeekPerformance = weekPerformances.find((item) => item.week === week - 1)
          // @ts-ignore
          const video = element.video as Video

          const now = dayjs(new Date())
          const uploadMoment = dayjs(video.uploadDate)

          charts.push({
            id: video.videoYoutubeId,
            artist: video.customArtist,
            isNew: !(now.diff(uploadMoment, "days") > 7),
            weeksInChart: element.weeksInChart,
            score: currentPerformance.score,
            currentPosition: currentPerformance.position,
            lastWeek: lastWeekPerformance ? lastWeekPerformance.position : 0,
            bestPosition: element.bestPosition,
            picture: video.picture,
            title: video.title,
            uploadDate: video.uploadDate,
            voiceBank: video.voiceBank
          })
        }

        return Result.ok<ChartDetail[]>(charts)
      } else {
        return Result.fail<ChartDetail[]>()
      }
    } catch (e) {
      console.log(e)
      return Result.fail<ChartDetail[]>()
    }
  }
}
