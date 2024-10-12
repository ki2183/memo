import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

const initialState:number = 0

export const imgIdxSlice = createSlice({
    name:"imgIdx",
    initialState,
    reducers:{
        changeImgIdx:(state,action:PayloadAction<number>)=>{
            const idx = action.payload
            return idx
        },
    }
})

export const { 
    changeImgIdx
    } = imgIdxSlice.actions
export const selectTheme = (state: RootState) => state.imgIdx
export default imgIdxSlice.reducer


