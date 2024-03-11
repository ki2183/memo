import { useEffect, useRef, useState } from "react"
import "./edit.css"
import editer, { editerReturnType } from "../../hooks/editer/edithooks"
import KeyboardHandlerHooks from "../../hooks/editer/textareahooks";
import imgHooks, { imgsReturnType } from "../../hooks/editer/imgshooks";

export type imgsType = {
    url:string,
    idx:number
}

function Edit(){

    const [title, setTitle] = useState<string>("") //제목
    const [texts, setTexts] = useState<string[]>([""]); //텍스트
    const [imgs,setImgs] = useState<imgsType[]>([])
    const textsRef = useRef<Array<HTMLTextAreaElement|null>>([]) //for animation
    const [forNewTextFocusing,setForNewTextFocusing] = useState<boolean>(false)
    const edit = editer(texts, setTexts) as editerReturnType
    const imghooks = imgHooks(imgs,setImgs) as imgsReturnType

    /* for_title_height */
    //#region
    const titleChangeHandler = (e:React.ChangeEvent<HTMLTextAreaElement>) =>{
        setTitle(e.target.value)
        adjustTextAreaHeight(e.target);
    }

    const adjustTextAreaHeight = (element:HTMLTextAreaElement) => {
        element.style.height = 'auto'
        element.style.height = element.scrollHeight + 'px'
    };    
    //#endregion

    const addText_sign = () =>{
        setForNewTextFocusing(!forNewTextFocusing)
    }

    useEffect(()=>{ 
        textsRef.current[texts.length-1]?.focus()
    },[forNewTextFocusing])

    useEffect(()=>{console.log(imgs)},[imgs])

    return (
        <div className="container-edit">
            <div className="frame-edit">
                <div/>
                <div>
                    <textarea spellCheck="false" className="title-edit edit-textarea-title" placeholder="제목을 입력하세요." onChange={titleChangeHandler}/>

                    <div className="frame-memos">
                        {
                            (texts.length > 0) && texts.map((item:string,idx:number)=>{

                                const max = texts.length-1

                                return (
                                    <Memo 
                                        key={idx}
                                        idx={idx}
                                        max={max}
                                        edit={edit}
                                        imgs={imgs}
                                        imgshooks={imghooks}
                                        texts={texts}
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
    )
}

export default Edit

export type memoType = {
    idx:number
    max:number
    texts:string[]
    edit:editerReturnType
    textsRef:React.MutableRefObject<(HTMLTextAreaElement | null)[]>
    addText_sign:()=> void
}

interface memoInterface extends memoType {
    imgshooks:imgsReturnType,
    imgs:imgsType[]
}
//atom
function Memo({  
    idx,
    max,
    texts,
    imgs,
    edit,
    imgshooks,
    textsRef,
    addText_sign,
}:memoInterface){

    const memoHandler = (e:React.ChangeEvent<HTMLTextAreaElement>) =>{
        e.preventDefault()
        edit.updateTexts(idx,e.target.value)
    }

    // useEffect(() => {
    //     textsRef.current[idx]?.addEventListener('drop', handleDrop); // drop 이벤트 리스너 추가
    
    //     return () => {
    //         textsRef.current[idx]?.removeEventListener('drop', handleDrop);
    //     };
    // }, [idx]);

    useEffect(() => {

        const handle_drop_img = (e:DragEvent) => imgshooks.handleDropImg(e,idx)

        textsRef.current[idx]?.addEventListener('drop', handle_drop_img)
    
        return () => {
            textsRef.current[idx]?.removeEventListener('drop', handle_drop_img)
        };
    }, [idx]);

    const this_idx_imgs = imgs.filter(el => el.idx === idx)

    return (
        <>
            <div className="memo">
                <div/>
                <textarea 
                    className="edit-text"
                    spellCheck="false"
                    onKeyDown={e=>{
                        KeyboardHandlerHooks({ //keyboard event hooks
                            idx, 
                            max, 
                            texts, 
                            edit, 
                            textsRef, 
                            addText_sign, 
                            e,
                        })
                    }} 
                    onChange={memoHandler} 
                    ref={el=>textsRef.current[idx] = el}
                    value={texts[idx]}
                />
                <div onClick={e=>{
                    e.preventDefault()
                    edit.deleteTexts(idx)
                }}></div>
            </div>

            {
                (this_idx_imgs && this_idx_imgs.length > 0) && (this_idx_imgs.map((item,idx_)=>(
                    <img src={item.url} key={idx_} onClick={e=>{
                        imgshooks.delImg(item.url,idx)
                    }}/>
                )))
            }
        </>
    )
}