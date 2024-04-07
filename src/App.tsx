import './App.css';
import { Route, Routes } from 'react-router-dom';
import MainPage from './component/page/main/mainPage';
import { GlobalStyle } from './style/GlobalStyle';
import { useAppDispatch, useAppSelector } from './component/store/hooks';
import WritePage from './component/page/write/writePage';
import { useEffect } from 'react';
import { themeType } from './style/theme';
import { changeTheme } from './component/store/slices/theme';
import MemosPage from './component/page/memos/memosPage';
import LoginPage from './component/page/login/login';
import JoinPage from './component/page/join/join';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient()

function App(){

  const theme = useAppSelector(state => state.theme)
  const dispatch = useAppDispatch()

  useEffect(()=>{
    const theme_local = localStorage.getItem('theme')
    const theme_ = theme_local ? JSON.parse(theme_local) as themeType : null 
    
    if((theme_ !== null && theme_.theme) && theme_.theme === "dark"){
      dispatch(changeTheme())  
    }
  },[])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle theme={theme}/>
        <Routes>
          <Route path='/' element={<MainPage/>}/>
          <Route path='/main' element={<MainPage/>}/>
          <Route path='/memos' element={<MemosPage/>}/> 
          <Route path='/write' element={<WritePage/>}/>
          <Route path='/viewMemo' element={<MemosPage/>}/>
          <Route path='/about' element={<MainPage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/join' element={<JoinPage/>}/>
        </Routes>
      </QueryClientProvider>
    </>
    
  )
}

export default App;