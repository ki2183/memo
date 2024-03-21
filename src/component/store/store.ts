import urlInputCheckSlice from './slices/urlInputCheck';
import { configureStore } from '@reduxjs/toolkit'
import  themeSlice  from './slices/theme'
import modalInfoSlice from './slices/modalInfo';
import textSlice from './slices/text'
import imgsSlice from './slices/imgs';
import NavStateSlice from './slices/navState';

export const store = configureStore({
  reducer: {
    theme : themeSlice,
    modalInfo: modalInfoSlice,
    text:textSlice,
    urlInputCheck:urlInputCheckSlice,
    imgs:imgsSlice,
    navState:NavStateSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch