import { configureStore } from '@reduxjs/toolkit'
import  themeSlice  from './slices/theme'
import mouseXYSlice from './slices/mouseXY'
import textSlice from './slices/text'

export const store = configureStore({
  reducer: {
    theme : themeSlice,
    mouseXY: mouseXYSlice,
    text:textSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch