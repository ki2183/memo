
import { useEffect } from 'react'
import Page from '../Page'
import './mainPage.css'
import { MainFst } from './parts/main_fst'
function MainPage(){

    useEffect(()=>{
        console.log(localStorage.getItem('memo'))
    },[])

    return(
        <Page>
            <div className="w-full h-full flex justify-center ">
                <MainFst/>
            </div>
        </Page>
    )
}

export default MainPage