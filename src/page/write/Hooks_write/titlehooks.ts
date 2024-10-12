import { adjustTextAreaHeight } from "./etcFCN"

export type title_hooks_change_type = {
    e:React.ChangeEvent<HTMLTextAreaElement>
    setTitle:React.Dispatch<React.SetStateAction<string>>
}

export type title_hooks_keyDown_type = {
    e:React.KeyboardEvent<HTMLTextAreaElement>
    textsRef: React.MutableRefObject<(HTMLTextAreaElement | null)[]>
}

export function title_hooks_onChange({
    e,
    setTitle
}:title_hooks_change_type){
    setTitle(e.target.value)
    adjustTextAreaHeight(e.target)
}
export function title_hooks_keyDown({
    e,
    textsRef
}:title_hooks_keyDown_type){
    if(e.key === "Enter"){
        e.preventDefault()
        textsRef.current[0]?.focus()
    }  
}