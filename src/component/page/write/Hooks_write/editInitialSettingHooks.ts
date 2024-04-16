import axios from "axios"
import { useAppDispatch } from "../../../store/hooks"
import { change_imgs, reset_imgs } from "../../../store/slices/imgs"
import { changeText_arr, resetText } from "../../../store/slices/text"

type initial_setting_type = {
    setTitle:React.Dispatch<React.SetStateAction<string>>
    pathname:string
    state:null|undefined|{memo_id:string}
    goLogin:()=>void
}

export function EditInitialSettingHooks(){
    const dispatch = useAppDispatch()
    const reset_dto = (resetTitle:()=>void) =>{
        dispatch(resetText())
        dispatch(reset_imgs())
        resetTitle()
    }

    const initial_setting = ({
        state,
        goLogin,
        pathname,
        setTitle
    }:initial_setting_type) =>{
        const memoDto = localStorage.getItem('memo')
        const dto = memoDto ? JSON.parse(memoDto) : null
        const get_token = localStorage.getItem('token')
        const token = get_token ? JSON.parse(get_token) : null

        if(pathname === "/write"){
            if(dto){
                if(dto.title)
                    setTitle(dto.title)
                if(dto.text)
                    dispatch(changeText_arr(dto.text))
                if(dto.imgs)
                    dispatch(change_imgs(dto.imgs))
            }else{
                localStorage.removeItem("memo")
            }

        }else if(pathname === "/memo"){
            if(state && state.memo_id){
                const memo_id = state.memo_id
                const user_id = token._id
                axios.post('memos/viewMemo',JSON.stringify({memo_id,user_id,token:token.token}),{
                    headers:{
                        "Content-Type":'application/json'
                    }
                })
                    .then(res =>{
                        const getDto = res.data.memos[0]
                        if(!res.data.memos[0]) goLogin()
                        setTitle(getDto.title)
                        dispatch(changeText_arr(getDto.text))
                        dispatch(change_imgs(getDto.imgs))
                    })
                    .catch(err => console.log(err))
            
            }
        }
    }

        const checkToken = (goLogin:()=>void) =>{
            axios.post('/memos/checkToken',localStorage.getItem('token'),{ headers:{ "Content-Type":"application/json"}})
                .then(result => {
                    if(!result)
                        goLogin()
                })
                .catch(err =>{goLogin()})
        } 

    return {
        reset_dto,
        checkToken,
        initial_setting
    }
}