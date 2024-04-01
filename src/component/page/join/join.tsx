import { useEffect, useRef, useState } from 'react'
import Page from '../Page'
import axios from 'axios'
import { QueryClient, useQueryClient } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'

type join_type = {
    user_id: string
    password: string
    name: string
}

interface join_check_type extends join_type {
    password_check:string
}

function JoinPage(){

    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const formRef = useRef<Array<HTMLInputElement|null>>([])
    const [formDto,setFormDto] = useState<join_check_type>({
        user_id:"",
        password:"",
        password_check:"",
        name:"",
    })
    
    const formChangeHanler = (e:React.ChangeEvent<HTMLInputElement>,type:"user_id"|"password_check"|"password"|"name") =>{
        e.preventDefault()
        setFormDto(prev => ({...prev,[type]:e.target.value}))
    }

    const checkId_api = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(formDto.user_id === ''){
            alert('공백입니다.')
            return 
        }
        axios.post('/memos/checkId',{userId:formDto.user_id})
          .then(res => console.log(res.data))
          .catch(err => console.log(err))
    }

    const join_api = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const { user_id,password,name } = formDto
        if((user_id === "" || password === "") || name === ""){
            alert("빈공간")
            return
        }
        const sendDto = {
            user_id:user_id,
            password:password,
            name:name
        }

        axios.post('/memos/newUser',sendDto)
        .then(res => alert("성공"))
        .catch(err => console.log(err))
    }

    useEffect(()=>{
        console.log(formDto)
    },[formDto])

    return(
        <Page>
            <div className="w-full h-full flex justify-center items-center ">
                <div>
                    <form className='h-auto w-auto flex flex-col'>
                        <div>
                            <input   
                                type="text" 
                                name="user_id"
                                placeholder='아이디'  
                                className='bg-transparent' 
                                aria-labelledby="name-label" 
                                ref={el => {
                                    formRef.current[0] = el
                                }}
                                value={formDto.user_id}
                                onChange={e=>{formChangeHanler(e,"user_id")}}
                            />
                            <button onClick={checkId_api}>중복확인</button>
                        </div>
                                
                        <input   
                                type="text" 
                                name="name"
                                placeholder='이름'  
                                className='bg-transparent' 
                                aria-labelledby="name-label" 
                                ref={el => {
                                    formRef.current[1] = el
                                }}
                                value={formDto.name}
                                onChange={e=>{formChangeHanler(e,"name")}}
                         />

                        <input 
                            name="password"
                            type="password"
                            placeholder='비밀번호'
                            className='bg-transparent' 
                            aria-labelledby="password" 
                            ref={el => {
                                formRef.current[2] = el
                            }}
                            value={formDto.password}
                            onChange={e=>{formChangeHanler(e,"password")}}
                        />
                        <input 
                            name="password_check"
                            type="password" 
                            placeholder='비밀번호 확인'
                            className='bg-transparent' 
                            aria-labelledby="password" 
                            ref={el => {
                                formRef.current[3] = el
                            }}
                            value={formDto.password_check}
                            onChange={e=>{formChangeHanler(e,"password_check")}}
                        />
                        <button onClick={join_api}>가입</button>
                        <button onClick={e=>{
                            e.preventDefault()
                            const tokenData = queryClient.getQueryData('token');
                            console.log(tokenData);
                        }}>check</button>
                        <button onClick={e=>{
                            e.preventDefault()
                            
                            navigate('/login')
                            
                        }}>이동</button>
                    </form>
                </div>
            </div>
        </Page>
    )
}

export default JoinPage

