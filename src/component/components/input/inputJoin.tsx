import { MutableRefObject, useEffect, useRef } from "react"
import { action_RefHooks } from "../../page/login/loginHooks"
import { useAppSelector } from "../../store/hooks"

type Input_text_join_type = {
    idx:number
    input_type:"password"|"text"
    classname:string,
    placeholder:string,
    inputRefs:React.MutableRefObject<(HTMLInputElement | null)[]>
    change_type:"user_id"|"password_check"|"password"|"name",
    onChangeHandler:(e:React.ChangeEvent<HTMLInputElement>,type:"user_id"|"password_check"|"password"|"name")=>void
    onKeyHandler?:(e:React.KeyboardEvent<HTMLInputElement>) => void,
    onKeyHandler_id?:(e:React.KeyboardEvent<HTMLInputElement>) => void
}

export function Input_text_join({
        idx,
        inputRefs,
        classname,
        input_type,
        placeholder,
        change_type,
        onKeyHandler,
        onChangeHandler,
        onKeyHandler_id,
    }:Input_text_join_type){

    const {focus_border_animation,blur_border_animation,set_border_initial} = action_RefHooks()
    const {li_BorderColor} = useAppSelector(state => state.theme)
    const borderStyle = {
        borderBottom:`1px solid ${li_BorderColor}`
    }

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
            ref={el => {
                if(inputRefs.current && inputRefs.current[idx])
                    inputRefs.current[idx] = el
            }}
            type={input_type}
            placeholder={placeholder} 
            className="bg-transparent outline-none w-full h-full font-mono" 
            onFocus={focus_handler}
            onBlur={blur_handler}
            onKeyDown={(e) => {
                return onKeyHandler ? onKeyHandler(e) : (onKeyHandler_id ? onKeyHandler_id(e) : null);
            }}
            
            onChange={e=>{onChangeHandler(e,change_type)}}>
        </input>
        <div ref={borderRef} style={borderStyle}/>
    </div>
}

