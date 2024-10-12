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

export type lineBreak_type = {
    curIdx:number,
    curText:string,
    nextText:string,
}

const initialState: textType  = [""]

export const textSlice = createSlice({
    name: 'text',
    initialState,
    reducers: {
        addText:(state)=>{
            state.push("")
        },
        addTextModal:(state, action:PayloadAction<number>)=>{
            const length = state.length - 1
            const idx = action.payload
            if(idx === length) state.push('')
            else state.splice(idx+1,0,"")
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
            if(idx !== 0) state.splice(idx,1)
        },
        changeText_arr:(state,action:PayloadAction<string[]>)=>{
            return action.payload
        },
        dividedText:(state,action:PayloadAction<{idx:number,cursor:number,text:string}>)=>{
            const {idx,cursor,text} = action.payload
            const arr = [...state]

            const frontText = text.slice(0,cursor)
            const beforeText = text.slice(cursor)

            arr.splice(idx,1,...[frontText,beforeText])
            
            return arr
        },
        lineBreakText:(state,action:PayloadAction<lineBreak_type>)=>{
            const {curIdx,curText,nextText} = action.payload
            const textarr = [curText,nextText]
            state.splice(curIdx,1,...textarr)
        },
        resetText:(state)=>{
            return [""]
        },
        prevTextAddup:(state,action:PayloadAction<number>)=>{
            const idx = action.payload
            const arr = [...state]
            // console.log(arr)
            // console.log(arr[idx]+arr[idx - 1])
            // console.log(state[idx - 1] + state[idx])
            const newText = [...state].slice(idx-1,idx+1).join('')
            // console.log(newText)
            state.splice(idx-1,2,newText)
        },
        //텍스트 첫번째 커서에서 엔터 (텍스트가 존재할 때)
        moveTextAndCreate:(state,action:PayloadAction<{idx:number, text:string}>)=>{
            const {idx, text} = action.payload
            state.splice(idx, 1, "", text)
        }
    }
})

export const { addTextModal, dividedText,prevTextAddup,addText,writeText,delText,addText_between,changeText_arr,lineBreakText,resetText, moveTextAndCreate} = textSlice.actions
export const selectTheme = (state: RootState) => state.text
export default textSlice.reducer