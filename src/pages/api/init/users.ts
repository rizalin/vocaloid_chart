import { PrismaClient } from "@prisma/client"
import dayjs from "dayjs"
import { NextApiRequest, NextApiResponse } from "next"
import { VocadbUser, VocadbWebLink } from "../../../types/vocadb"

const prisma = new PrismaClient()

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const body = req.body as VocadbUser[]

      const users = []

      let index = 0

      while (index < body.length) {
        const webLinks = body[index].webLinks as VocadbWebLink[]

        const isPushed = webLinks.some(
          (item) => item.url.includes("youtube.com") && !item.url.includes("/watch")
        )

        if (isPushed) {
          const userObj = {
            artistType: body[index].artistType,
            defaultName: body[index].defaultName,
            createdDate: dayjs(body[index].createDate).format(),
            id: body[index].id
          }
          users.push(userObj)
        }

        index++
      }

      await prisma.user.createMany({
        data: users,
        skipDuplicates: true
      })

      res.status(200).json({ message: "Success" })
    } catch (error) {
      console.log({ error })
      return res.status(500).json({ error: "internal server error" })
    }
  } else {
    res.status(405).end()
  }
}
