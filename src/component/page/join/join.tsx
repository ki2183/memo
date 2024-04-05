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
    const {fail_check} = formHooks()
    const inputRefs = useRef<Array<HTMLInputElement|null>>([])
    const [id_check,setId_check] = useState<boolean|null>(null)
    const [formDto,setFormDto] = useState<join_check_type>({
        user_id:"",
        password:"",
        password_check:"",
        name:"",
    })
    const joinCheckRef = useRef<string>("false")
    
    const formChangeHanler = (e:React.ChangeEvent<HTMLInputElement>,type:"user_id"|"password_check"|"password"|"name") =>{
        e.preventDefault()
        setFormDto(prev => ({...prev,[type]:e.target.value}))
        if(type === "user_id") setId_check(null)
    }

    const checkId_api = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(formDto.user_id === ''){
            alert('공백입니다.')
            return 
        }
        axios.post('/memos/checkId',{userId:formDto.user_id})
            .then(res => {
                setId_check(res.data)
            }).catch(err => console.log(err))
    }

    const join_api = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const { user_id,password,name } = formDto
        if((user_id === "" || password === "") || name === ""){
            const t = fail_check(formDto,id_check)
            joinCheckRef.current = fail_check(formDto,id_check)
            alert(t)
            return
        }
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
                            ref={inputRefs}
                            input_type='text'
                            placeholder="아이디"
                            change_type='user_id'
                            onChangeHandler={formChangeHanler}
                            
                            />
                            <button className='w-full h-8 text-xs' onClick={checkId_api}>중복확인</button>
                        </div>

                        <span className={`mt-1 mb-3 text-xs font-mono ${id_check === true ? "text-green-500" : (id_check === null ? "text-gray-400":"text-red-500")}`}>
                            { id_check === true ? "사용가능한 아이디입니다.": (id_check === null ? "중복체크 필수입니다." : "사용 불가능한 아이디입니다.")}
                        </span>

                        <Input_text_join   
                            idx={1}
                            classname=""
                            ref={inputRefs}
                            input_type='text'
                            placeholder="닉네임"
                            change_type='name'
                            onChangeHandler={formChangeHanler}
                        />

                        <span className='mt-1 mb-3 text-xs font-mono text-red-500'>
                            하하
                        </span>

                        <Input_text_join   
                            idx={2}
                            classname=""
                            ref={inputRefs}
                            input_type='password'
                            placeholder="비밀번호"
                            change_type='password'
                            onChangeHandler={formChangeHanler}
                        />

                        <span className='mb-3'></span>

                        <Input_text_join   
                            idx={3}
                            classname=""
                            ref={inputRefs}
                            input_type='password'
                            placeholder="비밀번호 확인"
                            change_type='password_check'
                            onChangeHandler={formChangeHanler}

                        />

                        <span className='mb-3'></span>

                        <button className='h-9' onClick={join_api}>가입</button>
                    </div>
                </div>
            </div>
        </Page>
    )
}

export default JoinPage

