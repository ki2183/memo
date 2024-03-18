import { RootState } from './../store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type textType = string[]

type writeTextType = {
    idx:number,
    newText:string
}

type delTextType = {
    idx:number,
}

const initialState: textType  = [""]

export const textSlice = createSlice({
    name: 'text',
    initialState,
    reducers: {
        addText:(state)=>{
            state.push("")
        },
        addText_between:(state, action:PayloadAction<number>)=>{
            const idx = action.payload
            state.splice(idx+1,0,"")
        },
        writeText:(state,action:PayloadAction<writeTextType>)=>{
            const {idx,newText} = action.payload
            state[idx] = newText
        },
        delText:(state,action:PayloadAction<delTextType>)=>{
            const {idx} = action.payload
            state.splice(idx,1)
        },
        changeText_arr:(state,action:PayloadAction<string[]>)=>{
            return action.payload
        }
    }
})

export const { addText,writeText,delText,addText_between,changeText_arr} = textSlice.actions
export const selectTheme = (state: RootState) => state.text
export default textSlice.reducer