import Result from "../class/Result"
import { VocaDbArtistQuery, VocadbUser, VocaDbYoutubeInfo } from "../../types/vocadb"
import VocadbRepo from "../repo/vocadb.repo"
import { YoutubeLinkType } from "@prisma/client"
import { sleep } from "../helper/async"

export default class VocaDbServices extends VocadbRepo {
  async getArtistWithYoutube() {
    try {
      const res = await this.getRawArtistWithYoutube()

      if (res.ok) {
        return Result.ok<VocadbUser[]>(res.data)
      } else {
        return Result.fail<VocadbUser[]>()
      }
    } catch (error) {
      return Result.fail<VocadbUser[]>()
    }
  }

  async getArtist(query: VocaDbArtistQuery) {
    try {
      const res = await this.getRawArtist(query)

      if (res.ok) {
        const data = res.data.items as VocadbUser[]

        const info: VocaDbYoutubeInfo[] = []

        let index = 0

        while (index < data.length) {
          const webLinks = data[index].webLinks

          const isPushed = webLinks.some((item) => item.url.includes("youtube.com"))

          if (isPushed) {
            for (let i = 0; i < webLinks.length; i++) {
              const element = webLinks[i]

              if (element.url.includes("youtube.com")) {
                const splitUrl = element.url.split("/")

                const a: VocaDbYoutubeInfo = {
                  artistId: data[index].id,
                  artistType: data[index].artistType,
                  url: element.url,
                  idType:
                    splitUrl[3] === "user"
                      ? YoutubeLinkType.CUSTOM_LINK
                      : YoutubeLinkType.ORIGINAL_ID,
                  category: element.category,
                  createDate: data[index].createDate,
                  defaultName: data[index].defaultName,
                  description: element.description,
                  linkId: element.id,
                  name: data[index].name,
                  youtubeId: splitUrl[4]
                }

                info.push(a)
              }
            }
          }

          index++
        }

        return Result.ok<VocaDbYoutubeInfo[]>(info)
      } else {
        return Result.fail<VocaDbYoutubeInfo[]>()
      }
    } catch (error) {
      return Result.fail<VocaDbYoutubeInfo[]>()
    }
  }

  async getRecentArtist() {
    try {
      let stop = false
      let start = 0
      const ceilingId = 91623
      const array = []

      while (!stop) {
        const res = await this.getArtist({
          artistTypes: "OtherGroup",
          maxResults: 50,
          start: start
        })

        if (res.isSuccess) {
          const data = res.getValue()

          const find = data.some((value) => value.artistId === ceilingId)
          array.push([...data])

          if (find) {
            stop = true
          } else {
            start = start + 50
          }
          // stop = true

          await sleep(500)
        } else {
          stop = true
        }
      }

      return Result.ok<VocaDbYoutubeInfo[]>(array)
    } catch (error) {
      return Result.fail<VocaDbYoutubeInfo[]>()
    }
  }
}
