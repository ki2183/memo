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
            const {bgColor,borderColor,modalBackground,navBorder,navColor,textColor,theme,toggleColor} = darkTheme
            state.bgColor = bgColor
            state.borderColor = borderColor
            state.textColor = textColor
            state.toggleColor = toggleColor
            state.navColor = navColor
            state.navBorder = navBorder
            state.theme = theme
            state.modalBackground = modalBackground

        }else{
          const {bgColor,borderColor,modalBackground,navBorder,navColor,textColor,theme,toggleColor} = lightTheme
          state.bgColor = bgColor
          state.borderColor = borderColor
          state.textColor = textColor
          state.toggleColor = toggleColor
          state.navColor = navColor
          state.navBorder = navBorder
          state.theme = theme
          state.modalBackground = modalBackground
        }
    }
  },
})

export const { changeTheme } = themeSlice.actions

export const selectTheme = (state: RootState) => state.theme

export default themeSlice.reducer