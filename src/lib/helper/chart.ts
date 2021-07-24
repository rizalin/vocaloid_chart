import { Statistic, Video } from "@prisma/client"
import dayjs from "dayjs"

export default class ChartHelper {
  scoreMultiplier(statistic: Statistic, publishedAt: Date) {
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

    const { likes, views, comments } = statistic

    function modifierA() {
      if (!comments) {
        return 0
      }

      const vl = views + likes
      const vcl = views + comments + likes

      return Math.pow(vl / vcl, 10)
    }

    function modifierB(): number {
      const modifier = (likes / views) * 100 * 2

      return parseFloat(modifier.toFixed(2))
    }

    function modifierC() {
      const now = dayjs(new Date())
      const uploadMoment = dayjs(publishedAt)
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
    const commentPoints = comments > 1 ? comments * modifierA() : 0

    return {
      score: views ? Math.floor(viewPoints + likePoints()) : 0,
      viewModifier: modifierC(),
      commentModifier: modifierA(),
      likeModifier: modifierB(),
      viewPoints,
      likePoints: likePoints()
    }
  }

  chartMaker(thisWeek: Statistic, lastWeek: Statistic[], videoInfo: Video) {
    const lastWeekObj = lastWeek.find((value) => value.videoId === thisWeek.videoId)

    if (lastWeekObj) {
      const thisWeekView = thisWeek.views - lastWeekObj.views
      const thisWeekLike = thisWeek.likes - lastWeekObj.likes
      const thisWeekComment = thisWeek.comments - lastWeekObj.comments

      const { score, likeModifier, viewModifier, likePoints, viewPoints } = this.scoreMultiplier(
        {
          ...lastWeekObj,
          comments: thisWeekComment,
          likes: thisWeekLike,
          views: thisWeekView
        },
        videoInfo.uploadDate
      )

      return {
        id: videoInfo.videoYoutubeId,
        isNew: false,
        channelName: videoInfo.customArtist,
        publishedAt: videoInfo.uploadDate,
        videoTitle: videoInfo?.originalTitle,
        thumbnail: videoInfo?.picture,
        viewCount: thisWeekView,
        likeCount: thisWeekLike ?? 0,
        commentCount: thisWeekComment ?? 0,
        score,
        likeModifier,
        viewModifier,
        likePoints,
        viewPoints
      }
    } else {
      const { score, commentModifier, likeModifier, viewModifier, likePoints, viewPoints } =
        this.scoreMultiplier(thisWeek, videoInfo.uploadDate)

      const now = dayjs(new Date())
      const uploadMoment = dayjs(videoInfo.uploadDate)

      return {
        id: videoInfo.videoYoutubeId,
        isNew: !(now.diff(uploadMoment, "days") > 7),
        channelName: videoInfo.customArtist,
        publishedAt: videoInfo.uploadDate,
        videoTitle: videoInfo?.originalTitle,
        thumbnail: videoInfo?.picture,
        score: now.diff(uploadMoment, "days") > 7 ? 0 : score,
        likeModifier,
        viewModifier,
        likePoints,
        viewPoints,
        viewCount: thisWeek.views,
        likeCount: thisWeek.likes ?? 0,
        commentCount: thisWeek.comments ?? 0
      }
    }
  }
}
