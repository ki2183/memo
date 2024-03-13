import { useEffect, useLayoutEffect, useRef, useState } from "react"
import "./edit.css"
import editer, { editerReturnType } from "../../hooks/editer/edithooks"
import KeyboardHandlerHooks from "../../hooks/editer/textareahooks";
import imgHooks, { imgsReturnType } from "../../hooks/editer/imgshooks";
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend, NativeTypes } from "react-dnd-html5-backend";
import Modal from "react-modal";
import OptionModal, { customModalStyles } from "./editModal";
import { useAppSelector } from "../../store/hooks";
import { useDispatch } from "react-redux";
import { getXY, mouseXYType } from "../../store/slices/mouseXY";
import { addText, delText, writeText } from "../../store/slices/text";

export type imgsType = {
    url:string,
    idx:number
}

const adjustTextAreaHeight = (element:HTMLTextAreaElement) => {
    element.style.height = '0px'
    const scrollHeight = element.scrollHeight;
    element.style.height = scrollHeight + 'px'
};    

function Edit(){

    const [title, setTitle] = useState<string>("") //제목
    const [imgs,setImgs] = useState<imgsType[]>([])
    const textsRef = useRef<Array<HTMLTextAreaElement|null>>([]) //for animation
    const [forNewTextFocusing,setForNewTextFocusing] = useState<boolean>(false)
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const imghooks = imgHooks(imgs,setImgs) as imgsReturnType

     /* redux value */
    //#region

    const text = useAppSelector(state => state.text)

    //#endregion
    /* for_title_height */
    //#region
    const titleChangeHandler = (e:React.ChangeEvent<HTMLTextAreaElement>) =>{
        setTitle(e.target.value)
        adjustTextAreaHeight(e.target);
    }
  
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
                <div className="frame-edit">
                    <OptionModal 
                        modalOpen={modalOpen} 
                        setModalOpen={setModalOpen} 
                    />

                    <div/>
                    <div>
                        <textarea spellCheck="false" className="title-edit edit-textarea-title" placeholder="제목을 입력하세요." onChange={titleChangeHandler}/>
                        <div className="frame-memos">
                            {
                                (text.length > 0) && text.map((item:string,idx:number)=>{

                                    const max = text.length-1

                                    return (
                                        <Memo 
                                            key={idx}
                                            idx={idx}
                                            max={max}
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

// const [modalOpen, setModalOpen] = useState<boolean>(false);

export type memoType = {
    idx:number
    max:number

    addText_sign:()=> void
    textsRef:React.MutableRefObject<(HTMLTextAreaElement | null)[]>
    
}

interface memoInterface extends memoType {
    // imgshooks:imgsReturnType,
    // imgs:imgsType[]
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
    modalOpen,
    setModalOpen,
    addText_sign,
}:memoInterface){

    // const this_idx_imgs = imgs.filter(el => el.idx === idx)
    const text = useAppSelector(state=> state.text)
    const dispatch = useDispatch()
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

    function getMouseXY(e:React.MouseEvent<HTMLDivElement>):void {
        e.preventDefault()
        const divRect = e.currentTarget.getBoundingClientRect()

        const divLeft = divRect.left;
        const divTop = divRect.top;

        const clientX = e.clientX;
        const clientY = e.clientY;

        const relativeX = clientX - divLeft;
        const relativeY = clientY - divTop;

    console.log("상대적인 좌표:");
    console.log("Left:", relativeX);
    console.log("Top:", relativeY);

        // console.log("마우스 좌표")
        // console.log(e.clientX)
        // console.log(e.clientY)
        const xy = {
            x:e.clientX,
            y:e.clientY,
            idx
        }
        dispatch(getXY(xy))
    }

    const [,img_drop_toText] = useDrop({
        accept:[NativeTypes.FILE],
        drop(item:onlineImgType, monitor) {
            console.log(item.dataTransfer)
            alert(item)
        },
    })
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
    useEffect(()=>{console.log(text)},[text])

    return (
        <>
            <div className="memo" ref={img_drop_toText}>
                <div/>
                <textarea 
                    className="edit-text"
                    spellCheck="false"
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
                    onChange={memoHandler} 
                    ref={el=>textsRef.current[idx] = el}
                    value={text[idx]}
                />
                <div onClick={e=>{
                    e.preventDefault()
                    getMouseXY(e)
                    setModalOpen(true)
                    // edit.deleteTexts(idx)
                }}>
                </div>
            </div>
            <div className="insert-url">
                <input type="text" className="insert-url-input bg-slate-300"/>
            </div>

            {/* {
                (this_idx_imgs && this_idx_imgs.length > 0) && (this_idx_imgs.map((item,idx_)=>(
                    <MemoImg 
                        url={item.url} 
                        imgshooks={imgshooks}
                        key={idx}
                    />
                )))
            } */}
        </>
    )
}

type MemoImgType = {
    url:string
    imgshooks: imgsReturnType
}

function MemoImg({url,imgshooks}:MemoImgType){

    const combinedRef = useRef(null)

    // const [{ isDragging }, drag] = useDrag(() => ({
    //     type: 'image', // 드래그 가능한 항목의 타입을 'image'로 지정
    //     item: { type: 'image', url }, // 드래그하는 항목에는 이미지 URL이 포함됩니다.
    //     collect: (monitor) => ({
    //       isDragging: !!monitor.isDragging(),
    //     }),
    //   }));
    
    //   const [{ isOver, canDrop }, drop] = useDrop(() => ({
    //     accept: 'image',
    //     drop: (item, monitor) => {
    //       console.log('Image dropped:', item);''
    //       alert('Image dropped!');
    //     }, 
    //     collect: (monitor) => ({
    //       isOver: !!monitor.isOver(),
    //       canDrop: !!monitor.canDrop(),
    //     }),
    //   }));

    //   const [,urlDrop] = useDrop({
    //     accept:[NativeTypes.FILE],
    //     drop(file:{files:FileList}){
    //         console.log(file)
    //     }
            
    //     })

    //   drag(drop(urlDrop(combinedRef)))



    return (
        <img src={url} ref={combinedRef}/>
    )
}
