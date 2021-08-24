import { configureStore } from '@reduxjs/toolkit'

import recorder from './recorder'
import userEvents from './user-events'

export const store = configureStore({
  reducer: {
    userEvents,
    recorder,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
