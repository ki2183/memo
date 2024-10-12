import { useRef, useState } from "react"

const useOption = () => {
    const [option_open,setOption_open] = useState<boolean>(false)

    const optionClose = () => setOption_open(false)
    
    const optionOpen = () => setOption_open(true)

    return {
        option_open,
        optionOpen,
        optionClose
    }
}

export default useOption

export type useOption_type = ReturnType<typeof useOption>