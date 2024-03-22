
import { NavRight } from '../../components/nav/nav_left'
import './mainPage.css'
function MainPage(){
    return(
        <div className="w-screen h-screen flex">
            <NavRight/>
            <MainPageContainer/>
        </div>
    )
}

export default MainPage

function MainPageContainer(){
    return(
        <div className="container-mainPage">

        </div>
    )
}