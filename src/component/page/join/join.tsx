import Page from '../Page'
function LoginPage(){

    return(
        <Page>
            <div className="w-full h-full flex justify-center items-center ">
                <div>
                    <form className='h-auto w-auto flex flex-col'>
                        <input placeholder='아이디'  className='bg-transparent' type="text" aria-labelledby="name-label" name="user_id"/>
                        <input placeholder='비밀번호'className='bg-transparent' type="password" aria-labelledby="password" name="password"/>
                        <input type='submit'/>
                    </form>
                </div>
            </div>
        </Page>
    )
}

export default LoginPage