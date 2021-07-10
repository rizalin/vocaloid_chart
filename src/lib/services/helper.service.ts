import { PrismaClient, YoutubeLinkType } from "@prisma/client"
import dayjs from "dayjs"
import { VocadbUser, VocadbWebLink } from "../../types/vocadb"

export default class HelperService {
  channelDivider(body: VocadbUser[]) {
    // const youtubeChannels = []
    const idChannels = []
    const userChannels = []

    let index = 0

    while (index < body.length) {
      const webLinks = body[index].webLinks as VocadbWebLink[]

      const isPushed = webLinks.some((item) => item.url.includes("youtube.com"))

      if (isPushed) {
        for (let i = 0; i < webLinks.length; i++) {
          const element = webLinks[i]

          if (element.url.includes("youtube.com") && !element.url.includes("/watch")) {
            const splitUrl = element.url.split("/")

            const urlId = splitUrl[4] as string

            if (urlId) {
              let id = ""

              if (urlId.includes("?")) {
                const otherSplitUrl = urlId.split("?")
                id = otherSplitUrl[0]
              } else {
                id = urlId
              }

              if (splitUrl[3] === "user") {
                userChannels.push({
                  vocaDbDescription: element.description,
                  youtubeLink: element.url,
                  userId: body[index].id,
                  channelType: YoutubeLinkType.CUSTOM_LINK,
                  youtubeId: id,
                  name: body[index].name
                })
              } else {
                idChannels.push({
                  vocaDbDescription: element.description,
                  youtubeLink: element.url,
                  userId: body[index].id,
                  channelType: YoutubeLinkType.ORIGINAL_ID,
                  youtubeId: id,
                  name: body[index].name
                })
              }
              // youtubeChannels.push(a)
            }
          }
        }
      }

      index++
    }

    return { id: idChannels, user: userChannels }
  }
}
