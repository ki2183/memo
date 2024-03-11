import EditNav from "../../components/editerNav"
import Nav from "../../components/nav/nav"
import './mainPage.css'
function MainPage(){
    return(
        <div className="w-screen h-screen flex">
            {/* <Nav/> */}
            <EditNav></EditNav>
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