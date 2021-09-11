import React, { useState } from "react"
import Helmet from "../../shared/Helmet"
import { Box, Container, Flex } from "@chakra-ui/react"
import SubmitButton from "../../shared/SubmitButton"
import DatabaseInitService from "../../../lib/services/database-init_service"
import { fetcher } from "../../../lib/helper/async"

const DatabaseInitPage = () => {
  const [isMakingUsers, setIsMakingUsers] = useState(false)
  const [isMakingNewUsers, setIsMakingNewUsers] = useState(false)
  const [isMakingChannels, setIsMakingChannels] = useState(false)
  const [isMakingVideos, setIsMakingVideos] = useState(false)
  const [isMakingStatistics, setIsMakingStatistics] = useState(false)
  const [isMakingPerformances, setIsMakingPerformances] = useState(false)
  const [isMakingWeekPerformances, setIsMakingWeekPerformances] = useState(false)

  const init = new DatabaseInitService()

  async function initUsers() {
    try {
      setIsMakingUsers(true)
      await init.initUsers()
      setIsMakingUsers(false)
    } catch (e) {
      setIsMakingUsers(false)
      console.log(e)
    }
  }

  async function initNewUsers() {
    try {
      setIsMakingNewUsers(true)
      await init.initNewUsers()
      setIsMakingNewUsers(false)
    } catch (e) {
      setIsMakingNewUsers(false)
      console.log(e)
    }
  }

  async function initChannels() {
    try {
      setIsMakingChannels(true)
      await init.initChannels()
      setIsMakingChannels(false)
    } catch (e) {
      setIsMakingChannels(false)
      console.log(e)
    }
  }

  async function initVideos() {
    try {
      setIsMakingVideos(true)
      await init.initVideos()
      setIsMakingVideos(false)
    } catch (e) {
      setIsMakingVideos(false)
      console.log(e)
    }
  }

  async function initStatistics() {
    try {
      setIsMakingStatistics(true)
      await init.initStatistic(6)
      setIsMakingStatistics(false)
    } catch (e) {
      setIsMakingStatistics(false)
      console.log(e)
    }
  }

  async function initPerformances() {
    try {
      setIsMakingPerformances(true)
      await init.initPerformance()
      setIsMakingPerformances(false)
    } catch (e) {
      setIsMakingPerformances(false)
      console.log(e)
    }
  }

  async function initWeekPerformances() {
    try {
      setIsMakingWeekPerformances(true)
      await init.initWeekPerformances()
      setIsMakingWeekPerformances(false)
    } catch (e) {
      setIsMakingWeekPerformances(false)
      console.log(e)
    }
  }

  return (
    <>
      <Helmet title="Database Init" />
      <Container>
        <Box height="40px" />

        <Box>
          <Flex>
            <SubmitButton isLoading={isMakingUsers} onClick={initUsers}>
              Init Users
            </SubmitButton>
          </Flex>

          <Box height="40px" />

          <Flex>
            <SubmitButton isLoading={isMakingNewUsers} onClick={initNewUsers}>
              Init New Users
            </SubmitButton>
          </Flex>

          <Box height="40px" />

          <Flex>
            <SubmitButton isLoading={isMakingChannels} onClick={initChannels}>
              Init Channels
            </SubmitButton>
          </Flex>

          <Box height="40px" />

          <Flex>
            <SubmitButton isLoading={isMakingVideos} onClick={initVideos}>
              Init Videos
            </SubmitButton>
          </Flex>

          <Box height="40px" />

          <Flex>
            <SubmitButton isLoading={isMakingStatistics} onClick={initStatistics}>
              Init Statistics
            </SubmitButton>
          </Flex>

          <Box height="40px" />

          <Flex>
            <SubmitButton isLoading={isMakingPerformances} onClick={initPerformances}>
              Init Performances
            </SubmitButton>
          </Flex>

          <Box height="40px" />

          <Flex>
            <SubmitButton isLoading={isMakingWeekPerformances} onClick={initWeekPerformances}>
              Init Week Performances
            </SubmitButton>
          </Flex>
        </Box>
      </Container>
    </>
  )
}

export default DatabaseInitPage
