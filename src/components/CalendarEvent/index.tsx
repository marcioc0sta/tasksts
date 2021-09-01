import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import { deleteUserEvent, UserEvent } from 'redux/user-events'

type CalendarEventProps = {
  event: UserEvent
}

const CalendarEvent = ({ event }: CalendarEventProps): ReactElement => {
  const [isEditable, setIsEditable] = useState(false)
  const [title, setTitle] = useState(event.title)
  const dispatch = useDispatch()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDelete = (): void => {
    dispatch(deleteUserEvent(event.id))
  }

  const handleClick = (): void => {
    setIsEditable(!isEditable)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value)
  }

  const handleBlur = (): void => {
    if (title !== event.title) {
      console.log('dispatch update')
    }
    setIsEditable(false)
  }

  useEffect(() => {
    if (isEditable) {
      inputRef.current?.focus()
    }
  }, [isEditable])

  return (
    <div className='calendar-event'>
      <div className='calendar-event-info'>
        <div className='calendar-event-time'>10:00 - 12:00</div>
        <div onClick={handleClick} className='calendar-event-title'>
          {isEditable ? (
            <input
              ref={inputRef}
              onChange={handleChange}
              onBlur={handleBlur}
              value={title}
              type='text'
            />
          ) : (
            <>{title}</>
          )}
        </div>
      </div>
      <button onClick={handleDelete} className='calendar-event-delete-button'>
        &times;
      </button>
    </div>
  )
}

export default CalendarEvent
