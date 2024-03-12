import { darkTheme, lightTheme, themeType } from '../../../style/theme';
import { RootState } from './../store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type mouseXYType = {
    x:number,
    y:number
}

const initialState: mouseXYType  = {
    x:0,
    y:0
}

export const mouseXYSlice = createSlice({
  name: 'mouseXY',
  initialState,
  reducers: {
    getXY: (state,action:PayloadAction<mouseXYType>) =>{
       state.x = action.payload.x
       state.y = action.payload.y 
    }
  },
})

export const { getXY } = mouseXYSlice.actions

export const selectTheme = (state: RootState) => state.mouseXY

export default mouseXYSlice.reducer