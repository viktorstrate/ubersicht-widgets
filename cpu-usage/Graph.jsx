import { styled } from 'uebersicht'

import { MAX_DATA_POINTS } from './index.jsx'

const WrapperSVG = styled('svg')`
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  height: calc(100% - 20px);
`

const PathUser = styled('path')`
  fill: #b65655;
`

const PathSystem = styled('path')`
  fill: #55aed0;
`

const GraphLine = styled('line')`
  fill: none;
  stroke: white;
`

const Graph = ({ dataPoints, cores }) => {
  let pathUser = 'M 0,100 '
  let systemUser = 'M 0,100 '

  dataPoints.forEach((point, i) => {
    pathUser += `L ${(i / MAX_DATA_POINTS) * 100},${100 - point[1]} `
    systemUser += `L ${(i / MAX_DATA_POINTS) * 100},${100 -
      (point[0] + point[1])} `
  })

  pathUser += `L ${(dataPoints.length / MAX_DATA_POINTS) * 100},100`
  systemUser += `L ${(dataPoints.length / MAX_DATA_POINTS) * 100},100`

  // const PathsUser =
  //   dataPoints.reduce(
  //     (prev, curr, i, array) =>
  //       `${prev} L ${(i / MAX_DATA_POINTS) * 100},${100 - curr[0]} `,
  //     'M 0,100 '
  //   ) + `L ${(dataPoints.length / MAX_DATA_POINTS) * 100},100`

  // let Lines = []
  // for (let i = 0; i < 5; i++) {
  //   Lines.push(
  //     <GraphLine x1="0" x2="100" y1={(i / 5) * 100} y2={(i / 5) * 100} />
  //   )
  // }

  return (
    <WrapperSVG viewBox="0 0 100 100" preserveAspectRatio="none">
      <PathSystem d={systemUser} />
      <PathUser d={pathUser} />
      {/* <Lines /> */}
    </WrapperSVG>
  )
}

export default Graph
