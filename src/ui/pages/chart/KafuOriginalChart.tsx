import { Box, Container, Flex, Spinner } from "@chakra-ui/react"
import Head from "next/head"
import React, { useEffect, useState } from "react"
import { ChartDetail } from "../../../types/chart"
import ChartService from "../../../lib/services/chart_service"
import { ChartComponent } from "./ChartComponent"
import { useRouter } from "next/router"
import Helmet from "../../shared/Helmet"

// TODO
// Add IA official

export default function KafuOriginalChart(props) {
  const [videos, setVideos] = useState<ChartDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [shownVideos, setShownVideos] = useState<ChartDetail[]>([])

  const chart = new ChartService()
  const router = useRouter()
  const { show } = router.query

  useEffect(() => {
    const getData = async () => {
      const res = await chart.getKafuCurrentChart(2)

      if (res.isSuccess) {
        const data = res.getValue()
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

  console.log(shownVideos)

  return (
    <>
      <Helmet title="KAFU Chart - hiiru Edition" />

      <Box className="home_chart home_chart--kafu">
        <Container maxWidth="container.xl">
          <div className="home_chart__header">
            <img src="/kafu.jpg" alt="" />
            <div className="home_chart__header__title">
              <h1>KAFU Chart</h1>
              <h3>hiiru Edition</h3>
              <h5>Per August 15, 2021</h5>
            </div>
            <div className="home_chart__header__week">
              <div className="home_chart__header__week__title">Week</div>
              <div className="home_chart__header__week__number">2</div>
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
        </Container>
      </Box>
    </>
  )
}
