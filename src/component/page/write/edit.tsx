import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import "./edit.css"
import editer, { editerReturnType } from "../../hooks/editer/edithooks"
import KeyboardHandlerHooks from "../../hooks/editer/textareahooks";
import imgHooks, { imgsReturnType } from "../../hooks/editer/imgshooks";
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend, NativeTypes } from "react-dnd-html5-backend";
import OptionModal, { customModalStyles } from "./editModal";
import { useAppSelector } from "../../store/hooks";
import { useDispatch } from "react-redux";
import { addText, delText, writeText } from "../../store/slices/text";
import gsap from "gsap";
import { EditNavTop } from "../../components/editerNav";
import { pushNewImg } from "../../store/slices/imgs";
import urlHooks from "../../hooks/editer/urlhooks";
import { ModalInfoType, getModalInfo, modal_type } from "../../store/slices/modalInfo";

export type imgsType = {
    url:string,
    idx:number
}

const adjustTextAreaHeight = (element:HTMLTextAreaElement) => {
    element.style.height = '0px'
    const scrollHeight = element.scrollHeight;
    element.style.height = scrollHeight + 'px'
}

function computeModalInfo(e:React.MouseEvent<HTMLDivElement>,idx:number,modal_type:modal_type):ModalInfoType{
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
    const [imgs,setImgs] = useState<imgsType[]>([])
    const textsRef = useRef<Array<HTMLTextAreaElement|null>>([]) //for animation
    const [forNewTextFocusing,setForNewTextFocusing] = useState<boolean>(false)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [imgURLTF,setImgURLTF] = useState<img_url_tf_type>({tf:false,idx:0})
    const imghooks = imgHooks(imgs,setImgs) as imgsReturnType
    const text = useAppSelector(state => state.text)


     /* imgURLTF value */
    //#region

    const update_URL_true = (idx:number)=> setImgURLTF({tf:true,idx})
    const update_URL_false = () => setImgURLTF({ tf: false, idx: 0 });

    //#endregion

    useEffect(()=>{
        console.log(imgURLTF)
    },[imgURLTF])

    /* for_title_height */
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

    const addText_sign = () =>{
        setForNewTextFocusing(!forNewTextFocusing)
    }

    useEffect(()=>{ 
        textsRef.current[text.length-1]?.focus()
    },[forNewTextFocusing])

    useEffect(()=>{console.log(imgs)},[imgs])

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container-edit">
                <EditNavTop/>
                <div className="frame-edit">
                    <OptionModal 
                        modalOpen={modalOpen} 
                        update_URL_true={update_URL_true}
                        setModalOpen={setModalOpen} 
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
                                        <Memo 
                                            key={idx}
                                            idx={idx}
                                            max={max}
                                            imgURLTF={imgURLTF}
                                            update_URL_false={update_URL_false}
                                            modalOpen={modalOpen}
                                            setModalOpen={setModalOpen}
                                            textsRef={textsRef}
                                            addText_sign={addText_sign}
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

export type memoType = {
    idx:number
    max:number
    addText_sign:()=> void
    textsRef:React.MutableRefObject<(HTMLTextAreaElement | null)[]>
    
}

interface memoInterface extends memoType {
    // imgshooks:imgsReturnType,
    // imgs:imgsType[]
    imgURLTF:img_url_tf_type
    update_URL_false:()=>void
    modalOpen:boolean
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type onlineImgType = {
    dataTransfer: {
        files: FileList;
        items: DataTransferItemList;
      };
}

// #endregion

//atom
function Memo({  
    idx,
    max,
    textsRef,
    setModalOpen,
    addText_sign,
    imgURLTF,
    update_URL_false
}:memoInterface){

    // const this_idx_imgs = imgs.filter(el => el.idx === idx)
    const text = useAppSelector(state=> state.text)
    const [placeholder,setPlaceholder] = useState<string>("")
    const urlInputCheck = useAppSelector(state => state.urlInputCheck)
    const ref = useRef<HTMLDivElement>(null)
    const [urlText,setURLText] = useState<string>("")
    const imgs = useAppSelector(state => state.imgs)
    const dispatch = useDispatch()

    const NewPushImgs = (idx:number,url:string) => {
        dispatch(pushNewImg({idx,url}))
    }

    useEffect(()=>{
        if(imgURLTF.tf && idx === imgURLTF.idx){
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
    },[imgURLTF])

    /* 초기 */

    useLayoutEffect(()=>{
        if(textsRef.current && textsRef.current[idx] !== null)
            adjustTextAreaHeight(textsRef.current[idx]!)
    },[])

    /* handler */
    //#region
    const memoHandler = (e:React.ChangeEvent<HTMLTextAreaElement>) =>{
        e.preventDefault()
        dispatch(writeText({idx,newText:e.target.value}))
        adjustTextAreaHeight(e.target)
    } 

    function onclick_handler_option_text(e:React.MouseEvent<HTMLDivElement>){
        const modalInfo = computeModalInfo(e,idx,"text_modal")
        dispatch(getModalInfo(modalInfo))
        setModalOpen(true)
    }

    // const [,img_drop_toText] = useDrop({
    //     accept:[NativeTypes.FILE],
    //     drop(item:onlineImgType, monitor) {
    //         console.log(item.dataTransfer)
    //         alert(item)
    //     },
    // })
    //#endregion


    /* dispatch => function */
    //#region

    const delText_ = (idx_:number) => {
        dispatch(delText({idx:idx_}))
    }

    const addText_ = () =>{
        dispatch(addText())
    }

    //#endregion
    
    const onFocusHandler = (e:React.FocusEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        update_URL_false()
        setPlaceholder("텍스트를 입력하세요")
    }

    const onBlurHandler = (e:React.FocusEvent<HTMLTextAreaElement>)=> {
        e.preventDefault()
        setPlaceholder("")  
        setURLText("")
    }

    const onChangeHandler_URL = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setURLText(e.target.value)
    }
    const KeyDownHandler_URL = (e:React.KeyboardEvent<HTMLInputElement>)=>{
        urlHooks({
            e,
            url:urlText,
            idx:idx,
            NewPushImgs,
            update_URL_false
        })
    }
    function onclick_handler_option_img(e:React.MouseEvent<HTMLDivElement>,index:number){
        const modalInfo = computeModalInfo(e,index,"img_modal")
        dispatch(getModalInfo(modalInfo))
        setModalOpen(true)
    }


    useEffect(()=>{console.log(imgs)},[imgs])

    return (
        <div>
            <div className="memo" key={idx}>
                <div/>
                <textarea 
                    className="edit-text"
                    spellCheck="false"
                    onFocus={onFocusHandler}
                    onBlur={onBlurHandler}
                    placeholder={placeholder}
                    onKeyDown={e=>{
                        KeyboardHandlerHooks({ //keyboard event hooks
                            idx, 
                            max, 
                            text, 
                            textsRef, 
                            delText_,
                            addText_, 
                            addText_sign,
                            e,
                        })
                    }} 
                    onChange={e=>memoHandler(e)} 
                    ref={el=>textsRef.current[idx] = el}
                    value={text[idx]}
                />
                <div
                    className="option-button" 
                    onClick={e=>{
                        e.preventDefault()
                        onclick_handler_option_text(e)
                    }}>
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
                    onKeyDown={KeyDownHandler_URL}
                />
            </div>

            {imgs.map((item,index)=>
                item.idx === idx ? (
                    <div className="edit-img">
                        <div className="edit-img-frame"
                            style={{justifyContent:item.sort}}>
                            <img 
                                src={item.url} 
                                key={index}
                                style={{
                                    width:typeof item.rate === "number" ?
                                    `${item.rate}%`:
                                    `auto`
                                }}
                            />
                        </div>
                        <div className="edit-img-frame" onClick={e=>{onclick_handler_option_img(e,index)}}>
                            <div className="option-button">
                                <span className="material-symbols-outlined">
                                    more_vert
                                </span>
                            </div>
                        </div>
                    </div>
                ):null
            )}
        </div>
    )
}

type MemoImgType = {
    url:string
    imgshooks: imgsReturnType
}