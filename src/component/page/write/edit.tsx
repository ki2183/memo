import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import "./edit.css"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from "react-dnd-html5-backend";
import OptionModal from "./Parts_write/Modal/editModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { EditNavTop } from "../../components/editerNav";
import { title_hooks_keyDown, title_hooks_onChange } from "./Hooks_write/titlehooks";
import EditorField from "./Parts_write/Editor_field/EditorField";
import { adjustTextAreaHeight } from "./Hooks_write/etcFCN";
import { change_imgs, imgstype } from "../../store/slices/imgs";
import { changeText_arr } from "../../store/slices/text";

export type img_url_tf_type = {
    tf:boolean,
    idx:number
}

type memoDTO_type = {
    title:string
    text:string[]
    imgs:imgstype[]
}

function Edit(){

    const [title, setTitle] = useState<string>("") //제목
    const titleRef = useRef<HTMLTextAreaElement>(null)
    const textsRef = useRef<Array<HTMLTextAreaElement|null>>([]) //for animation
    const [forNewTextFocusing,setForNewTextFocusing] = useState<boolean>(false)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [openURL,setOpenURL] = useState<img_url_tf_type>({tf:false,idx:0})
    const text = useAppSelector(state => state.text)
    const imgs = useAppSelector(state => state.imgs)
    const dispatch = useAppDispatch()

    useLayoutEffect(()=>{
        const getDto_JSON = localStorage.getItem("memo")
        const getDto = getDto_JSON ? JSON.parse(getDto_JSON) as memoDTO_type : null 
        console.log(getDto)
        if(getDto){
            const {title,imgs,text}= getDto
            
            if(title !== "" && (title !== undefined && title !== null)){
                setTitle(title)
            }
            if(text.length > 0){
                dispatch(changeText_arr(text))
            }if(imgs.length > 0){
                dispatch(change_imgs(imgs))
            }
        }
    },[])

    useEffect(()=>{
        const memoDTO = {
            title:title,
            text:text,
            imgs:imgs
        }
        const memoDTO_JSON = JSON.stringify(memoDTO)
        const timer = setTimeout(()=>{
            localStorage.setItem("memo", memoDTO_JSON);
        },5 * 60 * 1000) 

        return ()=>{
            clearTimeout(timer)
        }
    },[])

    const test = () =>{
        const memoDTO = {
            title:title,
            text:text,
            imgs:imgs
        }
        const memoDTO_JSON = JSON.stringify(memoDTO)
        console.log(memoDTO_JSON)
        localStorage.setItem("memo", memoDTO_JSON);
    }

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
    },[]) //초기 textarea Height 설정
  
    //#endregion
    
    useEffect(()=>{ 
        textsRef.current[text.length-1]?.focus()
    },[forNewTextFocusing,text.length]) //마지막 인덱스 포커싱

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container-edit">
                <EditNavTop/>
                <div className="frame-edit">
                    <OptionModal 
                        textsRef={textsRef}
                        modalOpen={modalOpen} 
                        img_URL_open={img_URL_open}
                        modal_close={modal_close}
                        new_textArea_focusing={new_textArea_focusing}
                    />

                    <div/>
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
                            <div className="fixed w-4 h-4 bg-slate-400 text-blue-50"
                            onClick={test}>임시저장</div>
                            {
                                (text.length > 0) && text.map((item:string,idx:number)=>{

                                    const max = text.length-1

                                    return (
                                        <EditorField
                                            key={idx}
                                            idx={idx}
                                            max={max}
                                            imgs={imgs}
                                            textsRef={textsRef}                                            
                                            modal_open={modal_open}
                                            modal_close={modal_close}
                                            openURL={openURL}
                                            img_URL_close={img_URL_close}
                                            new_textArea_focusing={new_textArea_focusing}
                                        />
                                    )

                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    )
}

export default Edit

