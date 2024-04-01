import { EditorField_type } from "../Parts_write/editor_field/editor_field";

interface key_handler_hooks_interface extends EditorField_type {
    text:string[],
    addText: ()=>void,
    delText: (idx_: number) => void,
    addText_Between: ()=> void,
    del_text_Movement: ()=> void,
    add_text_Movement: ()=> void,
    lineBreak_text: (curText: string, nextText: string) => void
    e:React.KeyboardEvent<HTMLTextAreaElement>
}

function KeyboardHandlerHooks({
    idx,
    max,
    text,
    textsRef,
    delText,
    addText,
    ctrl_z_handler,
    lineBreak_text,
    addText_Between,
    del_text_Movement,
    add_text_Movement,
    new_textArea_focusing,
    e,  
}:key_handler_hooks_interface){ 

    const textArea_management = TextAreaManagement(textsRef.current[idx])
    const paragraphMax = textArea_management.checkParagraphMax()
    const get_location = textArea_management.checkParagraph_location() 

    if (e.shiftKey && e.key === "Enter") return;
    else if(e.ctrlKey && e.key === "Enter"){ // ctrl+enter + add = textarea
        e.preventDefault()
        if(max === idx){
            addText()
            new_textArea_focusing()
            return
        }
        addText_Between()
        add_text_Movement()
        textsRef.current[idx+1]?.focus()    
        
    }
    else if(e.key === "Enter"){ //add -> focusFunc
        e.preventDefault()
        if(get_location !== null){
            const {cursor_last_point,cursor_position,fst_parts,sec_parts} = get_location
            if(cursor_last_point === cursor_position){ //커서가 마지막일 때 enter event
                if(idx !== max){    
                    addText_Between()
                    textsRef.current[idx+1]?.focus()
                }else{
                    addText()
                    new_textArea_focusing() 
                }
            }else{ //커서가 마지막이 아닐떄 enter event
                if(idx!== max){
                    lineBreak_text(fst_parts,sec_parts)
                    textsRef.current[idx+1]?.focus()
                }else{
                    lineBreak_text(fst_parts,sec_parts)
                    new_textArea_focusing()
                }
            }
            add_text_Movement()
        }
     
        
    }else if(e.key === "ArrowUp"){
        if(0 < idx){ //단락이 없거나 단락 번호가 0이면 이전 text 포커싱
            if(paragraphMax === 0 || textArea_management.checkParagraphNum() === 0){
                e.preventDefault()
                textsRef.current[idx-1]?.focus()
            } 
        }
    }else if(e.key === "ArrowDown"){
        if(idx < max){
            if(paragraphMax === 0 || textArea_management.checkParagraphNum() === paragraphMax){
                e.preventDefault()
                textsRef.current[idx+1]?.focus()
            }
            
        }
    }else if(e.key === "Backspace"){
        
        if(idx !== 0 && text[idx] === ""){ //del -> focus
            
            e.preventDefault()
            textsRef.current[idx-1]?.focus()

            if (textsRef.current[idx - 1] !== null) {
                textsRef.current[idx - 1]!.selectionStart = 500// '!'를 사용하여 null 체크
                textsRef.current[idx - 1]!.selectionEnd = 500
            }
                    
            
            
            del_text_Movement()
            delText(idx)
        }
    }else if(e.ctrlKey && e.key === "z"){
        e.preventDefault()
        ctrl_z_handler()
    }
}

export default KeyboardHandlerHooks

type TextAreaManagement = {
    checkParagraphNum: ()=> number
    checkParagraphMax: ()=> number
    checkParagraph_location:()=>{
        cursor_position: number;
        cursor_last_point: number;
        fst_parts: string;
        sec_parts: string;
    } | null }

function TextAreaManagement(textarea:HTMLTextAreaElement | null):TextAreaManagement{ // 줄바꿈(\n)이(가) 존재할때 포커싱 핸들러

    const text = textarea?.value
    const count = (text !== null) && (text !== undefined )? text.split('\n').length - 1 : 0
    const text_arr = text?.split('')

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

    function checkParagraph_location(){
        if(textarea !== null){
            const cursorPosition = textarea?.selectionStart;
            const value = textarea?.value
            const fstParts = value.substring(0,cursorPosition)
            const secParts = value.substring(cursorPosition)
            const value_len = value.length

            return {
                cursor_position:cursorPosition,
                cursor_last_point:value_len,
                fst_parts:fstParts,
                sec_parts:secParts
            }
        }else{
            return null
        }
    }

    return {
        checkParagraphNum,
        checkParagraphMax,
        checkParagraph_location
    }
}