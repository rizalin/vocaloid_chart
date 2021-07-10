export interface YoutubeChannelRaw {
  id: string
  snippet: YoutubeChannelSnippetRaw
  statistics: YoutubeChannelStatisticRaw
  contentDetails: YoutubeChannelContentDetail
}

export interface YoutubeChannelSnippetRaw {
  title: string
  description?: string
  publishedAt: Date
  thumbnails: {
    [key: string]: Thumbnail
  }
  channelTitle?: string
  resourceId: {
    kind: string
    videoId?: string
  }
}

export interface YoutubeResponseRaw {
  nextPageToken?: string
  pageInfo: YoutubePageInfoResponse
  items: any[]
}

export interface YoutubePageInfoResponse {
  totalResults: number
  resultsPerPage: number
}

export interface Thumbnail {
  url: string
  width: number
  height: number
}

export interface YoutubeChannelStatisticRaw {
  viewCount: string
  subscriberCount: string
  hiddenSubscriberCount: boolean
  videoCount: string
}

export interface YoutubeChannelContentDetail {
  relatedPlaylists: YoutubeChannelRelatedPlaylist
}

export interface YoutubeChannelRelatedPlaylist {
  likes: string
  favorites: string
  uploads: string
}

export interface YoutubeVideoResponse {
  id: string
  statistics: YoutubeVideoStatistic
}

export interface YoutubeVideoStatistic {
  viewCount: string
  likeCount: string
  dislikeCount: string
  favoriteCount: string
  commentCount: string
}
