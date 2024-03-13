import { memoType } from "../../page/write/edit"

interface key_handler_hooks_interface extends memoType {
    e:React.KeyboardEvent<HTMLTextAreaElement>,
    text:string[],
    delText_: (idx_: number) => void,
    addText_: ()=>void,
}

function KeyboardHandlerHooks({
    idx,
    max,
    text,
    textsRef,
    addText_sign,
    delText_,
    addText_,
    e,  
}:key_handler_hooks_interface){ 
    const textAreaManagement = TextAreaManagement(textsRef.current[idx])
    const paragraphMax = textAreaManagement.checkParagraphMax()
    if (e.shiftKey && e.key === "Enter") return;
        
        else if(e.key === "Enter"){ //add -> focusFunc
            e.preventDefault()
            if(idx === max){
                // edit.newAddTexts()
                addText_()
                addText_sign()
                return
            }
            textsRef.current[idx+1]?.focus()
        }else if(e.key === "ArrowUp"){
            if(0 < idx){ //단락이 없거나 단락 번호가 0이면 이전 text 포커싱
                if(paragraphMax === 0 || textAreaManagement.checkParagraphNum() === 0){
                    e.preventDefault()
                    textsRef.current[idx-1]?.focus()
                    return
                } 
            }
        }else if(e.key === "ArrowDown"){
            if(idx < max){
                if(paragraphMax === 0 || textAreaManagement.checkParagraphNum() === paragraphMax){
                    e.preventDefault()
                    textsRef.current[idx+1]?.focus()
                }
                
            }
        }else if(e.key === "Backspace"){
        
            if(idx !== 0 && text[idx] === ""){ //del -> focus
                e.preventDefault()
                textsRef.current[idx-1]?.focus()
                // edit.deleteTexts(idx)
                delText_(idx)
            }
        }
}

export default KeyboardHandlerHooks

type TextAreaManagement = {
    checkParagraphNum: ()=> number
    checkParagraphMax: ()=> number
}

function TextAreaManagement(textarea:HTMLTextAreaElement | null):TextAreaManagement{

    const text = textarea?.value
    const count = (text !== null) && (text !== undefined )? text.split('\n').length - 1 : 0

    function checkParagraphMax(){
        return count
    }

    function checkParagraphNum(){
        if(textarea !== null){
            const cursorPosition = textarea?.selectionStart;
            const textBeforeCursor = textarea?.value.substring(0, cursorPosition);
            const paragraphs = textBeforeCursor.split('\n');
            const currentParagraphIndex = paragraphs.length - 1;
            return currentParagraphIndex
        }else{
            return 0
        }
    }

    return {
        checkParagraphNum,
        checkParagraphMax
    }
}