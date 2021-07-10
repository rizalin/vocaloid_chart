export interface VocadbUser {
  artistType: string
  createDate: Date
  defaultName: string
  id: 4
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

export interface VocadbChannel {
  vocaDbDescription: string
  youtubeLink: string
  userId: number
  channelType: string
  youtubeId: string
  name: string
}
