
import { useEffect } from 'react'
import Page from '../Page'
import './mainPage.css'
import { MainFst } from './parts/main_fst'
function MainPage(){

    return(
        <Page>
            <div className="w-full h-full flex justify-center ">
                <MainFst/>
            </div>
        </Page>
    )
}

export default MainPage