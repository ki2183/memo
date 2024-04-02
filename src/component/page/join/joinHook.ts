import axios from "axios"
import { join_check_type } from "./join"

export function joinHooks(){
    const checkId_api = (id:string) => {
        const dto = JSON.stringify({userId:id})
        axios.post('/memos/checkId',dto,{headers: {'Content-Type': 'application/json'}})
            .then(res => {
                console.log(dto)
                console.log(res.data)
            })
            .catch(err => console.log(err))
    }
    // join_check_type
    // join_type

    const join_api = (formDto:join_check_type) => {
        const {name,password,user_id} = formDto
        const dto = {
            user_id:user_id,
            password:password,
            name: name
        }

        axios.post('/memos/join',JSON.stringify(dto),{headers: {'Content-Type': 'application/json'}})
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }

    return {
        checkId_api,
        join_api
    }
}

// 민족통일 분단극복의 과제
// 민주사상 경제발전 문화창조 === 근대화
// 


