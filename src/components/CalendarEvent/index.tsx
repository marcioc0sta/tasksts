import React, { ReactElement } from 'react'
import { useDispatch } from 'react-redux'

import { deleteUserEvent, UserEvent } from 'redux/user-events'

type CalendarEventProps = {
  event: UserEvent
}

const CalendarEvent = ({ event }: CalendarEventProps): ReactElement => {
  const dispatch = useDispatch()

  const handleDelete = (): void => {
    dispatch(deleteUserEvent(event.id))
  }

  return (
    <div className='calendar-event'>
      <div className='calendar-event-info'>
        <div className='calendar-event-time'>10:00 - 12:00</div>
        <div className='calendar-event-title'>{event.title}</div>
      </div>
      <button onClick={handleDelete} className='calendar-event-delete-button'>
        &times;
      </button>
    </div>
  )
}

export default CalendarEvent
