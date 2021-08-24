import { createSlice } from '@reduxjs/toolkit'

interface UserEvent {
  id: number
  title: string
  dateStart: string
  dateEnd: string
}

interface UserEventsSlice {
  byIds: Record<UserEvent['id'], UserEvent>
  allIds: UserEvent['id'][]
}

const initialState: UserEventsSlice = {
  byIds: {},
  allIds: [],
}

export const userEventsSlice = createSlice({
  name: 'userEvents',
  initialState,
  reducers: {
    initial: () => initialState,
  },
})

export default userEventsSlice.reducer
