import './App.css';
import { useEffect } from 'react';
import JoinPage from './page/join/join'; 
import LoginPage from './page/login/login';
import MainPage from './page/main/mainPage';
import WritePage from './page/write/writePage';
import MemosPage from './page/memos/memosPage'; 
import { changeTheme } from './store/slices/theme';
import WritePageVer2 from './page/writeVer2/writePage';

import { useAppDispatch, useAppSelector } from './store/hooks';
import { Route, Routes } from 'react-router-dom';
import { GlobalStyle } from './style/GlobalStyle';

const App = ()=> {

  const theme = useAppSelector(state => state.theme)
  const dispatch = useAppDispatch()

  useEffect(()=>{


    const theme_local = localStorage.getItem('theme')

    if (theme_local === "light") dispatch(changeTheme())

    else if (theme_local !== "dark" && theme_local) {
      const theme_= JSON.parse(theme_local)

      if (theme_.theme !== null && theme_.theme === "light") dispatch(changeTheme())
    }


  },[])

  return (
    <>
        <GlobalStyle theme={theme}/>
        <Routes>
          <Route path='/' element={<MainPage/>}/>
          <Route path='/main' element={<MainPage/>}/>
          <Route path='/memos' element={<MemosPage/>}/> 
          <Route path='/write' element={<WritePage/>}/>
          <Route path='/memo' element={<WritePage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/join' element={<JoinPage/>}/>
          <Route path='/write2' element={<WritePageVer2/>}/>
        </Routes>
    </>
    
  )
}

export default App;