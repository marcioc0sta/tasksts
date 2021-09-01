import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'

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
    console.log(e)
    return rejectWithValue('fetchUserEvents-failed')
  }
})

export const postUserEvent = createAsyncThunk<
  UserEvent,
  void,
  { state: RootState; rejectValue: string | undefined }
>('postUserEvent', async (_, { getState, rejectWithValue }) => {
  try {
    const dateStart = new Date(getState().recorder.dateStart).toISOString()
    const event: Omit<UserEvent, 'id'> = {
      title: 'No name',
      dateStart,
      dateEnd: new Date().toISOString(),
    }
    const response = await fetch('http://localhost:3001/events', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(event),
    })
    const createdEvent: UserEvent = await response.json()
    return createdEvent
  } catch (e) {
    console.log(e)
    return rejectWithValue('postUserEvent-failed')
  }
})

export const deleteUserEvent = createAsyncThunk<
  number,
  number,
  { rejectValue: string | undefined }
>('deleteUserEvent', async (deletedId, { rejectWithValue }) => {
  try {
    await fetch(`http://localhost:3001/events/${deletedId}`, {
      method: 'DELETE',
    })
    return deletedId
  } catch (e) {
    console.log(e)
    return rejectWithValue('deleteUserEvent-failed')
  }
})

export const updateUserEvent = createAsyncThunk<
  UserEvent,
  UserEvent,
  { rejectValue: string | undefined }
>('updateUserEvent', async (event, { rejectWithValue }) => {
  try {
    const response = await fetch(`http://localhost:3001/events/${event.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })
    const updatedEvent: UserEvent = await response.json()
    return updatedEvent
  } catch (e) {
    console.log(e)
    return rejectWithValue('deleteUserEvent-failed')
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
    builder.addCase(postUserEvent.fulfilled, (state, action) => {
      const event = action.payload
      state.allIds = [...state.allIds, event.id]
      state.byIds = { ...state.byIds, [event.id]: event }
    })
    builder.addCase(postUserEvent.rejected, (state, action) => {
      state.status = action.payload
    })
    builder.addCase(deleteUserEvent.fulfilled, (state, action) => {
      const dId = action.payload
      const byIds = state.byIds
      const { [dId]: number, ...rest } = byIds
      state.byIds = rest
      state.allIds = state.allIds.filter(storedId => storedId !== dId)
    })
    builder.addCase(deleteUserEvent.rejected, (state, action) => {
      state.status = action.payload
    })
    builder.addCase(updateUserEvent.fulfilled, (state, action) => {
      const updatedEvent = action.payload
      state.byIds = { ...state.byIds, [updatedEvent.id]: updatedEvent }
    })
  },
})

export default userEventsSlice.reducer
