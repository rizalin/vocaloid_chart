import React from "react"
import { Box, Container } from "@chakra-ui/react"
import Helmet from "../../shared/Helmet"
import HpLinkButton from "./HpLinkButton"

const Homepage = () => {
  return (
    <>
      <Helmet title="Vocaloid Chart Maker" />
      <div>
        <div className="home__banner">
          <img src="/banner.jpg" alt="" />
          <div className="home__banner__overlay">
            <h1>Vocaloid Chart Maker</h1>
          </div>
        </div>

        <Box height="60px" />

        <Container className="home__links" maxW="container.xl">
          <h3>Chart</h3>
          <Box height="20px" />

          <div className="home__links__row">
            <HpLinkButton image="/hiiru_mk2.jpg" label="Original" link="/chart/original" />
            <HpLinkButton
              image="/hiiru_mk2.jpg"
              label="Original (New This Week)"
              link="/chart/original/new"
            />
            <HpLinkButton
              image="/kafu.jpg"
              label="KAFU (Most Watched)"
              link="/chart/kafu/most_watched"
            />
            <HpLinkButton image="/kafu.jpg" label="KAFU (hiiru edition)" link="/chart/kafu" />
          </div>

          <Box height="60px" />
          <h3>Utility</h3>
          <Box height="20px" />

          <div className="home__links__row">
            <HpLinkButton image="/hiiiru.jpg" label="Vocadb" link="/utility/vocadb" />
            <HpLinkButton image="/hiiiru.jpg" label="Database Init" link="/utility/database_init" />
            <HpLinkButton image="/hiiiru.jpg" label="Fetching Data" link="/utility/fetching_data" />
            <HpLinkButton image="/hiiiru.jpg" label="Chart Editor" link="/utility/chart_editor" />
          </div>
        </Container>
      </div>
    </>
  )
}

export default Homepage
