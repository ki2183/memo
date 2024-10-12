import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';


interface IoptionXY{
    idx:number
    top:number
}

const initialState: IoptionXY  = {
    idx:0,
    top:0,
}

export const optionXYSlice = createSlice({
    name: 'optionXY',
    initialState,
    reducers: {
        setOptionXY:(state,action:PayloadAction<IoptionXY>)=>{
            return action.payload
        },
     
    }
})

export const { setOptionXY } = optionXYSlice.actions
export const selectTheme = (state: RootState) => state.optionXY
export default optionXYSlice.reducer