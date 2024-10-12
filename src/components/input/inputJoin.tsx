import { useEffect, useRef } from "react"
import { formHooks } from "../../useHook/join/joinHooks" 
import { action_RefHooks } from "../../useHook/login/loginHooks" 
import { join_check_type } from "../../page/join/join"


const {keyboard_Hooks_id,keyboard_Hooks_etc} = formHooks()

type onKeyHandler_type = typeof keyboard_Hooks_etc
type onKeyHandler_id_type = typeof keyboard_Hooks_id

type Input_text_join_type = {
    idx:number
    input_type:"password"|"text"
    classname:string,
    placeholder:string,
    inputRefs:React.MutableRefObject<(HTMLInputElement | null)[]>
    change_type:"user_id"|"password_check"|"password"|"name",
    joinButtonRef:React.RefObject<HTMLButtonElement>
    onChangeHandler:(e:React.ChangeEvent<HTMLInputElement>,type:"user_id"|"password_check"|"password"|"name")=>void
    onKeyHandler?:onKeyHandler_type,
    onKeyHandler_id?:onKeyHandler_id_type
}

type Input_ID_type = {
    formDto: join_check_type
    idCheckAfterWrite: ()=> void
    inputRefs:React.MutableRefObject<(HTMLInputElement | null)[]>
    setFormDto: React.Dispatch<React.SetStateAction<join_check_type>>
}

export function Input_ID(props:Input_ID_type){
    const { inputRefs, setFormDto, formDto, idCheckAfterWrite } = props
    
    const {focus_border_animation,blur_border_animation,set_border_initial} = action_RefHooks()
    const { keyboard_Hooks_id } = formHooks()

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        idCheckAfterWrite()
        setFormDto({...formDto,user_id:e.currentTarget.value})
    }

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {keyboard_Hooks_id(e,inputRefs)}

    const borderRef = useRef<HTMLDivElement|null>(null)

    useEffect(()=>{ if(borderRef.current) set_border_initial(borderRef.current)},[])

    const focus_handler = (e:React.FocusEvent<HTMLInputElement>) =>{
        e.preventDefault()
        if(borderRef.current) focus_border_animation(borderRef.current)
    }

    const blur_handler = (e:React.FocusEvent<HTMLInputElement>) =>{
        e.preventDefault()
        if(borderRef.current) blur_border_animation(borderRef.current)
    }

    

    return (
        <div className="w-full h-9 flex flex-col">
            <input 
                type="text"
                placeholder="아이디" 
                onBlur={blur_handler}
                onFocus={focus_handler}
                onChange={onChangeHandler}
                onKeyDown={onKeyDownHandler}
                ref={el =>{inputRefs.current[0] = el}}
                className="bg-transparent outline-none w-full h-full font-mono" 
            />
            <div ref={borderRef} className="borderBottom"/>
        </div>
    )
}

export function Input_text_join({
        idx,
        inputRefs,
        classname,
        input_type,
        placeholder,
        change_type,
        onKeyHandler,
        joinButtonRef,
        onChangeHandler,
        onKeyHandler_id,
    }:Input_text_join_type){

    const {focus_border_animation,blur_border_animation,set_border_initial} = action_RefHooks()

    const borderRef = useRef<HTMLDivElement|null>(null)

    useEffect(()=>{
        if(borderRef.current) set_border_initial(borderRef.current)
    },[])

    const focus_handler = (e:React.FocusEvent<HTMLInputElement>) =>{
        e.preventDefault()
        if(borderRef.current) focus_border_animation(borderRef.current)
    }

    const blur_handler = (e:React.FocusEvent<HTMLInputElement>) =>{
        e.preventDefault()
        if(borderRef.current) blur_border_animation(borderRef.current)
    }

    return <div className={`${classname} w-full h-9 flex flex-col`}>
        <input 
            ref={el =>{inputRefs.current[idx] = el}}
            type={input_type}
            placeholder={placeholder} 
            className=" bg-transparent outline-none w-full h-full font-mono" 
            onFocus={focus_handler}
            onBlur={blur_handler}
            onKeyDown={(e) => {
                return onKeyHandler ? onKeyHandler(idx,e,joinButtonRef,inputRefs) : ((onKeyHandler_id ) ? onKeyHandler_id(e,inputRefs,) : null);
            }}
            
            onChange={e=>{onChangeHandler(e,change_type)}}>
        </input>
        <div ref={borderRef} className="borderBottom"/>
    </div>
}



//아이디 컴포넌트랑 나머지 컴포넌트 분리하고 hook리뉴얼 하는중이였음 useApp으로 스타일 했던거 정상화함

// const focus_border_animation = (el:HTMLDivElement) =>{
//     gsap.to(el,{
//         duration:0.4,
//         scaleX:1,
//         transformOrigin:"left",
//         ease:"power4.inOut"
//     }) 
// }
// const blur_border_animation = (el:HTMLDivElement) =>{
//     gsap.to(el,{
//         duration:0.4,
//         scaleX:0,
//         transformOrigin:"left",
//         ease:"power4.inOut"
//     }) 
// }