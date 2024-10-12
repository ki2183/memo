import { useEffect, useRef, useState } from "react"
import "./editor_save.css"
import gsap from "gsap"
import { useAppSelector } from "../../../../store/hooks"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { resetText } from "../../../../store/slices/text"
import { reset_imgs } from "../../../../store/slices/imgs"

type EditorSave_type = {
    title:string
}

export function EditorSave({title}:EditorSave_type){

    const get_token = sessionStorage.getItem('token')
    const token = get_token ? JSON.parse(get_token) : null
    const navigate = useNavigate()
    const {state} = useLocation()
    
    const apiURL = process.env.REACT_APP_API_URL

    const textArr = useAppSelector(state => state.text)
    const imgArr = useAppSelector(state => state.imgs)
    const dispatch = useDispatch()

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
        axios.post(`${apiURL}/memos/pushMemo`,dto,{
            headers: {
                'Content-Type': 'application/json'
              }
        })
        .then(res => console.log(res.data))
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

        axios.post(`${apiURL}/memos/updateMemo`,dto,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then(res => console.log(res.data))
        .catch(err => console.log(err))
    }

    const delMemo = () =>{
        const dto = {
            user_id:token._id,
            memo_id:state.memo_id,
            token:token.token,
        }
        axios.post(`${apiURL}/memos/delMemo`,dto,{
            headers:{
                "Content-Type":"application/json"
            }
        }).then(res => {
            console.log(res)
            window.location.href = '/memos'
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="fixed cursor-pointer flex gap-2" style={{
            top:"95%",
            right:"5%",
        }}
        >
            {state && state.memo_id ? 
                (<div
                    onClick={e=>{e.preventDefault(); delMemo();}}
                >
                    삭제    
                </div>)
                :null}
            <div
                onClick={(e)=>{
                    e.preventDefault()
                    if(state && state.memo_id){
                        update_memo()
                    }else{
                        save_new_memo()
                    }
                    sessionStorage.removeItem('memo')
                    navigate('/memos')
                    dispatch(resetText())
                    dispatch(reset_imgs())
                }}>
                저장
            </div>
        </div>
    )
}