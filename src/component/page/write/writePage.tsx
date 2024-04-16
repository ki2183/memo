import './writePage.css'
import { NavRight } from "../../components/nav/nav_left"
import Edit from "./edit"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

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

    // const [loading,setLoading] = useState<boolean>(false)
    // const token = localStorage.getItem('token')
    // const navigate = useNavigate()
    // const location = useLocation()
    // useEffect(()=>{
        
    //     if(location.pathname === '/wrtie'){
    //         setLoading(true)
    //         return
    //     }

    //     axios.post('/memos/checkToken',token,{
    //         headers:{
    //             "Content-Type":"application/json"
    //         }
    //     })
    //         .then(res => {
    //             setTimeout(()=>{
    //                 res.data ? setLoading(true) : navigate('/login')
    //             },1000)
                
    //         })
    //         .catch(err=>console.log(err))
    // },[])
   

    return(
        <div className="container-write">
            <div className="background-write">
                <div/>
                <Edit/>
            </div>
        </div>
    )
}