import { useEffect, useRef } from "react"
import { sortImg } from "../../store/slices/imgObj" 
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { addText, addText_between, delText, dividedText, moveTextAndCreate, prevTextAddup, writeText } from "../../store/slices/text"


export interface IuseTextArea {
    textsRef: React.MutableRefObject<(HTMLTextAreaElement | null)[]>
    onChangeTextEdit: (e: React.ChangeEvent<HTMLTextAreaElement>, idx: number) => void
    onKeyDownTextEdit: (e: React.KeyboardEvent<HTMLTextAreaElement>, idx: number) => void
}



export const adjustTextAreaHeight = (el:HTMLTextAreaElement) => {
    el.style.height = '0px'
    const scrollHeight = el.scrollHeight;
    el.style.height = scrollHeight + 'px'
} //textarea height 자동조절


/** textArea 사용함수 **/
//#region
const useTextArea = (): IuseTextArea => {
    const textsRef = useRef<Array<HTMLTextAreaElement|null>>([])
    const text = useAppSelector(state => state.text)
    const prevIdx = useRef<number>(0)
    const dispatch = useAppDispatch()

    const textArea_resize = () => {
        textsRef.current.forEach((textarea)=>{
            if(textarea){
                adjustTextAreaHeight(textarea)
            }
        })
    }
    
    //#region

    /** 텍스트 입력 함수 **/
    const onChangeTextEdit = (e:React.ChangeEvent<HTMLTextAreaElement>,idx:number) => {
        e.preventDefault()
        const value = {
            idx,
            newText:e.currentTarget.value
        }
        dispatch(writeText(value))
    }
    
    useEffect(()=>{
        textsRef.current[prevIdx.current]?.focus()
        textArea_resize()
    },[text.length])
    
    // useLayoutEffect(()=>{
    //     textArea_resize()
    // },[text])
    //#endregion

    //#region
    /** 키 할당 함수 **/
    const onKeyDownTextEdit = (e: React.KeyboardEvent<HTMLTextAreaElement>,idx:number)=>{

        //shift + enter 줄바꿈
        if (e.key === "Enter" && e.shiftKey) {}

        else if(e.key === "Enter"){
            e.preventDefault()

            //끝 인덱스일 경우 push
            
            const textarea = textsRef.current[idx] as HTMLTextAreaElement //ref
            const cursorState = getCursorState(textarea as HTMLTextAreaElement) //커서 값
            const curText = textarea?.value //현재 텍스트 데이터
        
 
            if(curText){
                //커서가 마지막이거나 글씨가 없을 때
                if (cursorState === "end") {
                   
                    //지금 텍스트 저장
                    if(textsRef.current[idx]) dispatch(writeText({idx,newText:curText}))


                    //마지막 텍스트에리어 빈배열 삽입
                    if (text.length - 1 === idx)dispatch(addText())
                    
                    //사이 텍스트 에리어 중간삽입    
                    else dispatch(addText_between(idx))

                    //포커스
                    prevIdx.current = idx + 1
                }

                //커서가 시작 위치인데 내용이 있을 때
                else if (cursorState === "start" && curText !== undefined) {
                    (async () => {
                        
                        await dispatch(moveTextAndCreate({idx,text:curText}))

                        setTimeout(() => {
                            if (textarea) {
                                const newTextArea = textsRef.current[idx + 1] as HTMLTextAreaElement
                                newTextArea.focus()
                                newTextArea.setSelectionRange(0, 0)
                                prevIdx.current = idx + 1
                            }
                        }, 0);
                    })()
                    
                }

                //커서가 글씨 사이
                else if (typeof cursorState === "number" && curText !== undefined) {
                    (async () => {
                        await dispatch(dividedText({idx,cursor:cursorState,text:curText}))

                        setTimeout(() => {
                            if (textarea) {
                                const newTextArea = textsRef.current[idx + 1] as HTMLTextAreaElement
                                newTextArea.focus()
                                newTextArea.setSelectionRange(0, 0)
                                prevIdx.current = idx + 1
                            }
                        }, 0);
                    })()

                    
                    
                }
                    
                
                //포커싱
                

            }
            
            else{
                //마지막 텍스트 에리어일 때 새로운 텍스트에리어 추가
                if (text.length - 1 === idx) dispatch(addText())
                    
                
                //사이에 낀 빈 텍스트 에리어일 때
                else {
                    dispatch(addText_between(idx))
                }

                prevIdx.current = idx + 1

            }
        }
        
        else if (e.key === "ArrowUp") {
            //포커싱
            if(idx > 0) textsRef.current[idx - 1]?.focus()

            //데이터 redux업데이트
            const textarea = textsRef.current[idx - 1]
            const curText = textsRef.current[idx] as HTMLTextAreaElement
            dispatch(writeText({idx,newText:curText.value}))

            //커서 끝으로
            if (idx > 0 && textarea && textarea.value) {
                e.preventDefault()
                const len = textarea.value.length
                textarea.focus()                   
                textarea.setSelectionRange(len,len)     
            }

        }
        
        else if (e.key === "ArrowDown") {
            //데이터 업뎃
            const curText = textsRef.current[idx] as HTMLTextAreaElement
            dispatch(writeText({idx,newText:curText.value}))

            //포커싱
            if(idx < text.length - 1) textsRef.current[idx+1]?.focus()

        }    
        
        else if (e.key === "Backspace") {
            if (idx > 0 && textsRef.current[idx]) {
                //커서
                const curText = textsRef.current[idx] as HTMLTextAreaElement
                const prevText = textsRef.current[idx - 1] as HTMLTextAreaElement
                dispatch(writeText({idx,newText:curText.value}))

                const cursorState = getCursorState(textsRef.current[idx] as HTMLTextAreaElement)
                 
                //빈 상태 그냥 삭제
                if (cursorState === "empty") {
                    e.preventDefault()
                    textsRef.current[idx-1]?.focus()
                    dispatch(sortImg({curIdx:idx-1,targetIdx:idx-1}))
                    dispatch(delText({idx}))
                    prevIdx.current = idx - 1
                } 
                //시작지점 
                else if (cursorState === "start") {
                    e.preventDefault()
                    const len = prevText.value.length; //이전 텍스트 길이
    
                    (async ()=>{
                        await dispatch(prevTextAddup(idx))
                        setTimeout(() => {
                            const textarea = textsRef.current[idx - 1]
                            if (textarea) {
                                textarea.focus()
                                textarea.setSelectionRange(len, len)
                            }
                        }, 0);
                    })()
                    prevIdx.current = idx - 1;

                }
                else if(cursorState === "range") {
                    dispatch(writeText({idx,newText:""}))
                }
            }
            
        }
        
    }
    //#endregion

    return {
        textsRef,
        onChangeTextEdit,
        onKeyDownTextEdit
    }
}
//#endregion
export default useTextArea


const getCursorState = (textarea:HTMLTextAreaElement) => {
    const cursorStart = textarea.selectionStart
    const cursorEnd = textarea.selectionEnd
    const len = textarea.value.length

    if(cursorStart !== cursorEnd) return 'range'

    if(len === 0)
        return 'empty'
    else if(cursorStart === 0)
        return 'start'
    else if(cursorStart === len)
        return "end"
    else{
        return cursorStart
    }

}

