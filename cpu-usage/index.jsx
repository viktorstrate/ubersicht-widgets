import { styled } from 'uebersicht'

import Graph from './Graph.jsx'

export const refreshFrequency = 1000
export const command =
  "top -l 1 -n 0 | grep 'CPU usage' | awk '{print $3+0; print $5+0}' && sysctl -n hw.logicalcpu"

export const MAX_DATA_POINTS = 250

export const initialState = {
  cpuHistory: [[0, 0]],
  cores: 1,
}

export const updateState = (event, previousState) => {
  let values = event.output.split('\n')

  const cpu = [parseFloat(values[0]), parseFloat(values[1])]
  const cores = parseInt(values[2])

  let { cpuHistory } = previousState

  if (cpuHistory.length >= MAX_DATA_POINTS) cpuHistory.shift()
  cpuHistory.push(cpu)

  return {
    ...previousState,
    cpuHistory,
    cores,
  }
}

const Container = styled('div')`
  width: 300px;
  height: 55px;
  right: 390px;
  bottom: 50px;
  position: fixed;
  padding: 4px 10px 15px;
  border-radius: 5px;
  color: white;
  font-family: 'Helvetica Neue';
  background: rgba(255, 255, 255, 0.1);
`

const Title = styled('div')`
  font-size: 10px;
  text-transform: uppercase;
  font-weight: bold;
  height: 15px;
  display: inline-block;
  margin-bottom: 4px;
`

const Details = styled('span')`
  font-size: 12px;
  font-weight: 200;
  width: 80px;
  margin-left: 12px;
`

const Label = styled('span')`
  text-transform: uppercase;
  font-weight: 700;
  font-size: 8px;
  margin-right: 2px;
`

const Value = styled('span')`
  font-weight: 300;
  width: 46px;
  padding-left: 2px;
  display: inline-block;
`

export const render = ({ cpuHistory, cores }) => {
  const user = cpuHistory[cpuHistory.length - 1][1].toFixed(1)
  const system = cpuHistory[cpuHistory.length - 1][0].toFixed(1)
  const free = (100 - user - system).toFixed(1)

  return (
    <Container>
      <Title>Processor</Title>
      <Details>
        <Label>User</Label>
        <Value>{user}%</Value>
        <Label>System</Label>
        <Value>{system}%</Value>
        <Label>Idle</Label>
        <Value>{free}%</Value>
      </Details>
      <Graph dataPoints={cpuHistory} cores={cores} />
    </Container>
  )
}
