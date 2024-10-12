import { RootState } from '../store';
import { createSlice } from '@reduxjs/toolkit'

type nav_state = {
    nav_total:boolean
    nav_menu:boolean
}

const initialState: nav_state  = {
    nav_total:true,
    nav_menu:true
}

export const NavStateSlice = createSlice({
    name: 'navState',
    initialState,
    reducers: {
        change_nav_total:(state)=>{
            state.nav_total = !state.nav_total
            return state 
        },
        change_nav_menu:(state)=>{
            state.nav_menu = !state.nav_menu
            return state
        }
    }
})

export const { change_nav_total, change_nav_menu } = NavStateSlice.actions
export const selectTheme = (state: RootState) => state.navState
export default NavStateSlice.reducer