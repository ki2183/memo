import { RootState } from './../store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type urlInputCheckType = {
    idx:number,
    tf:boolean
}

const initialState: urlInputCheckType  = {
    idx:0,
    tf:false
}

export const urlInputCheckSlice = createSlice({
  name: 'urlInputCheck',
  initialState,
  reducers: {
    getTFIdx: (state,action:PayloadAction<urlInputCheckType>) =>{
        const {idx,tf} = action.payload
        state.idx = idx
        state.tf = tf
    }
  },
})

export const { getTFIdx } = urlInputCheckSlice.actions

export const selectTheme = (state: RootState) => state.urlInputCheck

export default urlInputCheckSlice.reducer