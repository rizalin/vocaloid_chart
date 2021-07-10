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
      if (diff > 14) {
        return 1.0
      } else if (diff < 1) {
        return 1.4
      } else {
        const modifier = (1.4 - diff / 40).toFixed(2)
        return parseFloat(modifier)
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
      likeModifier: modifierB()
    }
  }

  chartMaker(thisWeek: Statistic, lastWeek: Statistic[], videoInfo: Video) {
    const lastWeekObj = lastWeek.find((value) => value.videoId === thisWeek.videoId)

    if (lastWeekObj) {
      const thisWeekView = thisWeek.views - lastWeekObj.views
      const thisWeekLike = thisWeek.likes - lastWeekObj.likes
      const thisWeekComment = thisWeek.comments - lastWeekObj.comments

      const { score, commentModifier, likeModifier, viewModifier } = this.scoreMultiplier(
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
        modifierA: commentModifier,
        modifierB: likeModifier,
        modifierC: viewModifier
      }
    } else {
      const { score, commentModifier, likeModifier, viewModifier } = this.scoreMultiplier(
        thisWeek,
        videoInfo.uploadDate
      )

      return {
        ...thisWeek,
        id: videoInfo.videoYoutubeId,
        isNew: true,
        channelName: videoInfo.customArtist,
        publishedAt: videoInfo.uploadDate,
        videoTitle: videoInfo?.originalTitle,
        thumbnail: videoInfo?.picture,
        score,
        modifierA: commentModifier,
        modifierB: likeModifier,
        modifierC: viewModifier
      }
    }
  }
}
