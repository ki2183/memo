import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { adjustTextAreaHeight, IuseTextArea } from "../../../useHook/writeVer2/useTextarea"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import OptionButton from "../componenet/optionButton/optionButton"
import { dndImgToText } from "../../../store/slices/imgObj"
import { writeText } from "../../../store/slices/text"
import { DragItem } from "./ImgEditor" 
import { useDrop } from "react-dnd"
import "./textEditer.css"



interface ITextEditer{
    idx:number
    useText:IuseTextArea
}

const TextEditer:React.FC<ITextEditer> = (({
    idx,
    useText
}:ITextEditer) => {
    const ref = useRef<HTMLTextAreaElement | null>(null) //이 textEditer 토탈 ref
    const text = useAppSelector(state => state.text) //text 값 redux에서 추출

    const {textAreaShadow} = useAppSelector(state => state.theme) 
    const [localText, setLocalText] = useState<string>(text[idx]) // local text관리
    const [lockBlur,setLockBlur] = useState<Boolean>(false) // onKeyDown으로 텍스트가 변경 될 때 이중으로 저장하는걸 방지하고자 blur이벤트에 락함
    const [hover, setHover] = useState<boolean>(false) // 이미지 드래그해서 이 텍스트에디터 블록에 hover중인지 판별
    const {textsRef,onKeyDownTextEdit} = useText 
    const dispatch = useAppDispatch()



    /** React DND **/
    //#region

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "IMG",

        drop: (item: DragItem) => {
          const draged = { imgIdx: item.imgIdx, textIdx: item.textIdx }
          if (idx === draged.textIdx) return;
          dispatch(dndImgToText({ draged, drop: { textIdx: idx } }))
        },

        collect: (monitor) => ({
          isOver: monitor.isOver({ shallow: false }),
          didDrop: monitor.didDrop(),
        }),
    }))

    const updateHover = useCallback(()=>{
        setHover(isOver)
    },[isOver])

    const setTextsRef = useCallback(()=>{
        if (ref.current) textsRef.current[idx] = ref.current
    },[textsRef,idx])

    //#endregion



    /** useEffects **/
    //#region

    //ref 업뎃
    useEffect(() => { if (ref.current) textsRef.current[idx] = ref.current }, [setTextsRef])

    //이미지 hover하면 true -> border색 업뎃
    useEffect(() => { updateHover() }, [updateHover])

    //Redux동기화
    useEffect(() => { setLocalText(text[idx]) }, [text])

    //텍스트 크기 리사이즈
    useLayoutEffect(() => {
        if (textsRef.current && textsRef.current[idx]) 
            adjustTextAreaHeight(textsRef.current[idx] as HTMLTextAreaElement)

    }, [localText])
    
    //#endregion



     /** EvnetHandler **/
    //#region

    const KeyDownHandler = async (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
        //enter로 텍스트가 변경되면 blur이벤트의 텍스트 저장기능과 중복됨 이를 방지하고자 blur이벤트 lock
        await setLockBlur(true)
        await onKeyDownTextEdit(e,idx)
        await setLockBlur(false)
        
    }   
    
    const ChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        setLocalText(e.target.value)
    }

    const BlurHandler = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
        //KeyDownEvent일때 업뎃 되는거 방지
        e.preventDefault()
        if (lockBlur === false) dispatch(writeText({idx,newText:text[idx]}))
    }

    //#endregion
    
    //onChange를 onBlur로 전환 잔렌더를 줄이기 위함
    return (
        <div className="">
            <div className="memo relative" ref={el => drop(el)}>
                <div/>   

                <div>

                    <textarea 
                        style={{
                            boxShadow:hover ? textAreaShadow : 'none'
                        }}

                        ref={ref}
                        spellCheck="false"
                        className="edit-text" 
                        placeholder="텍스트를 입력하세요"

                        value={localText}
                        onBlur={BlurHandler} // blur 시 Redux와 동기화
                        onChange={ChangeHandler} // 로컬 상태 업데이트
                        onKeyDown={KeyDownHandler} //Keydown Event
                    />

                </div> 

                <OptionButton idx={idx}/>

            </div>
        </div>
    )
})
export default TextEditer