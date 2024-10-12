import { RootState } from '../store';
import { createSlice } from "@reduxjs/toolkit"

type modalState = {
    option:boolean
    url:boolean,
    sort:boolean,
}

const initialState:modalState = {
    option:false,
    sort:false,
    url:false,
}

export const imgModalStateSlice = createSlice({
    name:"imgModalState",
    initialState,
    reducers:{
        OptionModalOpen:(state)=>{
            return {
                option:true,
                sort:false,
                url:false,
            }
        },
        URLModalOpen:(state)=>{
            return {
                option:false,
                sort:false,
                url:true,
            }
        },
        ALLModalClose:(state)=>{
            return {
                option:false,
                sort:false,
                url:false,
            }
        },
        SortModalOpen:(state)=>{
            return {
                option:true,
                sort:true,
                url:false,
            }
        },SortModalClose:(state)=>{
            return {
                option:true,
                sort:false,
                url:false,
            }
        },
    }
})

export const { 
    URLModalOpen,
    ALLModalClose,
    SortModalOpen,
    SortModalClose,
    OptionModalOpen,
    } = imgModalStateSlice.actions

export const selectTheme = (state: RootState) => state.imgModalState
export default imgModalStateSlice.reducer

//이렇게 만드니까 실패함