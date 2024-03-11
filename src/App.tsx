import './App.css';
import { Route, Routes } from 'react-router-dom';
import MainPage from './component/page/main/mainPage';
import { GlobalStyle } from './style/GlobalStyle';
import { useAppSelector } from './component/store/hooks';
import WritePage from './component/page/write/writePage';



function App(){

  const theme = useAppSelector(state => state.theme)

  

  return (
    <>
      <GlobalStyle theme={theme}/>
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/home' element={<MainPage/>}/>
        <Route path='/list' element={<MainPage/>}/> 
        <Route path='/write' element={<WritePage/>}/>
        <Route path='/about' element={<MainPage/>}/>
      </Routes>
    </>
    
  )
}

export default App;