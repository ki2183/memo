import { useEffect, useRef, useState } from 'react'
import Page from '../Page'
import { useNavigate } from 'react-router-dom'
import { LoginHooks, action_RefHooks, login_type } from './loginHooks'
import { useAppSelector } from '../../store/hooks'


function LoginPage(){

    const navigate = useNavigate()

    const {
        login_handler,
        check_inputDto_null,
        onChange_handler_loginInfo
    } = LoginHooks()

    const {
        focus_handler,
        warning_animation,
        blur_border_animation,
        focus_border_animation,
    } = action_RefHooks()
    const [warning_text,setWarning_text] = useState<"userId"|"password"|"login_fail"|"initial">("initial")
    const [inputDto,setInputDto] = useState<login_type>({
        userId:"",
        password:""
    })

    const idRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const frameRef = useRef<HTMLDivElement>(null)
    const bordersRef = useRef<Array<HTMLDivElement|null>>([])
    const {li_BorderColor} = useAppSelector(state => state.theme)

    const borderStyle = {
        borderBottom:`1px solid ${li_BorderColor}`
    }

    useEffect(()=>{
        console.log(inputDto)
    },[inputDto])

    const submit_handler = async (e:React.MouseEvent<HTMLButtonElement>) =>{
        const null_check = check_inputDto_null({e,inputDto})
        let nullCheck = "initial" as "userId"|"password"|"login_fail"|"initial"
        if(null_check === "userId"||null_check === "password") { //정보 빈.
            focus_handler(null_check === "userId" ? idRef : passwordRef)
            setWarning_text(null_check)
            nullCheck = null_check
        }else{
            await login_handler({e,inputDto,navigate})       
            setWarning_text('login_fail')
            nullCheck = 'login_fail'
            // alert('일치하는 정보가 없습니다!')
        }
        warning_animation(frameRef)
    }

    useEffect(()=>{
        localStorage.removeItem('token')
        bordersRef.current.forEach(item=>{
            if(item !== null)
                blur_border_animation(item)
        })
    },[])

    useEffect(()=>{
        console.log(warning_text)
    },[])

    const key_handler = (e:React.KeyboardEvent<HTMLInputElement>,type:"userId"|"password") => {
        if(e.key === "Enter"){
            e.preventDefault()
            if(type === "userId"){
                passwordRef.current?.focus()
            }
        }
    }

    return(
        <Page>
            <div className="w-full h-full flex justify-center items-center ">
                <div ref={frameRef} className='h-auto w-80'>
                    <form className='h-auto w-auto flex flex-col items-center gap-2'>
                    <   div className='w-full'>
                            <input  
                                type="text" 
                                name="user_id"
                                placeholder='아이디'  
                                ref={idRef}
                                value={inputDto.userId}
                                onKeyDown={e=>{
                                    key_handler(e,"userId")
                                }}
                                onFocus={e => {
                                    e.preventDefault();
                                    if (bordersRef.current[0]) {
                                        focus_border_animation(bordersRef.current[0]);
                                    }
                                }}
                                onBlur={e => {
                                    e.preventDefault();
                                    if (bordersRef.current[0]) {
                                        blur_border_animation(bordersRef.current[0]);
                                    }
                                }}
                                className='font-mono appearance-none bg-transparent w-full h-8 outline-none ' 
                                onChange={e=>onChange_handler_loginInfo({e,info_type:"userId",setInputDto})} 
                            />
                            <div ref={el => bordersRef.current[0] = el} className='login-input-border1' style={borderStyle}/>
                        </div>
                        
                        <div className='w-full'>
                            <input  
                                type="password"
                                name="user_password"
                                placeholder='비밀번호'
                                ref={passwordRef}
                                value={inputDto.password} 
                                onFocus={e => {
                                    e.preventDefault();
                                    if (bordersRef.current[1]) {
                                        focus_border_animation(bordersRef.current[1]);
                                    }
                                }}
                                onBlur={e => {
                                    e.preventDefault();
                                    if (bordersRef.current[1]) {
                                        blur_border_animation(bordersRef.current[1]);
                                    }
                                }}
                                className='font-mono appearance-none bg-transparent w-full h-8 outline-none ' 
                                onChange={e=>onChange_handler_loginInfo({e,info_type:"password",setInputDto})}  
                            />
                            <div ref={el => bordersRef.current[1] = el} className='login-input-border2' style={borderStyle}/>
                        </div>
                        
                        <button 
                            className='h-10 w-full font-mono' 
                            onClick={submit_handler}
                        >로그인</button>

                        <div
                        onClick={e=>{
                            e.preventDefault()
                            navigate('/join')
                        }}
                        className='relative w-full cursor-pointer text-sm font-light'>
                            <span className='absolute left-0 font-mono' style={{transform:"translate(0.4px,0.4px)",color: "#999999"}}>회원가입</span>
                            <span className='absolute left-0 font-mono' style={{color: "#3c5299"}}>회원가입</span>
                        </div>
                    </form>
                </div>
            </div>
        </Page>
    )
}

export default LoginPage