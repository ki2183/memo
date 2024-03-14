import { useEffect, useRef, useState } from "react"
import Nav from "../../components/nav/nav"
import './writePage.css'
import { text } from "stream/consumers"
import EditNav, { EditNavTop } from "../../components/editerNav"
import Edit from "./edit"

function WritePage(){
    return(
        <div className="h-screen flex">
            <EditNav/>
            <WritePageContainer/>
        </div>
    )
}

export default WritePage

function WritePageContainer(){

    const [text,setText] = useState<string>("")

    useEffect(()=>{
        console.log(text)
    },[text])

    return(
        <div className="container-write">
            <div className="background-write">
                <div/>
                <Edit/>
            </div>
        </div>
    )
}