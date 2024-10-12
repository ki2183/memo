
import { useDispatch } from "react-redux"
import { ForwardedRef, forwardRef, useRef } from "react"
import { useAppSelector } from "../../../../store/hooks"
import { delImg } from "../../../../store/slices/imgObj"
import { addTextModal, delText } from "../../../../store/slices/text"
import { ALLModalClose, SortModalClose, SortModalOpen, URLModalOpen } from "../../../../store/slices/imgModalState"


const OptionModal = forwardRef(( _ , ref:ForwardedRef<HTMLOListElement>) =>{
    const prevEvent = useRef<string>('')

    // 위치 훅
    const { top,idx } = useAppSelector(state => state.optionXY)

    // imgIdx
    const imgIdx = useAppSelector(state => state.imgIdx)
    //모달 온 클릭 훅

    const { AddHandler,PhotoHandler,DeleteHandler } = OptionHook_text(idx)
    const { ImgDeleteHandler,CheckEvent } = OptionHook_img(prevEvent,idx, imgIdx)
    //모달 빼고 아무데나 클릭하면 모달이 꺼짐


    return(
        <div style={{ top:top-260 }} className="grid w-full absolute mx-auto translate-x-[6rem] translate-y-[3.5rem]">
            <div className={`mx-auto relative`} style={{width:"45rem",}}>
                
                <ol 
                    ref={ref} 
                    id="option-modal" 
                    style={{zIndex:30,gridAutoRows:"1.8rem"}} 
                    className="absolute right-0 ml-auto cursor-pointer z-20 grid overflow-hidden text-[0.8rem] font-bold w-[6rem] h-[auto] rounded-lg">
                    {
                        imgIdx >= 10000 && (
                            <>
                                <li onClick={DeleteHandler} className="select-none option-modal-li p-[0.6rem] flex items-center gap-[0.2rem]">
                                    <span className="material-symbols-outlined text-[1.3rem]">delete</span>
                                    <span>삭제</span>
                                </li> 

                                <li onClick={PhotoHandler} className="select-none option-modal-li p-[0.6rem] flex items-center gap-[0.2rem]">
                                    <span className="material-symbols-outlined text-[1.3rem]">image</span>
                                    <span>사진</span>
                                </li> 

                                <li onClick={AddHandler} className="select-none option-modal-li p-[0.6rem] flex items-center gap-[0.2rem]">
                                    <span className="material-symbols-outlined text-[1.3rem]">add</span>
                                    <span>추가</span>
                                </li> 
                            </>
                        )
                    }
                    {
                        imgIdx < 10000 && (
                            <>
                                <li onClick={ImgDeleteHandler} className="select-none option-modal-li p-[0.6rem] flex items-center gap-[0.2rem]">
                                    <span className="material-symbols-outlined text-[1.3rem]">delete</span>
                                    <span>삭제</span>
                                </li> 

                                <li onClick={CheckEvent} onMouseEnter={CheckEvent} className="select-none option-modal-li p-[0.6rem] flex items-center gap-[0.2rem] relative">
                                    <span className="material-symbols-outlined text-[1.3rem]">image</span>
                                    <span>수정</span>
                                </li> 
                            </>
                        )
                    }
                    
                    
                </ol>
            </div>
        </div>
    )
})

export default OptionModal

/** Option hook 분리 **/
//#region
const OptionHook_text = (idx:number) => {

    const dispatch = useDispatch()
    //삭제
    const DeleteHandler = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()
        if(idx !== 0) dispatch(delText({idx}))
        // dispatch(ALLModalClose())
    }

    const PhotoHandler = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(URLModalOpen())
    }

    const AddHandler = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(addTextModal(idx))
        // dispatch(ALLModalClose())
    }

    return {
        DeleteHandler,
        PhotoHandler,
        AddHandler
    }
}

const OptionHook_img = (prevEvent:React.MutableRefObject<string>,textIdx:number,imgIdx:number) => {
    const dispatch = useDispatch()
    const {sort} = useAppSelector(state => state.imgModalState)
    //삭제
    const ImgDeleteHandler = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(delImg({textIdx,imgIdx}))
        dispatch(ALLModalClose())
    }

    const ImgCorrectionHandler = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(SortModalOpen())
        prevEvent.current = "click"
    }
    
    const CheckEvent = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.preventDefault()

        if (e.type === "click") {
            prevEvent.current = e.type
            if(!sort)
                dispatch(SortModalOpen())
            else
                dispatch(SortModalClose())
        }
    }

    return {
        CheckEvent,
        ImgDeleteHandler,
        ImgCorrectionHandler,
    }
}
//#endregion