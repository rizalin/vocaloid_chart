import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons"
import dayjs from "dayjs"
import { FC } from "react"
import { ChartDetail } from "../../../types/chart"

export interface Rank {
  rankProgress: "NEW" | number | string
  highestRank: number
}

function rankCalculator(video: ChartDetail): Rank {
  const { isNew, bestPosition, lastWeek, weeksInChart, currentPosition } = video
  const progress = lastWeek - currentPosition

  switch (true) {
    case isNew:
      return {
        rankProgress: "NEW",
        highestRank: currentPosition
      }
    case weeksInChart < 2 && lastWeek === 0:
      return {
        rankProgress: "CHART DEBUT",
        highestRank: currentPosition
      }
    case weeksInChart > 1 && lastWeek === 0:
      return {
        rankProgress: "RE-ENTRY",
        highestRank: bestPosition
      }
    case bestPosition > 0:
      return {
        rankProgress: progress === 0 ? "=" : lastWeek - currentPosition,
        highestRank: bestPosition
      }
    default:
      return {
        rankProgress: progress === 0 ? "=" : lastWeek - currentPosition,
        highestRank: lastWeek < currentPosition ? lastWeek : currentPosition
      }
  }
}

function ProgressIndicator({ rankProgress }) {
  switch (true) {
    case rankProgress > 0:
      return (
        <div className="rank-progress_wrapper d-flex flex-column align-items-center">
          <div className="rank-icon">
            <ArrowUpIcon />
          </div>
          <div className="rank-progress text-center">{rankProgress}</div>
        </div>
      )
    case rankProgress === "NEW":
    case !rankProgress:
      return <>NEW</>
    case rankProgress === "RE-ENTRY":
      return <>RE-ENTRY</>
    case rankProgress === "CHART DEBUT":
      return <>CHART DEBUT</>
    case rankProgress === "=":
      return <>=</>
    default:
      return (
        <div className="rank-progress_wrapper d-flex flex-column align-items-center">
          <div className="rank-icon">
            <ArrowDownIcon />
          </div>
          <div className="rank-progress text-center">{Math.abs(rankProgress)}</div>
        </div>
      )
  }
}

interface ChartComponentProps {
  video: ChartDetail
  type?: "new" | "all"
  isKafu?: boolean
}

export const ChartComponent: FC<ChartComponentProps> = ({ video, type, isKafu }) => {
  const { highestRank, rankProgress } = rankCalculator(video)

  return (
    <div className={`entry-wrapper ${isKafu ? "entry-wrapper--kafu" : ""}`} key={video.id}>
      <div className="rank-wrapper">{video.currentPosition}</div>
      <div className="video-info">
        <img src={video.picture} alt="" />
        <div className="overlay-info">
          <div className="info">
            <div className="title">{video.title}</div>
            <div className="artist">{video.artist}</div>
            <div className="composer">Voice Bank: {video.voiceBank}</div>
          </div>
        </div>
      </div>
      <div className="chart-info">
        <div className="progress-column">
          <ProgressIndicator rankProgress={rankProgress} />
        </div>
        <div className="chart-progress">
          {isKafu ? (
            ""
          ) : (
            <div className="info">Score : {Intl.NumberFormat("en-EN").format(video.score)}</div>
          )}
          {type === "all" ? (
            <div className="info">Weeks in chart : {video.weeksInChart ?? 1}</div>
          ) : (
            <div className="info">Views : {Intl.NumberFormat("en-EN").format(video.views)}</div>
          )}
          {type === "all" ? (
            <div className="info">Highest rank : {highestRank}</div>
          ) : (
            <div className="info">Upload Date : {dayjs(video.uploadDate).format("DD-MM-YY")}</div>
          )}
        </div>
      </div>
    </div>
  )
}
