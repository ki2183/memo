import urlInputCheckSlice from './slices/urlInputCheck';
import { configureStore } from '@reduxjs/toolkit'
import  themeSlice  from './slices/theme'
import modalInfoSlice from './slices/modalInfo';
import textSlice from './slices/text'
import imgsSlice from './slices/imgs';
import NavStateSlice from './slices/navState';
import pageNumberSlice from './slices/page';
import  optionXYSlice  from './slices/optionXY';
import imgModalSlice from './slices/imgModal';
import ImgObjSlice from './slices/imgObj';
import imgIdxSlice  from './slices/imgIdx';
import  imgModalStateSlice  from './slices/imgModalState';

export const store = configureStore({
  reducer: {
    theme : themeSlice,
    modalInfo: modalInfoSlice,
    text:textSlice,
    urlInputCheck:urlInputCheckSlice,
    imgs:imgsSlice,
    navState:NavStateSlice,
    pageNumber:pageNumberSlice,
    optionXY:optionXYSlice,
    imgModal:imgModalSlice,
    imgObj:ImgObjSlice,
      
    imgIdx:imgIdxSlice,
    imgModalState:imgModalStateSlice
    
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch