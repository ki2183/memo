import { useState } from "react"

const useTitle = () =>{
    const [title, setTitle] = useState<string>("")

    return{
        title,
        setTitle
    }
}

export default useTitle