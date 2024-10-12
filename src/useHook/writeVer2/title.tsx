import { useRef, useState } from "react"

const useTitle = () =>{
    const [title,setTitle] = useState<string>("")
    const titleRef = useRef<HTMLTextAreaElement>(null)
    const onChange_text = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        setTitle(e.currentTarget.value)
    }

    const onBlurText = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        setTitle(e.currentTarget.value)
    }


    return {
        title,
        titleRef,
        setTitle,
        onBlurText,
        onChange_text
    }
}

export default useTitle