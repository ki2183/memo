import { useEffect, useState } from 'react'
import Page from '../Page'
import axios from 'axios'

type login_type = {
    userId:string
    password:string
}

function LoginPage(){

    const [loginDto,setLoginDto] = useState<login_type>({
        userId:"",
        password:""
    })

    const onChange_handler = (e:React.ChangeEvent<HTMLInputElement>,type:"userId"|"password")=>{
        e.preventDefault()
        setLoginDto(prev => ({...prev,[type]:e.target.value}))
    }

    const submitButton = async (e:React.MouseEvent<HTMLButtonElement>) =>  {
        e.preventDefault()
        
        const login_api = () =>{
            axios.post("/memos/login",loginDto)
            .then((res)=>{console.log(res.data)})
            .catch((err) => {console.log(err)})
        }
        await login_api()
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
                    </form>
                </div>
            </div>
        </Page>
    )
}

export default LoginPage