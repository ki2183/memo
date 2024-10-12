import { useAppDispatch, useAppSelector } from "../../../../store/hooks"
import React, { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react"
import { controlImgScale, controlImgSort } from "../../../../store/slices/imgObj"
// import { CloseModal } from "../../../../store/slices/imgModalState"

const ImgControl = forwardRef((props,ref:ForwardedRef<HTMLOListElement>) => {

    const {idx,top} = useAppSelector(state => state.optionXY)
    const imgIdx = useAppSelector(state => state.imgIdx)

    const {
        imgSortLeft,
        imgSortRight,
        imgSortCenter,
        imgScaleHandler,
        autoScaleHandler,
    } = ModalHook(idx,imgIdx)

    return (
        <div onClick={e=>e.stopPropagation()} style={{top:top-175, 
        }} className="absolute w-[100%] h-0">
            <div className="w-[45rem] h-0 mx-auto">
                <ol ref={ref} id="option-modal" className="ml-auto mr-[3px] cursor-pointer z-20 grid overflow-hidden text-[0.8rem] font-bold w-[6rem] h-[auto] rounded-lg" style={{zIndex: 30,gridAutoRows: "1.8rem"}}>
                    
                    <li onClick={imgSortLeft} className="option-li select-none option-modal-li p-[0.6rem] flex items-center gap-[0.2rem]">
                        <span className="material-symbols-outlined text-[1.3rem]">align_justify_flex_start</span>
                        <span>left</span>
                    </li>

                    <li onClick={imgSortCenter} className="option-li select-none option-modal-li p-[0.6rem] flex items-center gap-[0.2rem]">
                        <span className="material-symbols-outlined text-[1.3rem]">fit_width</span><span>center</span>
                    </li>

                    <li onClick={imgSortRight} className="option-li select-none option-modal-li p-[0.6rem] flex items-center gap-[0.2rem]">
                        <span className="material-symbols-outlined text-[1.3rem]">align_justify_flex_end</span>
                        <span>right</span>
                    </li>

                    <li onClick={autoScaleHandler} className="option-li select-none option-modal-li p-[0.6rem] flex items-center gap-[0.2rem]">
                        <span className="material-symbols-outlined text-[1.3rem]">hdr_auto</span><span>auto</span>
                    </li>

                    <li className="option-li select-none option-modal-li p-[0.6rem] flex items-center gap-[0.2rem]">
                        <input onChange={imgScaleHandler} type="range" className="w-full" min={5} max={100} step={5}/>
                    </li>

                </ol>
            </div>
            
        </div>
    )
})

export default ImgControl

//이미지 크기 조절 + 정렬 핸들러
const ModalHook = (textIdx:number,imgIdx:number) => {
    const dispatch = useAppDispatch()
    
    const imgScaleHandler = (e: React.ChangeEvent<HTMLInputElement>) =>{
        e.preventDefault()
        const value = parseInt(e.target.value)
        dispatch(controlImgScale({imgIdx,textIdx,value}))
    }

    const autoScaleHandler = (e: React.MouseEvent<HTMLLIElement>) =>{
        e.preventDefault()
        dispatch(controlImgScale({imgIdx,textIdx,value:"auto"}))
    }
    const imgSortLeft = (e:React.MouseEvent<HTMLLIElement>) => {
        dispatch(controlImgSort({imgIdx,textIdx,sort:"left"}))
    }

    const imgSortRight = (e:React.MouseEvent<HTMLLIElement>) => {
        dispatch(controlImgSort({imgIdx,textIdx,sort:"right"}))
    }

    const imgSortCenter = (e:React.MouseEvent<HTMLLIElement>) => {
        dispatch(controlImgSort({imgIdx,textIdx,sort:"center"}))
    }


    return {
        imgSortLeft,
        imgSortRight,
        imgSortCenter,
        imgScaleHandler,
        autoScaleHandler,
    }
}