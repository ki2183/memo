import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../../store/hooks"
import { ALLModalClose } from "../../../../store/slices/imgModalState"
import { addImg } from "../../../../store/slices/imgObj"
import gsap from "gsap"

const TextURL = forwardRef((props, ref:ForwardedRef<HTMLDivElement>) => {
    const borderColor = useAppSelector(state => state.theme.url_button_border)
    const {idx,top} = useAppSelector(state => state.optionXY)
    const lineRef = useRef<HTMLDivElement>(null)
    const [url,setURL] = useState<string>("")
    const dispatch = useAppDispatch()
    
    /** function **/
    //#region
     
    //insert IMG
    const addImg_handler = ()=> {
        if (url.length === 0) alert('이미지 링크를 넣어주세요')

        else dispatch(addImg({idx,url}))
        
    }

    //for the EnterPress
    const onPress_handler = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addImg_handler()
            dispatch(ALLModalClose())
        }
    }

    //for the click
    const onClick_handler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        addImg_handler()
        dispatch(ALLModalClose())
    }
    //#endregion


    /** animation **/
    //#region

    //포커스 되면 밑줄 쳐지는 효과 블러되면 다시 지움
    const animation = (e: React.FocusEvent<HTMLInputElement, Element>) => {
        if (e.type === "focus") gsap.to(lineRef.current,{ scaleX:1, duration:0.3 })
        else if (e.type === "blur") gsap.to(lineRef.current,{ scaleX:0, duration:0.3 })   
    }

    //초기값 세팅
    useEffect(() => {
        const line = lineRef.current
        if (line) 
            gsap.set(line, { scaleX: 0, transformOrigin: "left" })
    }, [])
    //#endregion
    
    return (
        <div ref={ref} style={{top:top-180}} className="grid absolute z-10 box-border p-2 img-modal w-[400px] h-[100px] bg-white left-[50%] top-[100%] translate-x-[-50%] rounded-lg grid-rows-[1.5fr_1.5fr] gap-2">

            <div className="relative flex items-start text-sm border-b-[1px]">
                <input onKeyDown={onPress_handler} onChange={e=>{e.preventDefault(); setURL(e.target.value)}} onFocus={(e)=>{animation(e)}} onBlur={(e)=>{animation(e)}} placeholder="구글에서 이미지 URL을 복사하여 사용하세요" className="mx-auto w-[94%] h-full bg-transparent outline-none"  type="text"/>
                <div ref={lineRef} style={{backgroundColor:borderColor}} className="absolute w-full h-[1px] top-[100%] translate-y-[-2px]"/>
            </div>

            <div className="w-full h-full flex items-center justify-center">
                <button onClick={onClick_handler} className="text-sm url_button w-full h-[100%] rounded-md border-[1px] border-solid border-[#666]">URL추가하기</button>
            </div>
            
        </div>
    )
})

export default TextURL