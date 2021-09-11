import { fetcher } from "../helper/async"
import { VocaDbArtistQuery } from "../../types/vocadb"

export default class VocadbRepo {
  async getRawArtistWithYoutube() {
    return await fetcher("/api/vocadb/artist_with_youtube_channels")
  }

  async getRawArtist({ artistTypes, start = 0, maxResults = 50 }: VocaDbArtistQuery) {
    return await fetcher(
      `https://vocadb.net/api/artists?artistTypes=${artistTypes}&allowBaseVoicebanks=false&status=Finished&start=${start}&maxResults=${maxResults}&getTotalCount=true&sort=AdditionDate&fields=WebLinks`
    )
  }
}
