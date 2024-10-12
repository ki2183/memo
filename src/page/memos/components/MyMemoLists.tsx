import { useNavigate, useSearchParams } from "react-router-dom"
import useMemoPageHook from "../../../useHook/memos/memosApiHooks"
import { imgstype } from "../../../store/slices/imgs"
import { useAppSelector } from "../../../store/hooks"
import { useQuery } from "@tanstack/react-query" 
import React, { useEffect, useRef } from "react"
import { overText } from "../../../useHook/memos/pagehooks"


export type memo_dto = {
    createdAt:string,
    title:string,
    text:string[],
    imgs:imgstype[],
    _id:string
}

export type memo_res = {
    data:memo_dto
}


function MyMemoListComponent() {
    return (
        <ul className="memos-frame-ul">
            <MyMemoLists/>
        </ul>
    )
}

export default React.memo(MyMemoListComponent)

function MyMemoLists() {

    const [searchParams] = useSearchParams()
    const pageNumber = searchParams.get('page')
    const { getListDto } =  useMemoPageHook()

    const { data } = useQuery({
        queryKey: ['memoList',Number(pageNumber) - 1 + ""],  
        queryFn: ()=> getListDto(Number(pageNumber) - 1),
        staleTime : 1000 * 60 * 5

    })

    return (
        <>
            {data && data.length > 0 && data.map((item: memo_dto, idx: number) => {
                const item_ = { ...item, date: item.createdAt }

                return (
                    <MemoListComponent
                        idx={idx}
                        key={idx}
                        data={data}
                        {...item_}
                    />
                )

            })}
        </>
    )
}






/** memoList Component **/
//#region

type MemosLI_type = {
    date:string,
    title:string,
    text: string[],
    idx:number,
    _id:string,
    data: memo_dto | any | null
}

function MemoListComponent({
    _id,
    idx,
    text,
    date,
    data,
    title,
}:MemosLI_type){

    const {li_BorderColor,theme} = useAppSelector(state => state.theme)
    const bottomBorderRef = useRef<HTMLDivElement>(null)
    const rightBorderRef = useRef<HTMLDivElement>(null)
    const spanRef1 = useRef<HTMLSpanElement>(null)
    const spanRef2 = useRef<HTMLSpanElement>(null)
    const spanRef3 = useRef<HTMLSpanElement>(null)
    const navigate = useNavigate()

    let border = theme === 'dark' ? `1px solid ${li_BorderColor}` : `2px solid ${li_BorderColor}`
    
    useEffect(()=>{
        const tl = gsap.timeline()
        tl.set(bottomBorderRef.current,{
            scaleX:0            
        }) 
        tl.set(rightBorderRef.current,{
            scaleY:0
        })
        tl.to(rightBorderRef.current,{
            scaleY:1,
            duration:0.2,
            transformOrigin:"top"
        },(0 + 0.2*idx))
        tl.to(bottomBorderRef.current,{
            scaleX:1,
            duration:0.4,
            transformOrigin:"right"
        },(0.2 + 0.1*idx))
        tl.fromTo(spanRef1.current,{
            x:-5,
            opacity:0,
        },{
            duration:0.2,
            opacity:1,
            x:0
        },0 + 0.1*idx)
        tl.fromTo(spanRef2.current,{
            x:-5,
            opacity:0,
        },{
            duration:0.2,
            opacity:1,
            x:0
        },0 + 0.15*idx)
        tl.fromTo(spanRef3.current,{
            x:-5,
            opacity:0,
        },{
            duration:0.2,
            opacity:1,
            x:0
        },0 + 0.2*idx)
        
    },[data])

    const extract_date = () =>{return date.slice(0,10)}

    const onClick_title = (e:React.MouseEvent<HTMLSpanElement>) =>{
        e.preventDefault()
        navigate("/memo", { state: { memo_id: _id } });
    }
    
    const title_skip = (title:string)=>{
        if(title.length < 17) return title
        const title_ = title.slice(0,17) + "..."
        return title_
    }

    return(
        <li className="memos-frame-li">
            <div ref={bottomBorderRef} className="memo-frame-li-in-mirror" style={{borderBottom:border}}/>
            <div ref={rightBorderRef} className="memo-frame-li-in-mirror" style={{borderRight:border}}/>
            <div className="memo-frame-li-in">
                <span ref={spanRef1} className="cursor-pointer" onClick={onClick_title}>{title_skip(title)}</span>
                <span ref={spanRef2}>{extract_date()}</span>
                <span ref={spanRef3}>{overText(text[0])}</span>
            </div>

        </li>
    )
}

//#endregion







