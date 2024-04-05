import { join_check_type } from "./join";

export function formHooks(){
    const fail_check = (formDto:join_check_type,id_check:boolean|null) => {
        if(id_check !== false && id_check !== null){
            return "user_id"
        }else if(formDto.name === ""){
            return "name"
        }else if(formDto.password === ""){
            return "password"
        }else if(formDto.password.length<4){
            return "password_length"
        }else if(formDto.password !== formDto.password_check){
            return "password_check"
        }
        return "true"
    }
    return {
        fail_check
    }
}