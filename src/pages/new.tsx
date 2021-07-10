import { Box, Container } from "@chakra-ui/react"
import { Video } from "@prisma/client"
import Head from "next/head"
import { useEffect, useState } from "react"
import { NEW_JUL_3_CHART } from "../database/jul_3"
import PrismaService from "../lib/services/prisma.service"
import { Chart } from "../types/ui"
import { ChartComponent } from "../components/chart-component"

// TODO
// Add IA official

export default function Home(props) {
  const [videos, setVideos] = useState<Chart[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [videoLinks, setVideoLinks] = useState([])

  const prisma = new PrismaService()

  useEffect(() => {
    const getData = async () => {
      const array: Chart[] = []
      const links = []

      for (let index = 0; index < NEW_JUL_3_CHART.length; index++) {
        const element = NEW_JUL_3_CHART[index]

        const res = await prisma.getVideo(element.id)

        const data = res.getValue()

        // @ts-ignore
        array.push({
          ...data,
          isNew: true,
          bestPosition: index + 1,
          lastWeek: 0,
          weeksInChart: 1,
          score: element.score ?? 0,
          views: data.statistic[0].views
        })
        links.push(`https://www.youtube.com/watch?v=${data.videoYoutubeId}`)
      }

      setVideos(array)
      console.log(links)
      setIsLoading(false)
    }

    getData()
  }, [])

  return (
    <>
      <Head>
        <title>New Vocaloid Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box className="home-chart">
        <Container maxWidth="container.xl">
          <div className="home-chart__header">
            <img src="/hiiiru.jpg" alt="" />
            <div className="home-chart__header__title">
              <h1>Vocaloid Chart</h1>
              <h3>NEW Original Edition</h3>
              <h5>Per Jul 3, 2021</h5>
            </div>
            <div className="home-chart__header__week">
              <div className="home-chart__header__week__title">Week</div>
              <div className="home-chart__header__week__number">1</div>
              <div className="home-chart__header__week__year">2021</div>
            </div>
          </div>

          <Box>
            {videos.slice(0, 10).map((item, i) => (
              <ChartComponent video={item} index={i} indexAdd={1} key={i} type="new" />
            ))}
          </Box>
        </Container>
      </Box>
    </>
  )
}