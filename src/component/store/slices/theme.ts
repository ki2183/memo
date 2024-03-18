import { darkTheme, lightTheme, themeType } from '../../../style/theme';
import { RootState } from './../store';
import { createSlice } from '@reduxjs/toolkit'


const initialState: themeType = lightTheme

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme: (state) =>{
      console.log('바뀜')
        if(state.theme === 'light'){
          localStorage.setItem('theme', JSON.stringify(darkTheme))
          return { ...state, ...darkTheme };

        }else{
          localStorage.setItem('theme', JSON.stringify(lightTheme))
          return { ...state, ...lightTheme };
          
        }
    }
  },
})

export const { changeTheme } = themeSlice.actions

export const selectTheme = (state: RootState) => state.theme

export default themeSlice.reducer