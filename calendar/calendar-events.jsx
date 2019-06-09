import { styled } from 'uebersicht'

// Show which calendar you pulled from before event name
const SHOW_CALENDER = false
// Ignore specific calendars
const IGNORE_CALENDER = ['name of calendar to ignore', 'other calendar etc']
// Show full date including time
const SHOW_DATE_TIME = true
// Characters after this value will be replaced with ...
const MAX_CHARACTERS = 50

export const command = '/usr/local/bin/icalBuddy -n eventsToday+2'

export const refreshFrequency = 360000

const Container = styled('div')`
  position: fixed;
  right: 240px;
  bottom: 140px;
  width: 180px;
  height: 180px;

  font-family: 'Helvetica Neue';
  color: white;
  /* background: blue; */
`

export const className = `
  ul {
    margin: 0;
    font-size: 12px;
  }

  h1 {
    margin: 0 0 4px;
    font-size: 16px;
  }

  h2 {
    margin: 2px 0 0;
    font-size: 13px;
  }
`

const Events = ({ title, events }) => {
  events = events.map(x => {
    let event = x[0]
    let calendar = x[1]

    return <li key={event}>{event}</li>
  })

  return (
    <div>
      <h2>{title}</h2>
      <ul>{events}</ul>
    </div>
  )
}

export const render = ({ events }) => {
  if (events.length == 0) {
    return <Container>No Upcoming Events</Container>
  }

  return (
    <Container>
      <h1>Upcoming Events</h1>
      <Events title="Today" events={events[0]} />
      <Events title="Tomorrow" events={events[1]} />
      <Events title="Day After" events={events[2]} />
    </Container>
  )
}

export const initialState = {
  events: [],
}

export const updateState = ({ output }, previousState) => {
  let lines = output.split('\n')

  let date = lines.pop()

  const bullet = lines[0][0]

  // Filter out all lines that aren't event headers or dates
  lines = lines.filter(
    x => x.startsWith(bullet) || x.search('(today|tomorrow)') !== -1
  )

  let events = []

  console.log(lines)

  for (let i = 0; i < lines.length - 1; i += 2) {
    lines[i] = lines[i]
      .substr(2)
      .match(/(.*)\s\((.*)\)/)
      .splice(1)

    if (lines[i + 1].trim().startsWith('today')) {
      if (events[0] == null) events[0] = []
      events[0].push(lines[i])
    }

    if (lines[i + 1].trim().startsWith('tomorrow')) {
      if (events[1] == null) events[1] = []
      events[1].push(lines[i])
    }

    if (lines[i + 1].trim().startsWith('day after')) {
      if (events[2] == null) events[2] = []
      events[2].push(lines[i])
    }
  }

  console.log(events)

  return {
    events,
    date,
  }
}
