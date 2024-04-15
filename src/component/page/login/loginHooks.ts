import axios from "axios"
import { NavigateFunction } from "react-router-dom"
import gsap from "gsap"
import "./login.css"
export type login_type = {
    userId:string
    password:string
}

type onChange_handler_loginInfo_type = {
    e:React.ChangeEvent<HTMLInputElement>,
    info_type:"userId"|"password",
    setInputDto: React.Dispatch<React.SetStateAction<login_type>>
}

type login_handler_type = {
    inputDto:login_type,
    navigate: NavigateFunction,
    e:React.MouseEvent<HTMLButtonElement>
}

type check_inputDto_null_type = {
    inputDto:login_type
    e:React.MouseEvent<HTMLButtonElement>
}

export function LoginHooks(){
    const onChange_handler_loginInfo=({e,info_type,setInputDto}:onChange_handler_loginInfo_type)=>{
        e.preventDefault()
        setInputDto(prev => ({...prev,[info_type]:e.target.value}))
    }
    const login_handler = async ({inputDto,navigate,e}:login_handler_type) =>{
        e.preventDefault()
        try{
            const res = await axios.post('/memos/login',inputDto) as any
            if(!res.data || !res.data.token) {return null}
            localStorage.setItem('token',JSON.stringify(res.data))
            console.log(localStorage.getItem('token'))
            navigate('/main')
        }catch{
            console.log("server_api_err")
            return null
        }        
    }//토큰get ? (-> mainPage) : 동작을 안하는

    const check_inputDto_null = ({inputDto,e}:check_inputDto_null_type):boolean|"userId"|"password" => {
        e.preventDefault()
        if(!inputDto.userId || !inputDto.password)
            return !inputDto.userId ? "userId" : "password"
        return true
    }
    //둘다 빈: false return, 하나씩만 빈:type return, 다 채운: true

    return {
        onChange_handler_loginInfo,
        check_inputDto_null,
        login_handler
    }
}

export function action_RefHooks(){
    const focus_handler = (ref:React.RefObject<HTMLInputElement>)=>{
        ref.current?.focus()
    }
    const warning_animation = (
        frameRef:React.RefObject<HTMLDivElement>,
    ) =>{

        const tl = gsap.timeline()
        tl.set(frameRef.current,{
            x:0
        })
        tl.to(frameRef.current,{
            x:-2,
            duration:0.05,
        })
        tl.to(frameRef.current,{
            x:2,
            repeat:6,
            yoyo:true,
            duration:0.05,
        })
    }

    const focus_border_animation = (el:HTMLDivElement) =>{
        gsap.to(el,{
            duration:0.4,
            scaleX:1,
            transformOrigin:"left",
            ease:"power4.inOut"
        }) 
    }
    const blur_border_animation = (el:HTMLDivElement) =>{
        gsap.to(el,{
            duration:0.4,
            scaleX:0,
            transformOrigin:"left",
            ease:"power4.inOut"
        }) 
    }

    const set_border_initial = (el:HTMLDivElement) =>{
        gsap.set(el,{
            scaleX:0,
            transformOrigin:"left",
        }) 
    }

    return {
        focus_handler,
        warning_animation,
        set_border_initial,
        blur_border_animation,
        focus_border_animation,
    }
}