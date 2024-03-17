import { EditorField_type } from './../edit';

interface key_handler_hooks_interface extends EditorField_type {
    text:string[],
    addText: ()=>void,
    delText: (idx_: number) => void,
    addText_Between: ()=> void,
    del_text_Movement: ()=> void,
    add_text_Movement: ()=> void,
    e:React.KeyboardEvent<HTMLTextAreaElement>
}

function KeyboardHandlerHooks({
    idx,
    max,
    text,
    textsRef,
    delText,
    addText,
    addText_Between,
    del_text_Movement,
    add_text_Movement,
    new_textArea_focusing,
    e,  
}:key_handler_hooks_interface){ 

    const textAreaManagement = TextAreaManagement(textsRef.current[idx])
    const paragraphMax = textAreaManagement.checkParagraphMax()

    if (e.shiftKey && e.key === "Enter") return;
    else if(e.ctrlKey && e.key === "Enter"){ // ctrl+enter + add = textarea
        e.preventDefault()
        addText_Between()
        add_text_Movement()
        textsRef.current[idx+1]?.focus()
    }
    else if(e.key === "Enter"){ //add -> focusFunc
        e.preventDefault()
        if(idx === max){
            addText()
            new_textArea_focusing() //focusSign
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
            del_text_Movement()
            delText(idx)
        }
    }
}

export default KeyboardHandlerHooks

type TextAreaManagement = {
    checkParagraphNum: ()=> number
    checkParagraphMax: ()=> number
}

function TextAreaManagement(textarea:HTMLTextAreaElement | null):TextAreaManagement{ // 줄바꿈(\n)이(가) 존재할때 포커싱 핸들러

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