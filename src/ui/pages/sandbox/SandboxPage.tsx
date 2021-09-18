import React from "react"
import Helmet from "../../shared/Helmet"
import { Box, Container, Flex } from "@chakra-ui/react"
import SubmitButton from "../../shared/SubmitButton"

const SandboxPage = () => {
  return (
    <>
      <Helmet title="Sandbox" />

      <Container>
        <Box height="40px" />

        <Box>
          <Flex>
            <SubmitButton>Fetch new video</SubmitButton>
          </Flex>

          <Box height="40px" />
        </Box>
      </Container>
    </>
  )
}

export default SandboxPage
