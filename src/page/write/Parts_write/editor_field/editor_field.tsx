import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { add_text_moveMent, del_text_movement, dndImg_to_text_type, dnd_img_to_text, imgstype, pushNewImg } from "../../../../store/slices/imgs"
import { addText, addText_between, delText, lineBreakText, writeText } from "../../../../store/slices/text"
import { adjustTextAreaHeight, computeModalInfo } from "../../Hooks_write/etcFCN"
import { useAppDispatch, useAppSelector } from "../../../../store/hooks"
import KeyboardHandlerHooks from "../../Hooks_write/textareahooks"
import { getModalInfo } from "../../../../store/slices/modalInfo"
import urlHooks from "../../Hooks_write/urlhooks"
import ImgMolecules from "../img_field/img_field"
import URLfield from "../url_field/url_field"
import { img_url_tf_type } from "../../edit"
import { useDrop } from "react-dnd"
import "./editor_field.css"

export type EditorField_type = {
    idx:number
    max:number
    ctrl_z_handler: () => void
    new_textArea_focusing:()=> void
    textsRef:React.MutableRefObject<(HTMLTextAreaElement | null)[]>
}

interface memoInterface extends EditorField_type {
    openURL:img_url_tf_type
    imgs:imgstype[]
    modal_open: ()=> void
    modal_close: ()=> void
    img_URL_close:()=>void
    setFocusCur:React.Dispatch<React.SetStateAction<number>>
}

type img_drag_type = {
    img_index:number
}

function EditorField({  
    idx,
    max,
    openURL,
    textsRef,
    modal_open,
    setFocusCur,
    img_URL_close,
    ctrl_z_handler,
    new_textArea_focusing,
}:memoInterface){

    /** const **/
    //#region
    
    const [urlText,setURLText] = useState<string>("")
    const [placeholder,setPlaceholder] = useState<string>("")

    const urlRef = useRef<HTMLDivElement>(null)

    const dispatch = useAppDispatch()
    const text = useAppSelector(state=> state.text)

    const [,drop] = useDrop({
        accept:"img",
        drop(item) {
            const arrIdx = item as img_drag_type
            const dndDto = {
                arrIdx:arrIdx.img_index,
                willchangeIdx:idx      
            } as dndImg_to_text_type
            dispatch(dnd_img_to_text(dndDto))
        },
    }) //dropRef

    //#endregion


    /** textarea size event **/
    //#region

    const textArea_resize = ()=>{
        if(textsRef.current && textsRef.current[idx] !== null)
            adjustTextAreaHeight(textsRef.current[idx]!)
    }

    useLayoutEffect(()=>{
        textArea_resize()
    },[]) //초기 textarea 높이 설정

    useEffect(()=>{
            window.addEventListener('resize',textArea_resize)
        return ()=>{
            window.removeEventListener('resize',textArea_resize)
        }
    },[])

     //#endregion

    /** handler **/
    //#region

    /** TextArea **/
    const onChangeHandler_textArea = (e:React.ChangeEvent<HTMLTextAreaElement>) =>{
        e.preventDefault()
        dispatch(writeText({idx,newText:e.target.value}))
        adjustTextAreaHeight(e.target)
    } //text 쓰기

    const onFocusHandler_textArea = (e:React.FocusEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        img_URL_close()
        setPlaceholder("텍스트를 입력하세요")
    } //text 포커스하면 url칸 닫힘 + placeHolder 텍스트 추가

    const onBlurHandler_textArea = (e:React.FocusEvent<HTMLTextAreaElement>)=> {
        e.preventDefault()
        setPlaceholder("")  
        setURLText("")
    } //text 포커스하면 url칸 닫힘 + placeHolder 텍스트 초기화

    const keyDownHandler_textArea = (e:React.KeyboardEvent<HTMLTextAreaElement>)=>{
        KeyboardHandlerHooks({
            e,
            idx, 
            max, 
            text, 
            textsRef, 
            ctrl_z_handler,
            lineBreak_text,
            addText_Between,
            addText:add_text, 
            delText:del_text,
            del_text_Movement,
            add_text_Movement,
            new_textArea_focusing,
        })
    }

    /** 옵션 **/
    function onChangeHandler_option(e:React.MouseEvent<HTMLDivElement>){
        const modalInfo = computeModalInfo(e,idx,"text_modal")
        dispatch(getModalInfo(modalInfo))
        modal_open()
    } // 모달 열기 + 위치,정보 푸쉬

    /** URL **/
    const textReset_URL = () => setURLText("")

    const onChangeHandler_URL = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setURLText(e.target.value)
    }
    const keyDownHandler_URL = (e:React.KeyboardEvent<HTMLInputElement>)=>{
        urlHooks({
            e,
            max,
            idx:idx,
            url:urlText,
            new_textArea_focusing,
            img_URL_close,
            NewPushImgs,
            add_text,
        })
    }

    //#endregion

    /** dispatch => function **/
    //#region
    const NewPushImgs = (idx:number,url:string) => {
        dispatch(pushNewImg({idx,url}))
    }
    const del_text = (idx_:number) => {
        dispatch(delText({idx:idx_}))
    }
    const add_text = () =>{
        dispatch(addText())
    }
    const del_text_Movement = () =>{
        dispatch(del_text_movement(idx))
    }
    const add_text_Movement = () =>{
        dispatch(add_text_moveMent(idx))
    }
    const addText_Between = ()=>{
        dispatch(addText_between(idx))
    }
    const lineBreak_text = (curText:string,nextText:string) => {
       dispatch(lineBreakText({
        curIdx:idx,
        curText,
        nextText
       }))
    }

    //#endregion

    return (
        <div ref={drop}>
            <div className="memo" key={idx}>
                <div/>    
                <textarea 
                    value={text[idx]}
                    spellCheck="false"
                    className="edit-text"
                    placeholder={placeholder}
                    ref={el => {
                        textsRef.current[idx] = el
                        drop(el)
                        if(el){
                            el.addEventListener('focus',()=>setFocusCur(idx))
                        }
                    }}
                    onBlur={onBlurHandler_textArea}
                    onFocus={onFocusHandler_textArea}
                    onKeyDown={keyDownHandler_textArea} 
                    onChange={onChangeHandler_textArea} 
                />

                <div
                    className="option-button" 
                    onClick={onChangeHandler_option}
                >
                    <span className="material-symbols-outlined">
                        more_vert
                    </span>
                </div>
            </div>

            <URLfield
                idx={idx}
                urlRef={urlRef}
                urlText={urlText}
                openURL={openURL}
                textReset_URL={textReset_URL}
                onChangeHandler_URL={onChangeHandler_URL}
                keyDownHandler_URL={keyDownHandler_URL}
            />
            <ImgMolecules
                EditorField_idx={idx}
                modal_open={modal_open}
            />
        </div>
    )
}
export default EditorField