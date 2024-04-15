import { join_check_type } from "./join";
import gsap from "gsap";
export function formHooks(){
    
    const fail_check = (formDto:join_check_type,id_check:boolean|null) => {
        if(id_check === false || id_check === null){
            return "user_id"
        }else if(formDto.name === ""){
            return "name"
        }else if(formDto.password === "" || formDto.password.length < 6){
            return "password"
        }else if(formDto.password !== formDto.password_check){
            return "password_check"
        }
        return "true"
    }

    const fail_check_get_num = (fail_check:string) => {
        if(fail_check === "user_id") return 0
        else if(fail_check === "name") return 1
        else if(fail_check === "password") return 2
        else if(fail_check === "password_check") return 3
    }

    const keyboard_Hooks_etc = ( //엔터 => 다음 input 포커싱 input 마지막이면 join버튼 포커싱
        idx:number,
        e:React.KeyboardEvent<HTMLInputElement>,
        joinButtonRef:React.RefObject<HTMLButtonElement>,
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
        checkId_api:()=>void,
        e:React.KeyboardEvent<HTMLInputElement>,
        inputRefs:React.MutableRefObject<(HTMLInputElement | null)[]>,
    ) =>{
        if(e.key === 'Enter'){
            e.preventDefault()
            checkId_api()
        }
    }

    const warning_animation_span = (
        errSpanRefs:React.MutableRefObject<(HTMLSpanElement | null)[]>,
        idx:number
    ) =>{
        const tl = gsap.timeline()
        tl.set(errSpanRefs.current[idx],{
            x:0
        })
        tl.to(errSpanRefs.current[idx],{
            x:-2,
            duration:0.05,
        })
        tl.to(errSpanRefs.current[idx],{
            x:2,
            repeat:6,
            yoyo:true,
            duration:0.05,
        })
        tl.to(errSpanRefs.current[idx],{
            x:0,
            duration:0.05,
        })
    }

    const id_char_check = (user_id:string) =>{
        const regex = /[^A-Za-z0-9]/g
        return !regex.test(user_id)
    }

    return {
        fail_check,
        id_char_check,
        keyboard_Hooks_id,
        keyboard_Hooks_etc,
        fail_check_get_num,
        warning_animation_span
    }
}

