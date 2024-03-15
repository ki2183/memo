import { RootState } from '../store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type modal_type = "text_modal"|"img_modal"

export type ModalInfoType = {
    x:number,
    y:number,
    idx:number,
    height:number,
    modal_type: modal_type
}

const initialState: ModalInfoType  = {
    x:0,
    y:0,
    idx:0,
    height:0,
    modal_type:"text_modal"
}

export const modalInfoSlice = createSlice({
  name: 'modalInfo',
  initialState,
  reducers: {
    getModalInfo: (state,action:PayloadAction<ModalInfoType>) =>{
      const {x,y,idx,height,modal_type} = action.payload
       state.x = x
       state.y = y 
       state.idx = idx
       state.height = height
       state.modal_type = modal_type
    }
  },
})

export const { getModalInfo } = modalInfoSlice.actions

export const selectTheme = (state: RootState) => state.modalInfo

export default modalInfoSlice.reducer