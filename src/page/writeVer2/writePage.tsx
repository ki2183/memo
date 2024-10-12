import "./writePage.css"
import React from "react"
import Page from "../../components/Page"
import Title from "./componenet/title/title"
import { useAppSelector } from "../../store/hooks"
import TextURL from "./componenet/textURL/textURL"
import useTitle from "../../useHook/writeVer2/title" 
import useModal from "../../useHook/writeVer2/useModal"
import WriteSpace from "./componenet/writeSpace/writeSpace"
import ImgControl from "./componenet/imgControl/imgControl"
import OptionModal from "./componenet/optionModal/optionModal"
import useTextArea from "../../useHook/writeVer2/useTextarea" 
 
const WritePageVer2 = () => {
    //modal에 전달할 ref
    const {
        urlRef,
        sortRef,
        optionRef,
    } = useModal()
    
    const useText = useTextArea()
    const {titleRef,onChange_text,onBlurText} = useTitle()
    const {url,sort,option} = useAppSelector(state => state.imgModalState) //for SORT

    //useMemo해도 ref가 이어져있어서 쩔수 없이 렌더 그렇다고 권장되지 않는 dom쓰기도 좀 뭐함
    const TitlePressEnter = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
        
        if (e.key === "Enter") {
            e.preventDefault()
            const ref = useText.textsRef.current[0]

            if(ref) ref.focus()
        }
        
    } 

    return(
            <Page>
            
                <div className="container-edit relative">

                    <div className="frame-edit">
                        <div id="divide-area"/>
                        
                        <div>

                            <Title
                                ref={titleRef}                                
                                spellCheck="false" 
                                onBlur={onBlurText}
                                onKeyDown={TitlePressEnter}      
                                placeholder="제목을 입력하세요." 
                            />
                   
                            <WriteSpace {...useText}/>
                      

                        </div>

                        <div className="h-[20rem]"/>

                    </div>

                    {/* 옵션 모달들 */}
                    { url === true && <TextURL ref={urlRef}/> }    
                    { sort === true && <ImgControl ref={sortRef}/> }
                    { option === true && <OptionModal ref={optionRef}/> }
                    
                </div>
            
            </Page>

    )
}

export default React.memo(WritePageVer2)



