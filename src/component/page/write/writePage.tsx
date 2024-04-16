import './writePage.css'
import { NavRight } from "../../components/nav/nav_left"
import Edit from "./edit"
import { useEffect, useState } from 'react'
import axios from 'axios'

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

    const [loading,setLoading] = useState<boolean>(false)
    const token = localStorage.getItem('token')

    useEffect(()=>{
        console.log(token)
        axios.post('/memos/checkToken',token,{
            headers:{
                "Content-Type":"application/json"
            }
        })
            .then(res => {
                console.log(res.data)
                setLoading(res.data)
            })
            .catch(err=>console.log(err))
    },[])
   

    return(
        <div className="container-write">
            <div className="background-write">
                <div/>
                {!loading ? <div className='absolute top-1/4 left-1/3'>로딩중...</div> : <Edit/>}
            </div>
        </div>
    )
}