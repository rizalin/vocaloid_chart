import { Video, Performance, KAFUPerformance } from "@prisma/client"
import { fetcher } from "../helper/async"
import {
  ChartDetail,
  ChartRequestBody,
  CustomStatistic,
  RawChart,
  Score,
  UpdateVideo
} from "../../types/chart"
import dayjs from "dayjs"
import Result from "../class/Result"

export default class ChartService {
  private scoreMultiplier(data: CustomStatistic): Score {
    /*
    View * Modifier C + Comment * Modifier A + like * Modifier B
    Limit for like points is view * 5

    Modifier A = (views + like) / (view + comment + mylist) ^10
    Modifier B = (like/views * 100) * 2
    Modifier C = 1.4 - (days elapsed from upload date / 40)
    *if days elapsed is more than 14, modifier C is 1.00

    (View + Mylist) / (View + Comment + Mylist) (rounded to 2 decimal places)
    (Mylist/View*100)*2, max. 40 (rounded to 2 decimal places)
    */

    const { likes, views, comment, uploadDate } = data

    function modifierA() {
      if (!comment) {
        return 0
      }

      const vl = views + likes
      const vcl = views + comment + likes

      return Math.pow(vl / vcl, 10)
    }

    function modifierB(): number {
      const modifier = (likes / views) * 100 * 2

      return parseFloat(modifier.toFixed(2))
    }

    function modifierC() {
      const now = dayjs(new Date())
      const uploadMoment = dayjs(uploadDate)
      const diff = now.diff(uploadMoment, "days")
      const month = now.diff(uploadMoment, "months")

      switch (true) {
        case month < 1 && diff >= 14: {
          return 1.0
        }
        case month < 1 && diff < 1: {
          return 1.4
        }

        case month > 1: {
          const deduction = month * 0.1

          if (deduction > 0.1 && deduction < 1) {
            return 1 - deduction
          } else {
            return 0.1
          }
        }

        default: {
          const modifier = (1.4 - diff / 40).toFixed(2)
          return parseFloat(modifier)
        }
      }
    }

    function likePoints() {
      const points = likes * modifierB()

      if (points > views * 5) {
        return views * 5
      } else {
        return points
      }
    }

    const viewPoints = views * modifierC()

    return {
      score: views ? Math.floor(viewPoints + likePoints()) : 0,
      viewModifier: modifierC(),
      likeModifier: modifierB(),
      viewPoints,
      likePoints: likePoints()
    }
  }

  async chartMaker(week: number) {
    try {
      const lastWeek = await fetcher(`/api/statistics/${week - 1}`)
      const thisWeek = await fetcher(`/api/statistics/${week}`)

      const lastWeekData = lastWeek.data.data as CustomStatistic[]
      const thisWeekData = thisWeek.data.data as CustomStatistic[]

      const chart: RawChart[] = []

      for (const thisWeekElement of thisWeekData) {
        const lastWeekObj = lastWeekData.find((value) => value.videoId === thisWeekElement.videoId)

        if (lastWeekObj) {
          const thisWeekView = thisWeekElement.views - lastWeekObj.views
          const thisWeekLikes = thisWeekElement.likes - lastWeekObj.likes
          const thisWeekComment = thisWeekElement.comment - lastWeekObj.comment

          const { score, likePoints, viewPoints, viewModifier, likeModifier } =
            this.scoreMultiplier({
              ...thisWeekElement,
              views: thisWeekView,
              likes: thisWeekLikes,
              comment: thisWeekComment
            })

          chart.push({
            id: thisWeekElement.videoYoutubeId,
            channelName: thisWeekElement.artist,
            videoTitle: thisWeekElement.title ?? thisWeekElement.originalTitle,
            thumbnail: thisWeekElement.picture,
            uploadDate: thisWeekElement.uploadDate,
            isNew: false,
            viewCount: thisWeekView,
            score,
            commentCount: thisWeekComment ?? 0,
            likeCount: thisWeekLikes ?? 0,
            likePoints,
            viewPoints,
            likeModifier,
            viewModifier
          })
        } else {
          const { likePoints, viewPoints, viewModifier, likeModifier, score } =
            this.scoreMultiplier(thisWeekElement)

          const now = dayjs(new Date())
          const uploadMoment = dayjs(thisWeekElement.uploadDate)

          chart.push({
            id: thisWeekElement.videoYoutubeId,
            channelName: thisWeekElement.artist,
            videoTitle: thisWeekElement.title ?? thisWeekElement.originalTitle,
            uploadDate: thisWeekElement.uploadDate,
            thumbnail: thisWeekElement?.picture,
            isNew: !(now.diff(uploadMoment, "days") > 7),
            score: now.diff(uploadMoment, "days") > 8 ? 0 : score,
            viewCount: thisWeekElement.views,
            likeCount: thisWeekElement.likes ?? 0,
            commentCount: thisWeekElement.comment ?? 0,
            likeModifier,
            viewModifier,
            likePoints,
            viewPoints
          })
        }
      }

      return chart
    } catch (e) {
      console.log(e)
    }
  }

  async kafuChartMaker(week: number) {
    try {
      const lastWeek = await fetcher(`/api/chart/kafu/raw?week=${week - 1}`)
      const thisWeek = await fetcher(`/api/chart/kafu/raw?week=${week}`)

      const lastWeekData = lastWeek.data.data as CustomStatistic[]
      const thisWeekData = thisWeek.data.data as CustomStatistic[]

      const lastWeekKafu = lastWeekData.filter((value) => value.voiceBank === "KAFU")
      const thisWeekKafu = thisWeekData.filter((value) => value.voiceBank === "KAFU")

      const chart: RawChart[] = []

      for (const thisWeekElement of thisWeekKafu) {
        const lastWeekObj = lastWeekKafu.find((value) => value.videoId === thisWeekElement.videoId)

        if (lastWeekObj) {
          const thisWeekView = thisWeekElement.views - lastWeekObj.views
          const thisWeekLikes = thisWeekElement.likes - lastWeekObj.likes
          const thisWeekComment = thisWeekElement.comment - lastWeekObj.comment

          const { score, likePoints, viewPoints, viewModifier, likeModifier } =
            this.scoreMultiplier({
              ...thisWeekElement,
              views: thisWeekView,
              likes: thisWeekLikes,
              comment: thisWeekComment
            })

          chart.push({
            id: thisWeekElement.videoYoutubeId,
            channelName: thisWeekElement.artist,
            videoTitle: thisWeekElement.title ?? thisWeekElement.originalTitle,
            thumbnail: thisWeekElement.picture,
            uploadDate: thisWeekElement.uploadDate,
            isNew: false,
            viewCount: thisWeekView,
            score,
            commentCount: thisWeekComment ?? 0,
            likeCount: thisWeekLikes ?? 0,
            likePoints,
            viewPoints,
            likeModifier,
            viewModifier
          })
        } else {
          const { likePoints, viewPoints, viewModifier, likeModifier, score } =
            this.scoreMultiplier(thisWeekElement)

          const now = dayjs(new Date())
          const uploadMoment = dayjs(thisWeekElement.uploadDate)

          chart.push({
            id: thisWeekElement.videoYoutubeId,
            channelName: thisWeekElement.artist,
            videoTitle: thisWeekElement.title ?? thisWeekElement.originalTitle,
            uploadDate: thisWeekElement.uploadDate,
            thumbnail: thisWeekElement?.picture,
            isNew: !(now.diff(uploadMoment, "days") > 7),
            score: now.diff(uploadMoment, "days") > 7 ? 0 : score,
            viewCount: thisWeekElement.views,
            likeCount: thisWeekElement.likes ?? 0,
            commentCount: thisWeekElement.comment ?? 0,
            likeModifier,
            viewModifier,
            likePoints,
            viewPoints
          })
        }
      }

      return chart
    } catch (e) {
      console.log(e)
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
      const res = await fetcher(`/api/chart/init?id=${id}`, { method: "put", body })

      if (res.ok) {
        return Result.ok<Video>(res.data.data)
      } else {
        return Result.fail<Video>()
      }
    } catch (error) {
      return Result.fail<Video>()
    }
  }

  async initKafuChart(id: string, body: ChartRequestBody) {
    try {
      const res = await fetcher(`/api/chart/kafu/init?id=${id}`, { method: "put", body })

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
      const res = await fetcher(`/api/chart?week=${week}`)

      if (res.ok) {
        const performance = res.data.data as Performance[]

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

  async getKafuCurrentChart(week: number) {
    try {
      const res = await fetcher(`/api/chart/kafu?week=${week}`)

      if (res.ok) {
        const performance = res.data.data as KAFUPerformance[]

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
