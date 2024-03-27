import { useState } from 'react'
import Page from '../Page'
import axios from 'axios'
function LoginPage(){

    const [id,setId] = useState<string>('')
    const write = (e:React.ChangeEvent<HTMLInputElement>)=>{
        e.preventDefault()
        setId(e.target.value)
    }
    const submitButton = (e:React.MouseEvent<HTMLButtonElement>) =>{
        e.preventDefault()
        console.log('sss')
        const dto = { userId: id } 
        // axios.post('/memos/checkId',JSON.stringify(dto))
        //     .then(res=>{alert(res)})
        //     .catch(error => console.error('Error:', error) );

        const test = () =>{
            
        axios.get('/memos/test', {
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(res => console.log(res.data))
          .catch(err => console.log(err))
        }
        test()
    }

    return(
        <Page>
            <div className="w-full h-full flex justify-center items-center ">
                <div>
                    <form className='h-auto w-auto flex flex-col'>
                        <input value={id} onChange={write} placeholder='아이디'  className='bg-transparent' type="text" aria-labelledby="name-label" name="user_id"/>
                        <button onClick={submitButton}>보내기</button>
                    </form>
                </div>
            </div>
        </Page>
    )
}

export default LoginPage