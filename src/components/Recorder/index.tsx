import cx from 'classnames'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './recorder.css'
import { addZero } from 'lib/utils'
import { START, STOP } from 'redux/recorder'
import { RootState } from 'redux/store'

import { postUserEvent } from '../../redux/user-events'

const Recorder = (): ReactElement => {
  const dispatch = useDispatch()
  const { dateStart } = useSelector((state: RootState) => state.recorder)
  const [, setCount] = useState<number>(0)
  const started = dateStart !== ''
  const interval = useRef<number>(0)

  const handleClick = (): void => {
    if (started) {
      window.clearInterval(interval.current)
      dispatch(postUserEvent())
      dispatch(STOP())
      return
    }
    dispatch(START())
    interval.current = window.setInterval(() => {
      setCount(count => count + 1)
    }, 1000)
  }

  let sec = started
    ? Math.floor((Date.now() - new Date(dateStart).getTime()) / 1000)
    : 0

  const hrs = sec ? Math.floor(sec / 60 / 60) : 0
  sec -= hrs * 60 * 60

  const min = sec ? Math.floor(sec / 60) : 0
  sec -= min * 60

  useEffect(() => {
    return () => {
      window.clearInterval(interval.current)
    }
  }, [])

  return (
    <div className={cx('recorder', { 'recorder-started': started })}>
      <button onClick={handleClick} className='recorder-record'>
        <span />
      </button>
      <div className='recorder-counter'>
        {addZero(hrs)}:{addZero(min)}:{addZero(sec)}
      </div>
    </div>
  )
}

export default Recorder
