import { useEffect, useRef, useState } from 'react'
import Page from '../Page'
import axios from 'axios'
import { QueryClient, useQueryClient } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { Input_text_join } from '../../components/input/inputJoin'
import { formHooks } from './joinHooks'

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
    const {fail_check,warning_animation_span} = formHooks()

    const inputRefs = useRef<Array<HTMLInputElement|null>>([null])
    const warningRefs = useRef<HTMLSpanElement>(null)
    const joinButtonRef = useRef<HTMLButtonElement>(null)
    const [id_check,setId_check] = useState<boolean|null>(null)
    const limitRef =  useRef<boolean>(false)
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
                if(!tf && warningRefs) warning_animation_span(warningRefs)
                
            }).catch(err => console.log(err))
        }

    const join_api = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const { user_id,password,name } = formDto
        limitRef.current = true
        if(essential_condition !== "true") return

        const sendDto = {
            user_id:user_id,
            password:password,
            name:name
        }

        // axios.post('/memos/newUser',sendDto)
        // .then(res => alert("성공"))
        // .catch(err => console.log(err))
    }

    useEffect(()=>{
        console.log(formDto)
        if(limitRef.current === true)
            setEssential_condition(fail_check(formDto,id_check))
    },[formDto])

    return(
        <Page>
            <div className="w-full h-full flex justify-center items-center ">
                <div>
                    <div className='h-auto w-80 flex flex-col'>
                        <div className='grid gap-2 items-center' style={{gridTemplateColumns:"3fr 0.9fr"}}>
                            <Input_text_join   
                                idx={0}
                                classname=""
                                inputRefs={inputRefs}
                                input_type='text'
                                placeholder="아이디"
                                change_type='user_id'
                                onChangeHandler={formChangeHanler}
                            
                            />
                            <button className='w-full h-8 text-xs' onClick={e=>{
                                e.preventDefault()
                                checkId_api()
                            }}>중복확인</button>
                        </div>

                        <span 
                        ref={warningRefs}
                        // ref={el=>{
                        //     if(warningRefs.current && warningRefs.current[0])
                        //         warningRefs.current[0] = el
                        // }} 
                        className={`mt-1 mb-3 text-xs font-mono ${id_check === true ? "text-green-500" : (id_check === null ? "text-gray-400":"text-red-500")}`}>
                            { id_check === true ? "사용가능한 아이디입니다.": (id_check === null ? "중복체크 필수입니다." : "사용 불가능한 아이디입니다.")}
                        </span>

                        <Input_text_join   
                            idx={1}
                            classname=""
                            inputRefs={inputRefs}
                            input_type='text'
                            placeholder="닉네임"
                            change_type='name'
                            onChangeHandler={formChangeHanler}
                        />

                        {
                            essential_condition === "name" ? (
                                <span className='mt-1 mb-3 text-xs font-mono text-red-500'>
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
                        />

                        {
                            essential_condition === "password" ? (
                                <span className='mt-1 mb-3 text-xs font-mono text-red-500'>
                                    비밀번호를 입력하세요.
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

                        />

                        {
                            essential_condition === "password_check" ? (
                                <span className='mt-1 mb-3 text-xs font-mono text-red-500'>
                                    비밀번호가 일치하지 않습니다.
                                </span>
                                ) : (null)
                        }

                        <button 
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

