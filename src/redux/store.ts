import { configureStore } from '@reduxjs/toolkit'

import userEvents from './user-events'

export const store = configureStore({
  reducer: {
    userEvents,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
