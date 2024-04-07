import { useEffect, useRef, useState } from 'react'
import Page from '../Page'
import axios from 'axios'
import { QueryClient, useQueryClient } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { Input_text_join } from '../../components/input/inputJoin'
import { formHooks } from './joinHooks'
import gsap from 'gsap'

type join_type = {
    user_id: string
    password: string
    name: string
}

export interface join_check_type extends join_type {
    password_check:string
}

function JoinPage(){

    const navigate = useNavigate()
    const {fail_check,warning_animation_span,keyboard_Hooks_id,keyboard_Hooks_etc,id_char_check,fail_check_get_num} = formHooks()

    const inputRefs = useRef<Array<HTMLInputElement|null>>([null])
    const warningRefs = useRef<HTMLSpanElement>(null)
    const errSpanRefs = useRef<Array<HTMLSpanElement|null>>([])
    const joinButtonRef = useRef<HTMLButtonElement>(null)
    const [id_check,setId_check] = useState<boolean|null>(null)
    const limitRef =  useRef<boolean>(false)
    const joinLimitRef = useRef<boolean>(false)
    const [formDto,setFormDto] = useState<join_check_type>({
        user_id:"",
        password:"",
        password_check:"",
        name:"",
    })
    const [essential_condition,setEssential_condition] = useState<string>('false')
    
    const formChangeHanler = (e:React.ChangeEvent<HTMLInputElement>,type:"user_id"|"password_check"|"password"|"name") =>{
        e.preventDefault()
        setFormDto(prev => ({...prev,[type]:e.target.value}))
        if(type === "user_id") setId_check(null)
    }

    const checkId_api = () => {
        if(formDto.user_id === ''){
            return 
        }
        axios.post('/memos/checkId',{userId:formDto.user_id})
            .then(res => {
                const tf = res.data
                setId_check(tf)
                if(!tf && warningRefs) warning_animation_span(errSpanRefs,0)
                tf ? inputRefs.current[1]?.focus() :inputRefs.current[0]?.focus()
                console.log(inputRefs.current)
            }).catch(err => console.log(err))
        }

    const join_api = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const { user_id,password,name } = formDto
        limitRef.current = true
        if(essential_condition !== "true"){
            limitRef.current = true
            const failCheck = fail_check(formDto,id_check)
            const idx = fail_check_get_num(failCheck)
            setEssential_condition(failCheck)
            if(idx)
                inputRefs.current[idx]?.focus()
            return
        }

        const sendDto = {
            user_id:user_id,
            password:password,
            name:name
        }
        if(!joinLimitRef.current){
            joinLimitRef.current = true
            axios.post('/memos/join',sendDto)
                .then(res => {
                    joinLimitRef.current = false
                    alert("가입 완료했습니다. 환영합니다!")
                    navigate('/login')
                })
                .catch(err => {
                    console.log(err)
                    joinLimitRef.current = false
                })
        }
        
    }

    useEffect(()=>{
        console.log(formDto)
        if(limitRef.current === true)
            setEssential_condition(fail_check(formDto,id_check))
    },[formDto])

    useEffect(()=>{
        console.log(errSpanRefs.current)
    },[])

    return(
        <Page>
            <div className="w-full h-full flex justify-center items-center ">
                <div>
                    <div className='h-auto w-80 flex flex-col'>
                        <div className='grid gap-2 items-center' style={{gridTemplateColumns:"3fr 0.9fr"}}>
                            <Input_text_join   
                                idx={0}
                                checkId_api={checkId_api}
                                key={0}
                                classname=""
                                inputRefs={inputRefs}
                                input_type='text'
                                placeholder="아이디"
                                change_type='user_id'
                                joinButtonRef={joinButtonRef}
                                onChangeHandler={formChangeHanler}
                                onKeyHandler_id={keyboard_Hooks_id}
                            
                            />
                            <button className='w-full h-8 text-xs' onClick={e=>{
                                e.preventDefault()
                                checkId_api()
                            }}>중복확인</button>
                        </div>

                        <span 
                        ref={
                            el=>errSpanRefs.current[0] = el
                        }
                        className={`err-span mt-1 mb-3 text-xs font-mono ${id_check === true ? "text-green-500" : (id_check === false ? "text-red-500":(limitRef.current === true ? "text-red-500":"text-gray-400"))}`}>
                   
                                {
                                    !id_char_check(formDto.user_id) ?
                                        "특수문자 공백 한글 불가능":
                                        (formDto.user_id.length < 6 ?
                                            "6자 이상":
                                            (
                                                id_check === null ?
                                                    "중복 체크 필수입니다.":
                                                    id_check === true ?
                                                        "사용가능한 아이디입니다.":
                                                        "사용불가능한 아이디입니다."   
                                            )
                                        )
                                        
                                }
                        </span>

                        <Input_text_join   
                            idx={1}
                            classname=""
                            inputRefs={inputRefs}
                            input_type='text'
                            placeholder="닉네임"
                            change_type='name'
                            onChangeHandler={formChangeHanler}
                            joinButtonRef={joinButtonRef}
                            key={1}
                            onKeyHandler={keyboard_Hooks_etc}
                        />

                        {
                            essential_condition === "name" ? (
                                <span
                                className='err-span mt-1 mb-3 text-xs font-mono text-red-500'>
                                    닉네임을 입력하세요.
                                </span>
                                ) : (null)
                        }

                        <Input_text_join   
                            idx={2}
                            classname=""
                            inputRefs={inputRefs}
                            input_type='password'
                            placeholder="비밀번호"
                            change_type='password'
                            onChangeHandler={formChangeHanler}
                            joinButtonRef={joinButtonRef}
                            key={2}
                            onKeyHandler={keyboard_Hooks_etc}
                        />

                        {
                            essential_condition === "password" ? (
                                <span className='mt-1 mb-3 text-xs font-mono text-red-500'>
                                    {
                                        formDto.password.length === 0 ?
                                        "비밀번호를 입력하세요.":
                                        "6자리 이상 입력하세요."
                                    }
                                </span>
                                ) : (null)
                        }

                         <Input_text_join   
                            idx={3}
                            classname=""
                            inputRefs={inputRefs}
                            input_type='password'
                            placeholder="비밀번호 확인"
                            change_type='password_check'
                            onChangeHandler={formChangeHanler}
                            joinButtonRef={joinButtonRef}
                            key={3}
                            onKeyHandler={keyboard_Hooks_etc}

                        />

                        {
                            essential_condition === "password_check" ? (
                                <span className='mt-1 mb-3 text-xs font-mono text-red-500'>
                                    비밀번호가 일치하지 않습니다.
                                </span>
                                ) : (null)
                        } 

                        <button 
                            disabled={joinLimitRef.current}
                            className='h-9' 
                            onClick={join_api}
                            ref={joinButtonRef}
                        >가입</button>
                    </div>
                </div>
            </div>
        </Page>
    )
}

export default JoinPage

