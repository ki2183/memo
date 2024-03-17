import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import "./edit.css"

import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from "react-dnd-html5-backend";
import OptionModal from "./Parts_write/Modal/editModal";
import { useAppSelector } from "../../store/hooks";
import { useDispatch } from "react-redux";
import { addText, addText_between, delText, writeText } from "../../store/slices/text";
import gsap from "gsap";
import { EditNavTop } from "../../components/editerNav";
import { add_text_moveMent, del_text_movement, dndImg_to_text_type, dnd_img_to_img, dnd_img_to_text, imgRate, imgSort, imgstype, pushNewImg } from "../../store/slices/imgs";
import urlHooks from "./Hooks_write/urlhooks";
import KeyboardHandlerHooks from "./Hooks_write/textareahooks"
import { ModalInfoType, getModalInfo, modal_type } from "../../store/slices/modalInfo";

export const adjustTextAreaHeight = (element:HTMLTextAreaElement) => {
    element.style.height = '0px'
    const scrollHeight = element.scrollHeight;
    element.style.height = scrollHeight + 'px'
}

export function computeModalInfo(e:React.MouseEvent<HTMLDivElement>,idx:number,modal_type:modal_type):ModalInfoType{
    e.preventDefault()
    const divRect = e.currentTarget.getBoundingClientRect()
    const modalInfo:ModalInfoType = {
        x:divRect.left,
        y:divRect.top,
        idx,
        height:divRect.height,
        modal_type:modal_type
    }

    return modalInfo
}

export type img_url_tf_type = {
    tf:boolean,
    idx:number
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


     /* OpenClose FCN */
    //#region

    const img_URL_open = (idx:number)=> setOpenURL({tf:true,idx})
    const img_URL_close = () => setOpenURL({ tf: false, idx: 0 });
    const modal_open = ()=> setModalOpen(true)
    const modal_close = ()=> setModalOpen(false)

    //#endregion

    /* title_height_compute */
    //#region
    const titleChangeHandler = (e:React.ChangeEvent<HTMLTextAreaElement>) =>{
        setTitle(e.target.value)
        adjustTextAreaHeight(e.target);
    }

    useLayoutEffect(()=>{
        if(titleRef.current)
            adjustTextAreaHeight(titleRef.current)
    },[])
  
    //#endregion

    const new_textArea_focusing = () =>{
        setForNewTextFocusing(!forNewTextFocusing)
    }

    useEffect(()=>{ 
        textsRef.current[text.length-1]?.focus()
    },[forNewTextFocusing])

    // useEffect(()=>{console.log(imgs)},[imgs])

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
                            spellCheck="false" 
                            className="title-edit edit-textarea-title" 
                            placeholder="제목을 입력하세요." 
                            onChange={titleChangeHandler}
                            ref={titleRef}
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
/** need memo types **/
// #region

export type EditorField_type = {
    idx:number
    max:number
    new_textArea_focusing:()=> void
    textsRef:React.MutableRefObject<(HTMLTextAreaElement | null)[]>
}

interface memoInterface extends EditorField_type {
    openURL:img_url_tf_type
    imgs:imgstype[]
    modal_open: ()=> void
    modal_close: ()=> void
    img_URL_close:()=>void
}

// #endregion

function EditorField({  
    idx,
    max,
    textsRef,
    openURL,
    img_URL_close,
    modal_open,
    new_textArea_focusing,
}:memoInterface){

    /** const **/
    //#region
    
    const [urlText,setURLText] = useState<string>("")
    const [placeholder,setPlaceholder] = useState<string>("")

    const ref = useRef<HTMLDivElement>(null)

    const dispatch = useDispatch()
    const text = useAppSelector(state=> state.text)
    const imgs = useAppSelector(state => state.imgs)
    const urlInputCheck = useAppSelector(state => state.urlInputCheck)

    const [,drop] = useDrop({
        accept:"img",
        drop(item, monitor) {
            const arrIdx = item as img_drag_type
            const dndDto = {
                arrIdx:arrIdx.img_index,
                willchangeIdx:idx      
            } as dndImg_to_text_type
            dispatch(dnd_img_to_text(dndDto))
        },
    })

    //#endregion

    /** useEffect **/
    //#region
    useLayoutEffect(()=>{
        if(textsRef.current && textsRef.current[idx] !== null)
            adjustTextAreaHeight(textsRef.current[idx]!)
    },[]) //초기 textarea 높이 설정

    useEffect(()=>{ 
        if(openURL.tf && idx === openURL.idx){
            gsap.to(ref.current,{
                display:"block",
                height:"30px",
                marginBottom:"4px",
                duration:0.3,
                ease:"power2.inOut"
            })
        }else if(urlInputCheck.tf === false || idx !== urlInputCheck.idx){
            const tl = gsap.timeline()
            tl.to(ref.current,{
                height:"0px",
                duration:0.3,
                marginBottom:"0px",
                ease:"power2.inOut"
            })
            tl.to(ref.current,{
                display:"none"
            })
        }
        setURLText("") //닫히거나 열리면 url정보 삭제
    },[openURL])   //url 애니메이션
    //#endregion

    /** handler **/
    //#region


    /** TextArea **/
    const onChangeHandler_textArea = (e:React.ChangeEvent<HTMLTextAreaElement>) =>{
        e.preventDefault()
        dispatch(writeText({idx,newText:e.target.value}))
        adjustTextAreaHeight(e.target)
    } 

    const onFocusHandler_textArea = (e:React.FocusEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        img_URL_close()
        setPlaceholder("텍스트를 입력하세요")
    }

    const onBlurHandler_textArea = (e:React.FocusEvent<HTMLTextAreaElement>)=> {
        e.preventDefault()
        setPlaceholder("")  
        setURLText("")
    }

    const keyDownHandler_textArea = (e:React.KeyboardEvent<HTMLTextAreaElement>)=>{
        KeyboardHandlerHooks({
            e,
            idx, 
            max, 
            text, 
            textsRef, 
            delText:del_text,
            addText:add_text, 
            addText_Between,
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
    }

    /** URL **/
    const onChangeHandler_URL = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setURLText(e.target.value)
    }
    const keyDownHandler_URL = (e:React.KeyboardEvent<HTMLInputElement>)=>{
        urlHooks({
            e,
            url:urlText,
            idx:idx,
            NewPushImgs,
            img_URL_close
        })
    }

    //** img **/
    function onclick_handler_option_img(e:React.MouseEvent<HTMLDivElement>,index:number){
        const modalInfo = computeModalInfo(e,index,"img_modal")
        dispatch(getModalInfo(modalInfo))
        modal_open()
    }

    //#endregion

    /** dispatch => function **/
    //#region

    const del_text = (idx_:number) => {
        dispatch(delText({idx:idx_}))
    }

    const add_text = () =>{
        dispatch(addText())
    }

    const NewPushImgs = (idx:number,url:string) => {
        dispatch(pushNewImg({idx,url}))
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
                        textsRef.current[idx] = el; // 드롭 대상 요소의 ref를 설정합니다.
                        drop(el); // useDrop 후크로 만든 drop 핸들러에 ref를 전달하여 요소를 조작합니다.
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

            <div className="insert-url" ref={ref}>
                <input 
                    spellCheck="false"
                    type="text" 
                    placeholder="구글에서 이미지 주소 복사 뒤 엔터를 누르세요."
                    className="insert-url-input"
                    value={urlText}
                    onChange={onChangeHandler_URL}
                    onKeyDown={keyDownHandler_URL}
                />
            </div>
            <ImgMolecules
                EditorField_idx={idx}
                modal_open={modal_open}
            />
        </div>
    )
}

type ImgMolecules_type = {
    EditorField_idx:number,
    modal_open:()=>void,
}

function ImgMolecules({EditorField_idx,modal_open}:ImgMolecules_type){

    const imgs = useAppSelector(state => state.imgs)
    const dispatch = useDispatch()

    function onclick_handler_option_img(e:React.MouseEvent<HTMLDivElement>,index:number){
        const modalInfo = computeModalInfo(e,index,"img_modal")
        dispatch(getModalInfo(modalInfo))
        modal_open()
    }

    return (
        <>
        {imgs.map((item,img_index)=>
            item.idx === EditorField_idx ? (
                <ImgAtoms
                    key={img_index}
                    url={item.url}
                    rate={item.rate}
                    sort={item.sort}
                    img_index={img_index}
                    onclick_handler_option_img={onclick_handler_option_img}
                />
            ):null
        )}
        </>
    )
}

type ImgAtoms_type = {
    url: string
    rate: imgRate
    sort: imgSort
    img_index:number
    onclick_handler_option_img:(e: React.MouseEvent<HTMLDivElement>, index: number) => void
}

type img_drag_type = {
    img_index:number
}

function ImgAtoms({url,rate,sort,img_index,onclick_handler_option_img}:ImgAtoms_type){

    const dispatch = useDispatch()

    const [,drag] = useDrag({
        type:"img",
        item:{img_index}
    })

    const [,drop] = useDrop({
        accept:"img",
        drop(item:{img_index:number}, monitor) {
            dispatch(dnd_img_to_img({arrIdx:img_index,willchangeIdx:item.img_index}))

        },
    })

    return(
        <div className="edit-img">
                    <div className="edit-img-frame"
                        style={{justifyContent:sort}}>
                        <img 
                            ref={el => drag(drop(el))}
                            src={url} 
                            style={{
                                width:typeof rate === "number" ?
                                `${rate}%`:
                                `auto`
                            }}
                        />
                    </div>
                    <div className="edit-img-frame" onClick={e=>{onclick_handler_option_img(e,img_index)}}>
                        <div className="option-button">
                            <span className="material-symbols-outlined">
                                more_vert
                            </span>
                        </div>
                    </div>
                </div>
    )
}