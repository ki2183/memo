import './writePage.css'
import { NavRight } from "../../components/nav/nav_left"
import Edit from "./edit"

function WritePage(){
    return(
        <div className="h-screen flex">
            <NavRight/>
            <WritePageContainer/>
        </div>
    )
}

export default WritePage

function WritePageContainer(){

    return(
        <div className="container-write">
            <div className="background-write">
                <div/>
                <Edit/>
            </div>
        </div>
    )
}