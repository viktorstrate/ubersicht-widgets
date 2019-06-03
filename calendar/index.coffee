sundayFirstCalendar = 'cal -h && date "+%-m %-d %y"'

mondayFirstCalendar =  'cal -h | awk \'{ print " "$0; getline; print "Mo Tu We Th Fr Sa Su"; \
getline; if (substr($0,1,2) == " 1") print "                    1 "; \
do { prevline=$0; if (getline == 0) exit; print " " \
substr(prevline,4,17) " " substr($0,1,2) " "; } while (1) }\' && date "+%-m %-d %y"'

command: sundayFirstCalendar

#Set this to true to enable previous and next month dates, or false to disable
otherMonths: true

refreshFrequency: 3600000

style: """
  bottom: 140px
  right: 44px

  color: #fff
  font-family: Helvetica Neue

  table
    border-collapse: collapse
    table-layout: fixed

  td
    text-align: center


  thead tr
    &:first-child td
      font-size: 24px
      font-weight: 100

    &:last-child td
      font-size: 11px
      padding-bottom: 10px
      font-weight: 300

  tbody td
    font-size: 12px

  .day
    text-align: center
    width: 16px
    height: 16px
    padding: 4px
    display block

  .today
    font-weight: bold
    background: rgba(#fff, 1)
    color black
    mix-blend-mode: screen
    border-radius: 50%

  .grey
    color: rgba(#fff, .5)

  .month
   margin-right 10px
   font-weight 300

  .year
    color #d8271b
"""

render: -> """
  <table>
    <thead>
    </thead>
    <tbody>
    </tbody>
  </table>
"""


updateHeader: (rows, table) ->
  thead = table.find("thead")
  thead.empty()

  rows[0] = rows[0].trim().split(' ')

  thead.append "<tr><td colspan='7'><span class='month'>#{rows[0][0]}</span><span class='year'>#{rows[0][1]}</span></td></tr>"
  tableRow = $("<tr></tr>").appendTo(thead)
  daysOfWeek = rows[1].split(/\s+/)

  for dayOfWeek in daysOfWeek
    tableRow.append "<td>#{dayOfWeek}</td>"

updateBody: (rows, table) ->
  #Set to 1 to enable previous and next month dates, 0 to disable
  PrevAndNext = 1

  tbody = table.find("tbody")
  tbody.empty()

  rows.splice 0, 2
  rows.pop()

  today = rows.pop().split(/\s+/)
  month = today[0]
  date = today[1]
  year = today[2]

  lengths = [31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30]
  if year%4 == 0
    lengths[2] = 29

  for week, i in rows
    days = week.split(/\s+/).filter((day) -> day.length > 0)
    tableRow = $("<tr></tr>").appendTo(tbody)

    if i == 0 and days.length < 7
      for j in [days.length...7]
        if @otherMonths == true
          k = 6 - j
          cell = $("<td>#{lengths[month-1]-k}</td>").appendTo(tableRow)
          cell.addClass("grey")
        else
          cell = $("<td></td>").appendTo(tableRow)

    for day in days
      day = day.replace(/\D/g, '')
      cellText = $("<span class='day'>#{day}</span>")
      cellText.addClass("today") if day == date
      cell = $("<td></td>").append(cellText).appendTo(tableRow)

    if i != 0 and 0 < days.length < 7 and @otherMonths == true
      for j in [1..7-days.length]
        cell = $("<td>#{j}</td>").appendTo(tableRow)
        cell.addClass("grey")

update: (output, domEl) ->
  rows = output.split("\n")
  table = $(domEl).find("table")

  @updateHeader rows, table
  @updateBody rows, table