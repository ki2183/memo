import { OptionModalOpen } from "../../../../store/slices/imgModalState"
import { setOptionXY } from "../../../../store/slices/optionXY"
import { changeImgIdx } from "../../../../store/slices/imgIdx"
import { useAppDispatch } from "../../../../store/hooks"
import React from "react"

interface IOptionButton {
    idx:number
    imgIdx?:number
}

const OptionButton:React.FC<IOptionButton> = (props) =>{
    const dispatch = useAppDispatch()
    const {idx,imgIdx} = props

    //left top 반환
    const onClick_handler = (e:React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        const span = e.currentTarget.getBoundingClientRect()
        const { top } = span
        
        //height 설정
        dispatch(setOptionXY({idx,top:top + window.scrollY}))

        //버튼 클릭 했을 때 꺼져야해서 추가
        dispatch(OptionModalOpen())

        //ImgIdx 넘겨줌
        if (typeof imgIdx === "number") dispatch(changeImgIdx(imgIdx))

        //Number type이 아니면 초기화
        else dispatch(changeImgIdx(10000))
    }

    return(
        <div className="option-button relative" >
                <span onClick={onClick_handler} className="optionButton material-symbols-outlined">
                    more_vert
                </span>
        </div>
    )
}

export default React.memo(OptionButton)
