import './writePage.css'
import NavRight from "../../components/nav/nav_left"
import Edit from "./edit"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useMemoPageHook from '../../useHook/memos/memosApiHooks'

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
    const {checkToken} = useMemoPageHook()
    const [loading,setLoading] = useState<boolean>(false)
    
    useEffect(()=>{
        checkToken()
    },[])
   

    return(
        <div className="container-write">
            <div className="background-write">
                <div/>
                <Edit/>
            </div>
        </div>
    )
}