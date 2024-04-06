import { join_check_type } from "./join";
import gsap from "gsap"
export function formHooks(){
    
    const fail_check = (formDto:join_check_type,id_check:boolean|null) => {
        if(id_check !== false && id_check !== null){
            return "user_id"
        }else if(formDto.name === ""){
            return "name"
        }else if(formDto.password === ""){
            return "password"
        }else if(formDto.password.length<4){
            return "password_length"
        }else if(formDto.password !== formDto.password_check){
            return "password_check"
        }
        return "true"
    }

    const keyboard_Hooks_etc = ( //엔터 => 다음 input 포커싱 input 마지막이면 join버튼 포커싱
        idx:number,
        joinButtonRef:React.RefObject<HTMLButtonElement>,
        e:React.KeyboardEvent<HTMLInputElement>,
        inputRefs:React.MutableRefObject<(HTMLInputElement | null)[]>,
    ) =>{
        if(e.key === 'Enter'){
            e.preventDefault()
            if(inputRefs.current && inputRefs.current[idx+1]){
                inputRefs.current[idx+1]?.focus()
                return
            }
            joinButtonRef.current?.focus()
        }
    }

    const keyboard_Hooks_id = ( //엔터 => 아이디 있:다음 input 포커싱 // 아이디없:아무동작 ㄴ
        e:React.KeyboardEvent<HTMLInputElement>,
        checkId_api:()=>void,
        inputRefs:React.MutableRefObject<(HTMLInputElement | null)[]>,
        warningRefs:React.MutableRefObject<(HTMLSpanElement | null)[]>,
    ) =>{
        if(e.key === 'Enter'){
            e.preventDefault()
            if(inputRefs.current && inputRefs.current[1]){
                inputRefs.current[1]?.focus()
                return
            }
        

        }
    }

    const warning_animation_span = (
        spanRef:React.RefObject<HTMLSpanElement>
    ) =>{

        const tl = gsap.timeline()
        tl.set(spanRef,{
            x:0
        })
        tl.to(spanRef,{
            x:-2,
            duration:0.05,
        })
        tl.to(spanRef,{
            x:2,
            repeat:6,
            yoyo:true,
            duration:0.05,
        })
    }

    return {
        fail_check,
        keyboard_Hooks_id,
        warning_animation_span
    }
}

