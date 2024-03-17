import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

export type imgSort = "flex-start"|"center"|"flex-end"
export type imgRate = number | string

export type imgstype = {
    url:string,
    idx:number,
    sort:imgSort,
    rate:imgRate,
}

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
export type dndImg_to_text_type = {
    arrIdx:number
    willchangeIdx:number
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
        dnd_img_to_img:(state,action:PayloadAction<dndImg_to_text_type>)=>{
            const {arrIdx,willchangeIdx} = action.payload

            if(state.length > 0){

                const state_mirror = [...state];
                state[arrIdx] = { ...state[willchangeIdx] };
                state[willchangeIdx] = { ...state_mirror[arrIdx] };
                if(state_mirror[arrIdx].idx !== state_mirror[willchangeIdx].idx){
                    state[arrIdx].idx = state_mirror[arrIdx].idx
                    state[willchangeIdx].idx = state_mirror[willchangeIdx].idx 
                }
            }
        },
        dnd_img_to_text:(state,action:PayloadAction<dndImg_to_text_type>)=>{
            const {arrIdx,willchangeIdx} = action.payload
            const state_mirror = [...state][arrIdx]
            state_mirror.idx = willchangeIdx
            state.splice(arrIdx,1)
            state.push(state_mirror)
        },del_text_movement:(state,action:PayloadAction<number>)=>{
            const deleted_idx = action.payload          
            state.forEach((item)=>{
                if(item.idx >= deleted_idx){
                    item.idx = item.idx - 1 
                }
            })
        },add_text_moveMent:(state,action:PayloadAction<number>)=>{
            const added_idx = action.payload
            state.forEach((item)=>{
                if(item.idx >= added_idx){
                    item.idx = item.idx + 1 
                }
            })
        }
    }
})

export const { 
        pushNewImg,
        delImg, 
        moveImg, 
        changeRateImg, 
        changeSortImg,
        dnd_img_to_img,
        dnd_img_to_text,
        del_text_movement,
        add_text_moveMent
    } = imgsSlice.actions
export const selectTheme = (state: RootState) => state.imgs
export default imgsSlice.reducer