import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

export type imgSort = "flex-start"|"center"|"flex-end"
export type imgRate = number | string

type imgstype = {
    url:string,
    idx:number,
    sort:imgSort,
    rate:imgRate,
}

// const cZam = {
//     url:"data:image/jpeg;base64,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",
//     idx:0,
//     sort:"flex-end",
//     rate:80
// } as imgstype

export type pushNewImg_type = {
    url:string,
    idx:number,
}

type changeSortImg_type = {
    sort:imgSort,
    idx:number
}
type changeRateImg_type = {
    rate:number|"auto",
    idx:number
}

const initialState:imgstype[] = []

export const imgsSlice = createSlice({
    name:"imgs",
    initialState,
    reducers:{
        pushNewImg:(state, action:PayloadAction<pushNewImg_type>)=>{
            const {url,idx} = action.payload
            state.push({url,idx,rate:"auto",sort:"flex-start"})
        },
        delImg:(state,action:PayloadAction<number>)=>{
            if(state.length > 0)
                state.splice(action.payload,1)
        },
        moveImg:(state,action:PayloadAction<number>)=>{
            if(state.length > 0)
                state[action.payload].idx = state[action.payload].idx - 1 
        },
        changeSortImg:(state,action:PayloadAction<changeSortImg_type>)=>{
            const {idx,sort} = action.payload
            if(state.length > 0)
                state[idx].sort = sort
        },
        changeRateImg:(state,action:PayloadAction<changeRateImg_type>)=>{
            const {idx,rate} = action.payload
            if(state.length > 0)
                state[idx].rate = rate
        },
        dndImg:(state,action:PayloadAction)=>{

        }
    }
})

export const { pushNewImg,delImg,moveImg,changeRateImg,changeSortImg,dndImg } = imgsSlice.actions
export const selectTheme = (state: RootState) => state.imgs
export default imgsSlice.reducer