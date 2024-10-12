
import { MainFst } from './parts/main_fst'
import Page from '../../components/Page'
import './mainPage.css'

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