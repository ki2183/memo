import { Input_ID, Input_text_join } from '../../components/input/inputJoin'
import { formHooks, formAPIHooks } from '../../useHook/join/joinHooks' 
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Page from '../../components/Page'
import axios from 'axios'


export type join_type = {
    user_id: string
    password: string
    name: string
}

export interface join_check_type extends join_type {
    password_check?:string
}

function JoinPage(){

    const navigate = useNavigate()
    const apiURL = process.env.REACT_APP_API_URL
    const { checkId } = formAPIHooks()
    const {
        warning_animation_span,
        fail_check_get_num,
        keyboard_Hooks_etc,
        id_char_check,
        fail_check,
    } = formHooks()
    

    const inputRefs = useRef<Array<HTMLInputElement|null>>([null])
    const errSpanRefs = useRef<Array<HTMLSpanElement|null>>([])
    const joinButtonRef = useRef<HTMLButtonElement>(null)
    const warningRefs = useRef<HTMLSpanElement>(null)
    const joinLimitRef = useRef<boolean>(false)
    const limitRef =  useRef<boolean>(false)

    const [id_check,setId_check] = useState<boolean|null>(null)

    const [formDto,setFormDto] = useState<join_check_type>({
        user_id:"",
        password:"",
        password_check:"",
        name:"",
    })

    const [essential_condition,setEssential_condition] = useState<string>('false')

    const idCheckAfterWrite = () => setId_check(null)
    
    const reg = new RegExp("^(?=.*[A-Za-z]{2,})(?=.*\\d{2,}).{6,}$");


    const formChangeHandler = (e:React.ChangeEvent<HTMLInputElement>,type:"user_id"|"password_check"|"password"|"name") =>{
        e.preventDefault()
        setFormDto(prev => ({...prev,[type]:e.target.value}))
        if(type === "user_id") setId_check(null)
    }
   
    const onClickHandler_checkID = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (!reg.test(formDto.user_id)) return 
        console.log(formDto.user_id)
        const checkString = id_char_check(formDto.user_id)

        if(!checkString) return

        checkId(formDto.user_id).then(tf => {
            setId_check(tf)

            //true 사용가능한 아이디 다음 input으로 포커싱
            if (tf) inputRefs.current[1]?.focus() 
            
            //false 사용불가능 아이디 input으로 포커싱 및 애니메이션
            else {
                if(warningRefs) warning_animation_span(errSpanRefs,0)
                inputRefs.current[0]?.focus()
            }
        })
        
    }

    const join_api = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const userDto = {...formDto} 
        delete userDto.password_check

        const dtoCheck = fail_check(formDto,id_check)

        if (dtoCheck !== "true") {
            limitRef.current = true
            const failCheck = dtoCheck
            const idx = fail_check_get_num(failCheck)
            setEssential_condition(failCheck)

            if(idx !== undefined) inputRefs.current[idx]?.focus()

            return
        }        

        if(!joinLimitRef.current){
            joinLimitRef.current = true
            axios.post(`${apiURL}/memos/join`,userDto)
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

    

    useEffect(()=>{ if(limitRef.current === true) setEssential_condition(fail_check(formDto,id_check)) },[formDto])

    return(
        <Page>
            <div className="w-full h-full flex justify-center items-center ">
                <div>
                    <div className='h-auto w-80 flex flex-col'>
                        <div className='grid gap-2 items-center' style={{gridTemplateColumns:"3fr 0.9fr"}}>
                            <Input_ID idCheckAfterWrite={idCheckAfterWrite} inputRefs={inputRefs} formDto={formDto} setFormDto={setFormDto}/>
                            <button className='w-full h-8 text-xs' onClick={onClickHandler_checkID}>중복확인</button>
                        </div>

                        <span ref={el=>errSpanRefs.current[0] = el} className={`err-span mt-1 mb-3 text-xs font-mono ${id_check === true ? "text-green-500" : (id_check === false ? "text-red-500":(limitRef.current === true ? "text-red-500":"text-gray-400"))}`}>
                   
                                {
                                    !id_char_check(formDto.user_id) ?
                                        "특수문자 공백 한글 불가능":
                                        (formDto.user_id.length < 6 ?
                                            "6자 이상 알파벳 2개 숫자 2개 이상":
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
                            onChangeHandler={formChangeHandler}
                            joinButtonRef={joinButtonRef}
                            key={1}
                            onKeyHandler={keyboard_Hooks_etc}
                        />

                        {
                            essential_condition === "name" ? (
                                <span className='err-span mt-1 mb-3 text-xs font-mono text-red-500'>
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
                            onChangeHandler={formChangeHandler}
                            joinButtonRef={joinButtonRef}
                            key={2}
                            onKeyHandler={keyboard_Hooks_etc}
                        />

                        {
                            essential_condition === "password" ? (
                                <span className='mt-1 mb-3 text-xs font-mono text-red-500'>
                                    { formDto.password.length === 0 ?
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
                            onChangeHandler={formChangeHandler}
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
                            className='h-9 mt-4' 
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

