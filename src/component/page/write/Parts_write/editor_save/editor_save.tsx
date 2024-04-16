import "./editor_save.css"
import { useAppSelector } from "../../../../store/hooks"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { resetText } from "../../../../store/slices/text"
import { reset_imgs } from "../../../../store/slices/imgs"
import { useState } from "react"
import { changePageNum } from "../../../../store/slices/page"

type EditorSave_type = {
    title:string
}

export function EditorSave({title}:EditorSave_type){

    const get_token = localStorage.getItem('token')
    const token = get_token ? JSON.parse(get_token) : null
    const navigate = useNavigate()
    const {state,pathname} = useLocation()
    

    const textArr = useAppSelector(state => state.text)
    const imgArr = useAppSelector(state => state.imgs)
    const dispatch = useDispatch()
    const [modal_type,setModal_type] = useState<"del"|"save"|"update">("save")
    const [modalIsOpen,setModalIsOpen] = useState<boolean>(false)

    const openModal = () => {
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

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
        .catch(err => navigate('/memos'))
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
        .catch(err => navigate('/memos'))
    }

    const delete_memo = () =>{
        if(pathname !== "/memo" || (!state || !state.memo_id)) return
        const dto = {
            user_id:token._id,
            memo_id:state.memo_id,
            token:token.token
        }
        axios.post('/memos/delMemo',dto,{ headers:{ "Content-Type":"application/json"}})
            .then(res => {
                dispatch(changePageNum(0))
                navigate('/memos')
            })
            .catch(err => navigate('/memos'))

    }

    return (
        <div className="fixed cursor-pointer flex gap-2" style={{
            top:"95%",
            right:"5%",
        }}
        >
            {state && state.memo_id ? 
                (<div
                    onClick={e=>{
                        e.preventDefault()
                        setModal_type('del')
                        openModal()
                    }}    
                >
                    삭제    
                </div>)
                :null}
            <div
                onClick={(e)=>{
                    e.preventDefault()
                    if(state && state.memo_id){
                        setModal_type("update")
                    }else{
                        setModal_type("save")
                    }
                    openModal()
                }}>
                저장
            </div>
            <SaveDeleteModal 
                tf={modalIsOpen}
                closeModal={closeModal}
                modal_type={modal_type}
                FNC={modal_type === "save" ? save_new_memo : (modal_type === "del" ? delete_memo : update_memo)}
            />
        </div>
    )
}
type SaveDeleteModal_type = {
    tf : boolean
    closeModal: ()=> void
    FNC:()=>void
    modal_type : "del"|"save"|"update"
}
function SaveDeleteModal({tf,closeModal,FNC,modal_type}:SaveDeleteModal_type){

    const {borderColor,bgColor} = useAppSelector(state => state.theme)    

    const modal_style = {
        borderRight: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        backgroundColor:bgColor,
        width:'300px',
        height:'120px'
    }

    const button_style = {
        borderRight: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`
    }

    return (
        <div 
            onClick={e=>{e.preventDefault(); closeModal()}}
            className="fixed  items-center justify-center z-10 w-screen h-screen top-0 left-0" style={{backgroundColor:"#75757542",display: tf ? `flex`:`none` }}
        >
            <div onClick={e=>e.stopPropagation()} className="cursor-default flex rounded-md flex-col justify-center items-center gap-5" style={modal_style}>
                <span className="font-mono">{modal_type === "del" ? "삭제하시겠습니까?": "저장하시겠습니까?" }</span>
                <div className="flex gap-10">
                    <span onClick={e => {e.preventDefault(); FNC()}} style={button_style} className="select-none cursor-pointer font-mono flex items-center justify-center w-16 h-6 text-sm">예</span>
                    <span onClick={e=>{e.preventDefault(); closeModal()}} style={button_style} className="select-none cursor-pointer font-mono flex items-center justify-center w-16 h-6 text-sm">아니요</span>
                </div>
            </div>
        </div>
    )
}