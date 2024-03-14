import { imgsType } from './../../page/write/edit';
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

type imgstype = {
    url:string,
    idx:number,
}

const initialState:imgstype[] = []

export const imgsSlice = createSlice({
    name:"imgs",
    initialState,
    reducers:{
        pushNewImg:(state, action:PayloadAction<imgstype>)=>{
            state.push(action.payload)
        },
        delImg:(state,action:PayloadAction<number>)=>{
            state.splice(action.payload,1)
        },
        dndImg:(state,action:PayloadAction)=>{

        }
    }
})

export const { pushNewImg,delImg,dndImg } = imgsSlice.actions
export const selectTheme = (state: RootState) => state.imgs
export default imgsSlice.reducer