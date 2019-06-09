/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const sundayFirstCalendar = 'cal -h && date "+%-m %-d %y"'

const mondayFirstCalendar = `cal -h | awk \'{ print " "$0; getline; print "Mo Tu We Th Fr Sa Su"; \
getline; if (substr($0,1,2) == " 1") print "                    1 "; \
do { prevline=$0; if (getline == 0) exit; print " " \
substr(prevline,4,17) " " substr($0,1,2) " "; } while (1) }\' && date "+%-m %-d %y"`

export const command = mondayFirstCalendar

//Set this to true to enable previous and next month dates, or false to disable
const otherMonths = true

export const refreshFrequency = 3600000

export const className = `
bottom: 140px;
right: 44px;

color: #fff;
font-family: 'Helvetica Neue';

table {
    border-collapse: collapse;
    table-layout: fixed;
}

td {
    text-align: center;
}

thead tr:first-child td {
      font-size: 24px;
      font-weight: 100;
}

thead tr:last-child td {
      font-size: 11px;
      padding-bottom: 10px;
      font-weight: 300;
}

tbody td {
    font-size: 12px;
}

.day {
    text-align: center;
    width: 16px;
    height: 16px;
    padding: 4px;
    display: block;
}

.today {
    font-weight: bold;
    background: white;
    color: black;
    mix-blend-mode: screen;
    border-radius: 50%;
}

.grey {
    color: rgba(255,255,255, .5);
}

.month {
   margin-right: 10px;
   font-weight: 300;
}

.year {
    color: #d8271b;
}
`

const Header = ({ month, year, dayOfWeek }) => {
  const days = dayOfWeek.map(day => <td key={day}>{day}</td>)

  return (
    <thead>
      <tr>
        <td colSpan="7">
          <span className="month">{month}</span>
          <span className="year">{year}</span>
        </td>
      </tr>
      <tr>{days}</tr>
    </thead>
  )
}

const Body = ({ month, date, year, weeks }) => {
  let lengths = [31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30]

  if (year % 4 === 0) {
    lengths[2] = 29
  }

  const rows = weeks.map((week, i) => {
    const days = week.split(/\s+/).filter(day => day.length > 0)

    if (i == 0 && days.length < 7) {
      for (let j = 7 - days.length; j > 0; j--) {
        const k = 6 - j

        days.unshift(`grey ${lengths[month - 1] - k}`)
      }
    }

    let cells = days.map(day => {
      let grey = day.startsWith('grey')

      day = day.replace(/\D/g, '')

      let classes = 'day'
      if (day == date) classes += ' today'
      if (grey) classes += ' grey'

      return (
        <td key={day}>
          <span className={classes}>{day}</span>
        </td>
      )
    })

    return <tr key={i}>{cells}</tr>
  })

  return <tbody>{rows}</tbody>
}

export const render = ({ header, body, initialLoad }) => {
  if (!initialLoad) return null

  return (
    <table>
      <Header {...header} />
      <Body {...body} />
    </table>
  )
}

function updateBody(rows, table) {
  return (() => {
    const result = []
    for (let i = 0; i < rows.length; i++) {
      var cell, j
      const week = rows[i]
      var days = week.split(/\s+/).filter(day => day.length > 0)
      var tableRow = $('<tr></tr>').appendTo(tbody)

      if (i === 0 && days.length < 7) {
        var asc
        for (
          j = days.length, asc = days.length <= 7;
          asc ? j < 7 : j > 7;
          asc ? j++ : j--
        ) {
          if (this.otherMonths === true) {
            const k = 6 - j
            cell = $(`<td>${lengths[month - 1] - k}</td>`).appendTo(tableRow)
            cell.addClass('grey')
          } else {
            cell = $('<td></td>').appendTo(tableRow)
          }
        }
      }

      for (let day of Array.from(days)) {
        day = day.replace(/\D/g, '')
        const cellText = $(`<span class='day'>${day}</span>`)
        if (day === date) {
          cellText.addClass('today')
        }
        cell = $('<td></td>')
          .append(cellText)
          .appendTo(tableRow)
      }

      if (
        i !== 0 &&
        (0 < days.length && days.length < 7) &&
        this.otherMonths === true
      ) {
        result.push(
          (() => {
            let asc1, end
            const result1 = []
            for (
              j = 1, end = 7 - days.length, asc1 = 1 <= end;
              asc1 ? j <= end : j >= end;
              asc1 ? j++ : j--
            ) {
              cell = $(`<td>${j}</td>`).appendTo(tableRow)
              result1.push(cell.addClass('grey'))
            }
            return result1
          })()
        )
      } else {
        result.push(undefined)
      }
    }
    return result
  })()
}

export const initialState = {
  initialLoad: false,
}

export const updateState = ({ output }, previousState) => {
  let rows = output.split('\n')

  // Header
  rows[0] = rows[0].trim().split(' ')

  const header = {
    month: rows[0][0],
    year: rows[0][1],
    dayOfWeek: rows[1].split(/\s+/),
  }

  // Body
  rows.splice(0, 2)
  rows.pop()

  const today = rows.pop().split(/\s+/)

  const body = {
    month: today[0],
    date: today[1],
    year: today[2],
    weeks: rows,
  }

  return {
    ...previousState,
    initialLoad: true,
    rows,
    header,
    body,
  }
}
