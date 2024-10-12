
import "./edit.css"
import gsap from "gsap";
import axios from "axios";
import { DndProvider } from 'react-dnd'
import { useLocation } from "react-router-dom";
import  NavTop  from "../../components/nav/nav_top";
import { HTML5Backend } from "react-dnd-html5-backend";
import OptionModal from "./Parts_write/modal/editModal";
import { changeText_arr } from "../../store/slices/text";
import { adjustTextAreaHeight } from "./Hooks_write/etcFCN";
import { change_imgs, imgstype } from "../../store/slices/imgs";
import EditorField from "./Parts_write/editor_field/editor_field";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { EditorSave } from "./Parts_write/editor_save/editor_save";
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { title_hooks_keyDown, title_hooks_onChange } from "./Hooks_write/titlehooks";

export type img_url_tf_type = {
    tf:boolean,
    idx:number
}

type memoDTO_type = {
    title:string
    text:string[]
    imgs:imgstype[]
}

type prevStack_type = {
    texts:string[]
    imgs:imgstype[]
    focusIdx:number
}

function Edit(){

    const [title, setTitle] = useState<string>("") //제목
    const titleRef = useRef<HTMLTextAreaElement>(null)
    const textsRef = useRef<Array<HTMLTextAreaElement|null>>([]) //for animation
    const [forNewTextFocusing,setForNewTextFocusing] = useState<boolean>(false)
    const [autoSaveAni,setAutoSaveAni] = useState<boolean>(false)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [openURL,setOpenURL] = useState<img_url_tf_type>({tf:false,idx:0})
    const text = useAppSelector(state => state.text)
    const imgs = useAppSelector(state => state.imgs)
    const [prevStack,setPrevStack] = useState<prevStack_type[]>([])
    const prevStackLimitRef = useRef<boolean>(false)
    const ctrl_z_LimitRef = useRef<boolean>(false)
    const [focusCur,setFocusCur] = useState<number>(0)
    const location = useLocation()
    const { state } = location
    const dispatch = useAppDispatch()
    const get_token = sessionStorage.getItem('token')
    const token = get_token ? JSON.parse(get_token) : null

    const apiURL = process.env.REACT_APP_API_URL

    const setMemoDTO = () =>{
        const memoDTO = {
            title:title,
            text:text,
            imgs:imgs
        }
        const memoDTO_JSON = JSON.stringify(memoDTO)
        const memo_id = state && state.memo_id ? state.memo_id : null
        if(location.pathname === "/memo"){
            updateMemo(memo_id)
        }else{
            sessionStorage.setItem("memo", memoDTO_JSON)
        }
        setAutoSaveAni(!autoSaveAni)
    }
    useEffect(()=>{
        const timer = setTimeout(()=>{
            setMemoDTO()
        },2 * 10 * 1000) 
        return ()=>{
            clearTimeout(timer)
        }
    },[setMemoDTO]) //임시저장 자동저장

    useEffect(()=>{
        const dto = {   
            texts:text,
            imgs:imgs,
            focusIdx:focusCur
        } as prevStack_type

        const push_stack = () => {
            setPrevStack(prev=>[...prev,dto])
        }

        const push_full_stack = () =>{
            const prev = [...prevStack]
            prev.splice(0,1)
            prev.push(dto)
            setPrevStack(prev)
        }
        
        if(prevStackLimitRef.current === false && ctrl_z_LimitRef.current === false){
            prevStackLimitRef.current = true
            prevStack.length < 100 ? push_stack() : push_full_stack()
            setTimeout(()=>{
                prevStackLimitRef.current = false
            },1 * 1000) 
        }else if(ctrl_z_LimitRef.current === true){
            ctrl_z_LimitRef.current = false
        }
    },[text,imgs]) //ctrl + z 할 스택들
    
    useEffect(()=>{
        if(state && state.memo_id){
            const getDto = () =>{
                const initial_dto = {
                    user_id:token._id,
                    token:token.token,
                    memo_id:state.memo_id
                } 
                axios.post(`${apiURL}/memos/viewMemo`,JSON.stringify(initial_dto),{
                    headers:{
                        "Content-Type":'application/json'
                    }
                })
                    .then(res =>{
                        const getDto = res.data.memos[0]
                        setTitle(getDto.title)
                        dispatch(changeText_arr(getDto.text))
                        dispatch(change_imgs(getDto.imgs))
                    })
                    .catch(err => console.log(err))
            }
            getDto()
        }
        
        setTimeout(()=>{        
        },1000)

    },[])

    useEffect(()=>{
        const getDto_JSON = sessionStorage.getItem("memo")
        const getDto = getDto_JSON ? JSON.parse(getDto_JSON) as memoDTO_type : null 

        if(location.pathname === "/write" && getDto !== null){
            const setDto = async() => {
                if(getDto.title){
                    setTitle(getDto.title)
                }
                if(text.length > 0){
                    dispatch(changeText_arr(getDto.text))
                }if(imgs.length > 0){
                    dispatch(change_imgs(getDto.imgs))
                }
            }
            setDto()
        }
    },[location])

    /* OpenClose FCN */
    //#region

    const img_URL_open = (idx:number)=> setOpenURL({tf:true,idx})
    const img_URL_close = () => setOpenURL({ tf: false, idx: 0 });
    const modal_open = ()=> setModalOpen(true)
    const modal_close = ()=> setModalOpen(false)

    //#endregion

    const new_textArea_focusing = () =>{ //의존성 tf의미 없음
        setForNewTextFocusing(!forNewTextFocusing)
    }

    /* title_height_compute */
    useLayoutEffect(()=>{
        if(titleRef.current)
            adjustTextAreaHeight(titleRef.current)
    },[]) //렌더 되고 height를 구해야해서 useLayoutEffect 사용
  
    //#endregion
    
    useEffect(()=>{ 
        textsRef.current[text.length-1]?.focus()
    },[forNewTextFocusing]) //마지막 인덱스 포커싱

    const ctrl_z_handler = () =>{
        if(prevStack.length > 0){
            const prevDto = prevStack.pop()
            if(prevDto?.texts !== undefined){
                const text = prevDto.texts
                const idx = prevDto.focusIdx
                ctrl_z_LimitRef.current = true
                dispatch(changeText_arr(text))
                textsRef.current[idx]?.focus()
            }
            setPrevStack(prevStack)
        }
    }

    const updateMemo =  (memo_id:string) =>{
        
        if(!state.memo_id) return

        const dto = {
            user_id:token._id,
            memo_id:memo_id,
            token:token.token,
            memo:{
                title,
                text: text,
                imgs: imgs,
            }
        }

        axios.post(`${apiURL}/memos/updateMemo`,dto,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then(res => console.log('저동저장'))
        .catch(err => console.log(err))
    
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container-edit">
                <AutoSave autoSaveAni={autoSaveAni}/>
                <NavTop/>
                <div className="frame-edit">
                    <OptionModal 
                        textsRef={textsRef}
                        modalOpen={modalOpen} 
                        modal_close={modal_close}
                        img_URL_open={img_URL_open}
                        new_textArea_focusing={new_textArea_focusing}
                    />

                    <div id="divide-area"/>

                    <div>
                        <textarea 
                            ref={titleRef}
                            value={title}
                            spellCheck="false" 
                            placeholder="제목을 입력하세요." 
                            className="title-edit edit-textarea-title" 
                            onKeyDown={e=>title_hooks_keyDown({e,textsRef})}
                            onChange={e=>title_hooks_onChange({e,setTitle})}
                        />

                        <div className="frame-memos">
                            {
                                (text.length > 0) && text.map((item:string,idx:number)=>{

                                    const max = text.length-1

                                    return (
                                        <EditorField
                                            key={idx}
                                            idx={idx}
                                            max={max}
                                            imgs={imgs}
                                            openURL={openURL}
                                            textsRef={textsRef}
                                            setFocusCur={setFocusCur}                                            
                                            modal_open={modal_open}
                                            modal_close={modal_close}
                                            ctrl_z_handler={ctrl_z_handler}
                                            img_URL_close={img_URL_close}
                                            new_textArea_focusing={new_textArea_focusing}
                                        />
                                    )

                                })
                            }
                        </div>
                        
                    </div>
                </div>

                <EditorSave title={title}/>

            </div>
        </DndProvider>
    )
}

export default Edit

// autoSaveSwitch,setAutoSaveSwitch

export type AutoSave_type ={
    autoSaveAni:boolean,
}

function AutoSave({
    autoSaveAni,
    // ,setAutoSaveAni
}:AutoSave_type){
    const [limit,setLimit] = useState<boolean>(false)
    const theme = useAppSelector(state => state.theme)


    useEffect(()=>{
        if(limit===false){
            setLimit(true)
        }else{
            const tl = gsap.timeline()
            tl.set('.container-auto-save',{
                opacity:0,
            })
            tl.set('.auto-save-bar',{
                left:"-1%"
            })
            tl.to('.container-auto-save',{
                duration:0.1,
                opacity:1,
                ease: "power1.inOut"
            })
            tl.to('.auto-save-bar',{
                left:"100%",
                duration:2,
                ease:"power1.inOut"
            })
            tl.to('.container-auto-save',{
                duration:0.1,
                opacity:0
            })
            tl.play()
        }
        
    },[autoSaveAni])

    const get_token = sessionStorage.getItem('token')
    const token = get_token ? JSON.parse(get_token) : null
    

    return (
        <div className="container-auto-save" style={{
            color:theme.textColor
        }}>
            <div>{token && token.token ? "임시저장":"자동저장"}</div>
            <div 
                className="auto-save-bar"
                style={{
                    backgroundColor:theme.textColor
                }}    
            />
        </div>
    )
}


