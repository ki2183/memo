import { useEffect, useRef, useState } from "react"
import "./editor_save.css"
import gsap from "gsap"
import { useAppSelector } from "../../../../store/hooks"
import axios from "axios"

type EditorSave_type = {
    title:string
}

export function EditorSave({title}:EditorSave_type){

    const get_token = localStorage.getItem('token')
    const token = get_token ? JSON.parse(get_token) : null

    const textArr = useAppSelector(state => state.text)
    const imgArr = useAppSelector(state => state.imgs)

    const save_new_memo = () => {
        const dto = {
            token:token.token,
            user_id : token._id,
            memo:{
                title,
                text: textArr,
                imgs: imgArr,
            }
        }
        axios.post('/memos/pushMemo',dto,{
            headers: {
                'Content-Type': 'application/json'
              }
        })
        .then(res => console.log(res.data))
        .catch(err => console.log(err))
    }
//     router.post('/pushMemo',(req,res)=>{
//     const {user_id,token,memo} = req.body
//     secureRouteWithTimeout(res,Memo.pushByMemo(user_id,memo),token,10000)
// }) //C
   const update_existing_memo = ()=> {

   }


    return (
        <div style={{
            position:"fixed",
            top:"95%",
            left:"95%",
            cursor:"pointer"
        }}
        onClick={(e)=>{
            e.preventDefault()
            save_new_memo()
        }}
        >
            저장
        </div>
    )
}