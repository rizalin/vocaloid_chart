import React, { useEffect, useState } from "react"
import Helmet from "../../shared/Helmet"
import { ChartDetail } from "../../../types/chart"
import ChartService from "../../../lib/services/chart_service"
import { Box, Container, Flex, Spinner } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { ChartComponent } from "./ChartComponent"

const OriginalChartPage = () => {
  const [videos, setVideos] = useState<ChartDetail[]>([])
  const [currentWeek, setCurrentWeek] = useState(13)
  const [shownVideos, setShownVideos] = useState<ChartDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const chart = new ChartService()

  const router = useRouter()
  const { show } = router.query

  useEffect(() => {
    const getData = async () => {
      const res = await chart.getCurrentChart(currentWeek)

      if (res.isSuccess) {
        const data = res.getValue()
        console.log(data)
        setVideos(data)

        switch (show) {
          case "top":
            setShownVideos(data.slice(0, 10))
            break
          case "bottom":
            setShownVideos(data.slice(10, 20))
            break
          default:
            setShownVideos(data)
            break
        }

        if (!show) {
          setShownVideos(data)
        }
      }

      setIsLoading(false)
    }

    getData()
  }, [router])

  return (
    <>
      <Helmet title="Original Chart" />

      <Box className="home_chart">
        <Container maxWidth="container.xl">
          <div className="home_chart__header">
            <img src="/hiiru_mk2.jpg" alt="" />
            <div className="home_chart__header__title">
              <h1>Vocaloid/UTAU/Synth Chart</h1>
              <h3>Original Edition</h3>
              <h5>Per September 25, 2021</h5>
            </div>
            <div className="home_chart__header__week">
              <div className="home_chart__header__week__title">Week</div>
              <div className="home_chart__header__week__number">{currentWeek}</div>
              <div className="home_chart__header__week__year">2021</div>
            </div>
          </div>

          {isLoading ? (
            <Flex align="center" justify="center" h="50vh">
              <Spinner size="xl" color="white" />
            </Flex>
          ) : (
            <Box>
              {shownVideos.map((value, index) => (
                <ChartComponent video={value} key={index} type="all" />
              ))}
            </Box>
          )}

          {/*<Box>*/}
          {/*  {videos.slice(0, 20).map((item, i) => (*/}
          {/*    <ChartComponent video={item} index={i} indexAdd={1} key={i} type="all" />*/}
          {/*  ))}*/}
          {/*</Box>*/}
        </Container>
      </Box>
    </>
  )
}

export default OriginalChartPage
