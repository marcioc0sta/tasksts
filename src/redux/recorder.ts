import { createSlice } from '@reduxjs/toolkit'

interface RecordSlice {
  dateStart: string
}

const initialState: RecordSlice = {
  dateStart: '',
}

export const recorderSlice = createSlice({
  name: 'userEvents',
  initialState,
  reducers: {
    START: (state: RecordSlice) => {
      return { ...state, dateStart: new Date().toISOString() }
    },
    STOP: (state: RecordSlice) => {
      return { ...state, dateStart: '' }
    },
  },
})

export const { START, STOP } = recorderSlice.actions
export default recorderSlice.reducer
