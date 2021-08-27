import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface UserEvent {
  id: number
  title: string
  dateStart: string
  dateEnd: string
}

interface UserEventsSlice {
  byIds: Record<UserEvent['id'], UserEvent>
  allIds: UserEvent['id'][]
  status: string | undefined
}

const initialState: UserEventsSlice = {
  byIds: {},
  allIds: [],
  status: 'idle',
}

export const fetchUserEvents = createAsyncThunk<
  UserEvent[],
  void,
  { rejectValue: string | undefined }
>('fetchUserEvents', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:3001/events')
    return await response.json()
  } catch (e) {
    return rejectWithValue('failed')
  }
})

export const userEventsSlice = createSlice({
  name: 'userEvents',
  initialState,
  reducers: {
    initial: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(fetchUserEvents.fulfilled, (state, action) => {
      const events = action.payload
      state.allIds = events.map(({ id }) => id)
      state.byIds = events.reduce<UserEventsSlice['byIds']>((byIds, event) => {
        byIds[event.id] = event
        return byIds
      }, {})
    })
    builder.addCase(fetchUserEvents.rejected, (state, action) => {
      state.status = action.payload
    })
  },
})

export default userEventsSlice.reducer
