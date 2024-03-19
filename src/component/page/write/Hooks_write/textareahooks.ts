import { EditorField_type } from "../Parts_write/Editor_field/EditorField";

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

    const textArea_management = TextAreaManagement(textsRef.current[idx])
    const paragraphMax = textArea_management.checkParagraphMax()

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
        const get_location = textArea_management.checkParagraph_location() 
        if(get_location !== null){
            const {cursor_last_point,cursor_position,fst_parts,sec_parts} = get_location
            console.log(cursor_last_point,cursor_position)
            if(cursor_last_point === cursor_position){ //커서가 마지막일 때 enter event
                
                // if(idx !== max){
                //     addText_Between()
                //     textsRef.current[0]?.focus()
                 
                //     // textsRef.current[idx+1]?.focus()
                // }else{
                //     addText()
                //     new_textArea_focusing()    
                // }
                // else{
                //     textsRef.current[idx+1]?.focus()
                // }
                    
                // }else{
                //     textsRef.current[idx+1]?.focus()
                // }
            }else{ //커서가 마지막이 아닐떄 enter event

            }
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
            del_text_Movement()
            delText(idx)
        }
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