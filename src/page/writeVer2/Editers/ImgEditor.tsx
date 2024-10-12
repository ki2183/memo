
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import OptionButton from "../componenet/optionButton/optionButton"
import { dndImgToImg, IImg } from "../../../store/slices/imgObj"
import { useDrag, useDrop } from "react-dnd"
import React from "react"

interface IImages {
    imgDTO:IImg
    imgIdx:number
    textIdx:number
}

function ImgEditor(props:IImages){
    const {textIdx,imgIdx} = props
    const {ref} = useDNDHook({imgIdx,textIdx})
    const imgObj = useAppSelector(state => state.imgObj[textIdx]?.[imgIdx])

    const sort = {
        right:"flex-end",
        left:"flex-start",
        center:"center",
    }

    const optionButtonProps = {idx:textIdx,imgIdx:imgIdx}

    return (
        <div className="min-h-[30px] grid grid-cols-[auto_30px] w-full h-auto pl-[30px] mb-[1rem]">
            <div style={{ justifyContent:sort[imgObj.sort]}} className="flex items-center transform-gpu">

                <img ref={ref} src={imgObj.url} width={typeof imgObj.scale === "number" ? imgObj.scale+"%" : "auto"} />

            </div>

            <OptionButton {...optionButtonProps}/>

        </div>
    )
}

//메모를 사용하여 값이 같으면 패치안함 객체라서 효율 꽤 괜찮음
export default React.memo(ImgEditor)


/** DND HOOK **/
//#region 
export interface DragItem{
    imgIdx: number
    textIdx: number
}

const useDNDHook = ({imgIdx,textIdx}:DragItem) => {
    const dispatch = useAppDispatch()

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "IMG",
        item:()=>{ 
            return {imgIdx,textIdx}
        },
        
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),        

      }))
    
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "IMG",
        drop: (item:DragItem) => {
            const drop = {imgIdx,textIdx}
            const draged = {imgIdx:item.imgIdx,textIdx:item.textIdx}
            dispatch(dndImgToImg({draged,drop}))
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver({shallow:true}),
        }),
    }))

    let ref = (el:HTMLImageElement) => { if(el) drag(drop(el)) }

    return {
        ref,
    }
}
//#endregion