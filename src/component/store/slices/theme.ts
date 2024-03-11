import { darkTheme, lightTheme, themeType } from '../../../style/theme';
import { RootState } from './../store';
import { createSlice } from '@reduxjs/toolkit'


const initialState: themeType = lightTheme

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme: (state) =>{
        if(state.theme === 'light'){
            state.bgColor = darkTheme.bgColor
            state.borderColor = darkTheme.borderColor
            state.textColor = darkTheme.textColor
            state.toggleColor = darkTheme.toggleColor
            state.navColor = darkTheme.navColor
            state.navBorder = darkTheme.navBorder
            state.theme = darkTheme.theme
        }else{
            state.bgColor = lightTheme.bgColor
            state.borderColor = lightTheme.borderColor
            state.textColor = lightTheme.textColor
            state.toggleColor = lightTheme.toggleColor
            state.navColor = lightTheme.navColor
            state.navBorder = lightTheme.navBorder
            state.theme = lightTheme.theme
        }
    }
  },
})

export const { changeTheme } = themeSlice.actions

export const selectTheme = (state: RootState) => state.theme

export default themeSlice.reducer