import React, { ReactElement, useEffect } from 'react'
import './calendar.css'
import { useDispatch, useSelector } from 'react-redux'

import { addZero } from 'lib/utils'
import { RootState } from 'redux/store'
import { fetchUserEvents, UserEvent } from 'redux/user-events'

import CalendarEvent from '../CalendarEvent'

const createDateKey = (date: Date): string => {
  const day = date.getUTCDate()
  const month = date.getUTCMonth() + 1
  const year = date.getUTCFullYear()

  return `${year}-${addZero(month)}-${addZero(day)}`
}

const groupByDay = (events: UserEvent[]): Record<string, UserEvent[]> => {
  const groups: Record<string, UserEvent[]> = {}
  const addToGroup = (dateKey: string, event: UserEvent) => {
    if (groups[dateKey] === undefined) {
      groups[dateKey] = []
    }

    groups[dateKey].push(event)
  }

  events.forEach(event => {
    const dateStartKey = createDateKey(new Date(event.dateStart))
    const dateEndKey = createDateKey(new Date(event.dateEnd))

    addToGroup(dateStartKey, event)

    if (dateEndKey !== dateStartKey) {
      addToGroup(dateEndKey, event)
    }
  })

  return groups
}

const Calendar = (): ReactElement => {
  const dispatch = useDispatch()
  const { userEvents } = useSelector((state: RootState) => state)
  const events: UserEvent[] = userEvents.allIds.map(id => userEvents.byIds[id])

  let groupedEvents: ReturnType<typeof groupByDay> | undefined
  let sortedGroupKeys: string[] | undefined

  if (events.length) {
    groupedEvents = groupByDay(events)
    sortedGroupKeys = Object.keys(groupedEvents).sort(
      (date1, date2) => +new Date(date2) - +new Date(date1)
    )
  }

  useEffect(() => {
    dispatch(fetchUserEvents())
  }, [])

  return groupedEvents && sortedGroupKeys ? (
    <div className='calendar'>
      {sortedGroupKeys.map(dayKey => {
        const groups = groupedEvents ? groupedEvents[dayKey] : []
        const groupDate = new Date(dayKey)
        const day = groupDate.getDate()
        const month = groupDate.toLocaleString(undefined, { month: 'long' })

        return (
          <div key={dayKey} className='calendar-day'>
            <div className='calendar-day-label'>
              <span>
                {day} {month}
              </span>
            </div>
            <div className='calendar-events'>
              {groups.map(event => (
                <CalendarEvent key={event.id} event={event} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  ) : (
    <p>loading...</p>
  )
}

export default Calendar
