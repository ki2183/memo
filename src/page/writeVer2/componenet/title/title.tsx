import { forwardRef, TextareaHTMLAttributes } from "react"
import "./title.css"

//혹시 몰라 extends함
export interface ITitle extends TextareaHTMLAttributes<HTMLTextAreaElement>{}

const Title = forwardRef<HTMLTextAreaElement, ITitle>((
    props,ref
)=>{
    return (
        <textarea 
            ref={ref}
            {...props}
            className="title-edit" 
        /> 
    )
})

export default Title