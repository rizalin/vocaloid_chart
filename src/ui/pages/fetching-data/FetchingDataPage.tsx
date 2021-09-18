import React, { useState } from "react"
import Helmet from "../../shared/Helmet"
import { Box, Container, Flex } from "@chakra-ui/react"
import SubmitButton from "../../shared/SubmitButton"
import InitService from "../../../lib/services/init_service"
import ChartService from "../../../lib/services/chart_service"
import exportFromJSON from "export-from-json"

const FetchingDataPage = () => {
  const [isFetchingNewVideo, setIsFetchingNewVideo] = useState(false)
  const [isMakingStatistics, setIsMakingStatistics] = useState(false)
  const [isMakingNewStatistics, setIsMakingNewStatistics] = useState(false)
  const [isMakingChart, setIsMakingChart] = useState(false)
  const [isMakingKafuChart, setIsMakingKafuChart] = useState(false)

  const init = new InitService()
  const chart = new ChartService()

  async function fetchingNewVideo() {
    try {
      setIsFetchingNewVideo(true)
      await init.initChannelVideos()
      setIsFetchingNewVideo(false)
    } catch (e) {
      setIsFetchingNewVideo(false)
    }
  }

  async function makingStatistic() {
    try {
      setIsMakingStatistics(true)
      await init.initStatistic()
      setIsMakingStatistics(false)
    } catch (e) {
      setIsMakingStatistics(false)
    }
  }

  async function makingWeekStatistic() {
    try {
      setIsMakingNewStatistics(true)
      await init.initWeekStatistic(12)
      setIsMakingNewStatistics(false)
    } catch (e) {
      setIsMakingNewStatistics(false)
    }
  }

  async function makingChart() {
    try {
      setIsMakingChart(true)
      const data = await chart.chartMaker(12)
      setIsMakingChart(false)

      exportFromJSON({ data, fileName: "chart_sep_18", exportType: "csv" })
      exportFromJSON({ data, fileName: "chart_sep_18", exportType: "json" })
    } catch (e) {
      setIsMakingChart(false)
    }
  }

  async function makingKafuChart() {
    try {
      setIsMakingKafuChart(true)
      const data = await chart.kafuChartMaker(8)
      setIsMakingKafuChart(false)

      exportFromJSON({ data, fileName: "kafu_chart_aug_21", exportType: "csv" })
      exportFromJSON({ data, fileName: "kafu_chart_aug_21", exportType: "json" })
    } catch (e) {
      setIsMakingKafuChart(false)
    }
  }

  return (
    <>
      <Helmet title="Data Fetching" />

      <Container>
        <Box height="40px" />

        <Box>
          <Flex>
            <SubmitButton isLoading={isFetchingNewVideo} onClick={fetchingNewVideo}>
              Fetch new video
            </SubmitButton>
          </Flex>

          <Box height="40px" />
          <Flex>
            <SubmitButton isLoading={isMakingStatistics} onClick={makingStatistic}>
              Make statistics
            </SubmitButton>
          </Flex>

          <Box height="40px" />
          <Flex>
            <SubmitButton isLoading={isMakingNewStatistics} onClick={makingWeekStatistic}>
              Make this week statistics
            </SubmitButton>
          </Flex>

          <Box height="40px" />
          <Flex>
            <SubmitButton isLoading={isMakingChart} onClick={makingChart}>
              Make this week chart
            </SubmitButton>
          </Flex>

          <Box height="40px" />
          <Flex>
            <SubmitButton isLoading={isMakingKafuChart} onClick={makingKafuChart}>
              Make this week kafu chart
            </SubmitButton>
          </Flex>
        </Box>
      </Container>
    </>
  )
}

export default FetchingDataPage
