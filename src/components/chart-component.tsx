import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons"
import dayjs from "dayjs"
import { FC } from "react"
import { Chart, Rank } from "../types/ui"

export interface RankCalculatorProps {
  index: number
  indexAdd: number
  video: Chart
}

function rankCalculator({ index, indexAdd, video }: RankCalculatorProps): Rank {
  const currentRank = index + indexAdd
  const { isNew, bestPosition, lastWeek } = video
  const progress = lastWeek - currentRank

  switch (true) {
    case isNew:
      return {
        rankProgress: "NEW",
        highestRank: currentRank
      }
    case lastWeek > 20 && bestPosition > 1:
      return {
        rankProgress: "RE-ENTRY",
        highestRank: bestPosition
      }
    case lastWeek > 20:
      return {
        rankProgress: "CHART DEBUT",
        highestRank: currentRank
      }
    case bestPosition > 0:
      return {
        rankProgress: progress === 0 ? "=" : lastWeek - currentRank,
        highestRank: bestPosition
      }
    default:
      return {
        rankProgress: progress === 0 ? "=" : lastWeek - currentRank,
        highestRank: lastWeek < currentRank ? lastWeek : currentRank
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
  video: Chart
  index: number
  indexAdd: number
  type?: "new" | "all"
  isKafu?: boolean
}

export const ChartComponent: FC<ChartComponentProps> = ({
  video,
  index,
  indexAdd,
  type,
  isKafu
}) => {
  const { highestRank, rankProgress } = rankCalculator({ video, index, indexAdd })

  return (
    <div className={`entry-wrapper ${isKafu ? "entry-wrapper--kafu" : ""}`} key={video.id}>
      <div className="rank-wrapper">{index + indexAdd}</div>
      <div className="video-info">
        <img src={video.picture} alt="" />
        <div className="overlay-info">
          <div className="info">
            <div className="title">{video.title}</div>
            <div className="artist">{video.customArtist}</div>
            <div className="composer">Voice Bank: {video.voiceBank}</div>
          </div>
        </div>
      </div>
      <div className="chart-info">
        <div className="progress-column">
          <ProgressIndicator rankProgress={rankProgress} />
        </div>
        <div className="chart-progress">
          {isKafu ? "" : <div className="info">Score : {Intl.NumberFormat("en-EN").format(video.score)}</div>}
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
