import { useEffect } from "react"
import { useAppSelector } from "../../../../store/hooks"
import { img_url_tf_type } from "../../edit"
import "./url_field.css"
import gsap from "gsap"

type URLfield_type = {
    idx:number
    urlText:string
    openURL: img_url_tf_type
    urlRef: React.RefObject<HTMLDivElement>
    textReset_URL: ()=> void
    onChangeHandler_URL:(e: React.ChangeEvent<HTMLInputElement>) => void
    keyDownHandler_URL:(e: React.KeyboardEvent<HTMLInputElement>) => void
}


function URLfield({
    idx,
    urlRef,
    urlText,
    openURL,
    textReset_URL,
    keyDownHandler_URL,
    onChangeHandler_URL
}:URLfield_type){

    const urlInputCheck = useAppSelector(state => state.urlInputCheck)

    useEffect(()=>{ 
        if(openURL.tf && idx === openURL.idx){
            gsap.to(urlRef.current,{
                display:"block",
                height:"30px",
                marginBottom:"4px",
                duration:0.3,
                ease:"power2.inOut"
            })
        }else if(urlInputCheck.tf === false || idx !== urlInputCheck.idx){
            const tl = gsap.timeline()
            tl.to(urlRef.current,{
                height:"0px",
                duration:0.3,
                marginBottom:"0px",
                ease:"power2.inOut"
            })
            tl.to(urlRef.current,{
                display:"none"
            })
        }
        textReset_URL() //닫히거나 열리면 url정보 삭제
    },[openURL])   //url 애니메이션

    return (
        <div className="insert-url" ref={urlRef}>
                <input 
                    spellCheck="false"
                    type="text" 
                    placeholder="구글에서 이미지 주소 복사 뒤 엔터를 누르세요."
                    className="insert-url-input"
                    value={urlText}
                    onChange={onChangeHandler_URL}
                    onKeyDown={keyDownHandler_URL}
                />
            </div>
    )
}

export default URLfield