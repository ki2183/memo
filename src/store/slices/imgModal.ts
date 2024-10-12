import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

const initialState:boolean = false

export const imgModalSlice = createSlice({
    name:"imgModal",
    initialState,
    reducers:{
        OpenImgModal:(state)=>{
            return true
        },
        CloseImgModal:(state)=>{
            return false
        },
    }
})

export const { 
    OpenImgModal,
    CloseImgModal,
    } = imgModalSlice.actions
export const selectTheme = (state: RootState) => state.imgModal
export default imgModalSlice.reducer