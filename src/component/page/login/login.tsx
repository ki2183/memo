import { useEffect, useState } from 'react'
import Page from '../Page'
import axios from 'axios'
import { useQueryClient,QueryClient,QueryClientProvider } from 'react-query'
import { useNavigate } from 'react-router-dom'

type login_type = {
    userId:string
    password:string
}

function LoginPage(){

    const navigate = useNavigate()

    const [loginDto,setLoginDto] = useState<login_type>({
        userId:"",
        password:""
    })

    const onChange_handler = (e:React.ChangeEvent<HTMLInputElement>,type:"userId"|"password")=>{
        e.preventDefault()
        setLoginDto(prev => ({...prev,[type]:e.target.value}))
    }

    const submitButton = (e:React.MouseEvent<HTMLButtonElement>) =>  {
        e.preventDefault()
        
        const login_api = () =>{
            axios.post("/memos/login",loginDto)
            .then((res)=>{
                console.log(res.data)
                localStorage.setItem('token',JSON.stringify(res.data))
            })
            .catch((err) => {console.log(err)})
        }
        login_api()
    }


    useEffect(()=>{
        console.log(loginDto)
    },[loginDto])

    return(
        <Page>
            <div className="w-full h-full flex justify-center items-center ">
                <div>
                    <form className='h-auto w-auto flex flex-col'>
                        <input value={loginDto.userId} onChange={e=>onChange_handler(e,"userId")} placeholder='아이디'  className='bg-transparent' type="text" aria-labelledby="name-label" name="user_id"/>
                        <input value={loginDto.password} onChange={e=>onChange_handler(e,"password")} placeholder='비밀번호' className='bg-transparent' type="password" aria-labelledby="name-label" name="user_id"/>
                        <button onClick={submitButton}>보내기</button>
                        <button onClick={e=>{
                            e.preventDefault()
                            console.log(localStorage.getItem("token"))
                        }}>check</button>
                        <button onClick={e=>{
                            e.preventDefault()
                            
                            navigate('/join')
                            
                        }}>이동</button>
                    </form>
                </div>
            </div>
        </Page>
    )
}

export default LoginPage