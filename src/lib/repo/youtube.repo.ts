import got from "got"
import { Video, YoutubeChannel } from "@prisma/client"

export default class YoutubeRepo {
  private params = [
    ["part", "statistics"],
    ["part", "snippet"],
    ["key", process.env.YOUTUBE_API_KEY]
  ]

  private url: string

  constructor() {
    this.url = process.env.YOUTUBE_API_URL
  }

  async getUserChannel(user: string) {
    const params = [...this.params]

    params.push(["forUsername", user])

    const searchParams = new URLSearchParams(params)

    return got(`${process.env.YOUTUBE_API_URL}/channels`, {
      searchParams,
      responseType: "json"
    })
  }

  async getChannelList(ids: any[], nextToken?: string) {
    const params = [...this.params]

    for (const id of ids) {
      params.push(["id", id.youtubeId])
    }

    if (nextToken) {
      params.push(["pageToken", nextToken])
    }

    const searchParams = new URLSearchParams(params)

    return got(`${process.env.YOUTUBE_API_URL}/channels`, {
      searchParams,
      responseType: "json"
    })
  }

  async getChannelContentDetail(channels: YoutubeChannel[]) {
    const params = [
      ["part", "contentDetails"],
      ["key", process.env.YOUTUBE_API_KEY],
      ["maxResults", "50"]
    ]

    for (const channel of channels) {
      params.push(["id", channel.youtubeId])
    }

    const searchParams = new URLSearchParams(params)

    return got(`${process.env.YOUTUBE_API_URL}/channels`, {
      searchParams,
      responseType: "json"
    })
  }

  async getPlaylistItems(playlistId: string, nextToken?: string) {
    const params = [
      ["part", "snippet"],
      ["key", process.env.YOUTUBE_API_KEY],
      ["maxResults", "50"],
      ["playlistId", playlistId]
    ]

    if (nextToken) {
      params.push(["pageToken", nextToken])
    }

    const searchParams = new URLSearchParams(params)

    return got(`${process.env.YOUTUBE_API_URL}/playlistItems`, {
      searchParams,
      responseType: "json"
    })
  }

  async getVideoInfo(videos: Video[]) {
    const params = [
      ["part", "statistics"],
      ["key", process.env.YOUTUBE_API_KEY],
      ["maxResults", "50"]
    ]

    for (const video of videos) {
      params.push(["id", video.videoYoutubeId])
    }

    const searchParams = new URLSearchParams(params)

    return got(`${process.env.YOUTUBE_API_URL}/videos`, {
      searchParams,
      responseType: "json"
    })
  }
}
