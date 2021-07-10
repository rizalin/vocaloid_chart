import { YoutubeChannel, YoutubeLinkType } from '@prisma/client';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { VocadbUser, VocadbWebLink } from '../../../types/vocadb';

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const body = req.body as VocadbUser[];

      const users = [];
      const youtubeChannels = [];

      let index = 0;

      while (index < body.length) {
        const webLinks = body[index].webLinks as VocadbWebLink[];

        const isPushed = webLinks.some((item) =>
          item.url.includes('youtube.com')
        );

        if (isPushed) {
          const userObj = {
            artistType: body[index].artistType,
            defaultName: body[index].defaultName,
            createdDate: dayjs(body[index].createDate).format(),
            id: body[index].id,
          };
          users.push(userObj);

          for (let i = 0; i < webLinks.length; i++) {
            const element = webLinks[i];

            if (element.url.includes('youtube.com')) {
              const splitUrl = element.url.split('/');

              const a = {
                vocaDbDescription: element.description,
                youtubeLink: element.url,
                userId: body[index].id,
                channelType:
                  splitUrl[3] === 'user'
                    ? YoutubeLinkType.CUSTOM_LINK
                    : YoutubeLinkType.CUSTOM_LINK,
                youtubeId: splitUrl[4],
                name: body[index].name,
              };
              youtubeChannels.push(a);
            }
          }
        }

        index++;
      }

      res.status(200).json(youtubeChannels);
    } catch (error) {
      console.log({ error });
      return res.status(500).json({ error: 'internal server error' });
    }
  } else {
    res.status(405).end();
  }
}
