import { useEffect, useRef, useState } from "react"
import "./editor_save.css"
import gsap from "gsap"
import { useAppSelector } from "../../../../store/hooks"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"

type EditorSave_type = {
    title:string
}

export function EditorSave({title}:EditorSave_type){

    const get_token = localStorage.getItem('token')
    const token = get_token ? JSON.parse(get_token) : null
    const navigate = useNavigate()
    const {state} = useLocation()
    

    const textArr = useAppSelector(state => state.text)
    const imgArr = useAppSelector(state => state.imgs)

    const save_new_memo = () => {
        if(!token) {alert('로그인하세요!'); return}
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
        .then(res => navigate('/memos'))
        .catch(err => console.log(err))
    }

    const update_memo = () =>{
        if(!token||!state.memo_id){
            alert("서버 통신 오류")
            return
        }
        const dto = {
            user_id:token._id,
            memo_id:state.memo_id,
            token:token.token,
            memo:{
                title,
                text: textArr,
                imgs: imgArr,
            }
        }

        axios.post('/memos/updateMemo',dto,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then(res => navigate('/memos'))
        .catch(err => console.log(err))
    }

    return (
        <div className="fixed cursor-pointer flex gap-2" style={{
            top:"95%",
            right:"5%",
        }}
        onClick={(e)=>{
            e.preventDefault()
            if(state && state.memo_id){
                update_memo()
            }else{
                save_new_memo()
            }
            localStorage.removeItem('memo')
        }}
        >
            <div>
                삭제    
            </div>
            <div>
                저장
            </div>
        </div>
    )
}