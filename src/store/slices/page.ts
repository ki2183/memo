import { RootState } from '../store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type pageNum_type = {
    pageNum:number,
    pageMax:number,
}

const initialState: pageNum_type  = {
    pageNum:0,
    pageMax:0
}

export const pageNumberSlice = createSlice({
    name: 'pageNum',
    initialState,
    reducers: {
        changePageNum:(state,action:PayloadAction<number>)=>{
            state.pageNum = action.payload
        },
        changePageMax:(state,action:PayloadAction<number>)=>{
            state.pageMax = action.payload
        }
    }
})

export const { changePageNum, changePageMax } = pageNumberSlice.actions
export const selectTheme = (state: RootState) => state.pageNumber
export default pageNumberSlice.reducer