import { YoutubeLinkType } from "@prisma/client"

export type VocaDbArtistTypes = "Producer" | "OtherGroup"

export interface VocadbUser {
  artistType: string
  createDate: Date
  defaultName: string
  id: number
  name: string
  webLinks: VocadbWebLink[]
}

export interface VocadbWebLink {
  category: string
  description: string
  disabled: boolean
  id: number
  url: string
}

export interface VocaDbYoutubeInfo {
  artistType: string
  createDate: Date
  defaultName: string
  artistId: number
  name: string
  linkId: number
  category: string
  description: string
  url: string
  idType: YoutubeLinkType
  youtubeId: string
}

export interface VocaDbArtistQuery {
  artistTypes: VocaDbArtistTypes
  start?: number
  maxResults?: number
}
