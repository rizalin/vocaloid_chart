import React, { useEffect, useState } from "react"
import VocaDbServices from "../../../lib/services/vocadb_service"
import exportFromJSON from "export-from-json"
import { Box, Button, Container, Flex } from "@chakra-ui/react"
import SubmitButton from "../../shared/SubmitButton"
import Helmet from "../../shared/Helmet"

const VocadbHandlerPage = () => {
  const [isLoadingVocaEU, setIsLoadingVocaEU] = useState(false)
  const [isLoadingFetching, setIsLoadingFetching] = useState(false)

  const vocadb = new VocaDbServices()

  const getDataFromVocaEU = async () => {
    try {
      setIsLoadingVocaEU(true)
      const res = await vocadb.getArtistWithYoutube()
      const data = res.getValue()
      setIsLoadingVocaEU(false)
      exportFromJSON({ data: data, fileName: "vocadb", exportType: "json" })
    } catch (e) {
      console.log(e)
      setIsLoadingVocaEU(false)
    }
  }

  const getRecentProducerData = async () => {
    try {
      setIsLoadingFetching(true)
      const res = await vocadb.getRecentArtist()
      const data = res.getValue()
      console.log(data)
      setIsLoadingFetching(false)
      // exportFromJSON({ data: data, fileName: "recent_vocadb", exportType: "json" })
      exportFromJSON({ data: data, fileName: "recent_vocadb_other", exportType: "json" })
    } catch (e) {
      console.log(e)
      setIsLoadingFetching(false)
    }
  }

  return (
    <>
      <Helmet title="VocaDB Checking" />
      <Container>
        <Box height="40px" />

        <Box>
          <Flex>
            <SubmitButton isLoading={isLoadingVocaEU} onClick={getDataFromVocaEU}>
              Get Voca.eu Data
            </SubmitButton>
          </Flex>

          <Box height="40px" />

          <Flex>
            <SubmitButton isLoading={isLoadingFetching} onClick={getRecentProducerData}>
              Get Recent Data
            </SubmitButton>
          </Flex>
        </Box>
      </Container>
    </>
  )
}

export default VocadbHandlerPage
