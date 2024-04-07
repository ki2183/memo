import { useAppDispatch, useAppSelector } from "../../store/hooks"
import "./memosPage.css"
import Page from "../Page"
import { imgstype } from "../../store/slices/imgs"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { changePageMax, changePageNum } from "../../store/slices/page"
import { computePageMax, getPageInfo, overText } from "./hooks/pagehooks"
import { useQuery } from "react-query"
import axios from "axios"
import { contextType } from "react-modal"

type test_type = {
    date:string,
    title:string,
    text: string[],
    imgs: imgstype[],
}

export type memo_dto = {
    createdAt:string,
    title:string,
    text:string[],
    imgs:imgstype[]
}

// export type memoList_dto ={
//     _id:,
//     createAt
// }

function MemosPage(){

    const {pageNum,pageMax} = useAppSelector(state => state.pageNumber)
    const [jsx_arr,setJsx_Arr] = useState<JSX.Element[]>([])
    const [dto,setDto] = useState<memo_dto[]>([])
    const dispatch = useAppDispatch()
    const get_token = localStorage.getItem('token')
    const token = get_token ? JSON.parse(get_token) : null


    const getList = async () => {
        const response = await axios.post("/memos/MemoList", token, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }
    const { data, isLoading, error } = useQuery(['memoList'], getList)

    useEffect(()=>{
        if(data && data.memos){
            const memos = data.memos.reverse()
            setDto(memos)
        }
        
    },[data])

    const testDto = [{
        date:"2024-03-22",
        title:"24",
        text:["이어지는 가지마다 수놓았던..."],
        imgs:[],
    },{
        date:"2024-03-22",
        title:"25",
        text:["이어지는 가지마다 수놓았던..."],
        imgs:[],
    },{
        date:"2024-03-22",
        title:"26",
        text:["이어지는 가지마다 수놓았던..."],
        imgs:[],
    },{
        date:"2024-03-22",
        title:"27",
        text:["이어지는 가지마다 수놓았던..."],
        imgs:[],
    },{
        date:"2024-03-22",
        title:"우리의 밤을 외워요",
        text:["다가온 이별을 알아요 밤 비..."],
        imgs:[],
    },{
        date:"2024-03-22",
        title:"꿈을 꿨어요",
        text:["멀어진 꿈 되돌아 갈순 없지만..."],
        imgs:[],
    },{
        date:"2024-03-22",
        title:"나무",
        text:["그대 춤을 추는 나무 같아요..."],
        imgs:[],
    },{
        date:"2024-03-22",
        title:"31",
        text:["이어지는 가지마다 수놓았던..."],
        imgs:[],
    }]

    // const dto_ = data.reverse()
    const postsPerPage = 5

    useEffect(()=>{
        if(data && data.memos){
            const len = data.memos.length
            const page_max = computePageMax({item_length:len,postsPerPage})
            dispatch(changePageMax(page_max))
        }
        
    },[data])

    useEffect(()=>{
        if(data && data.memos){
            const dto_mirror = getPageInfo({memo_dto:data.memos,pageNum,postsPerPage})
            setDto(dto_mirror)
        }
    },[pageNum])

    useEffect(() => {
        const jsxArr_: JSX.Element[] = [];
        for (let i = 0; i < pageMax; i++) {
          jsxArr_.push(<PageNumber idx={i}/>);
        }
        setJsx_Arr(jsxArr_);
      }, [pageMax]);

    useEffect(()=>{
        console.log(dto)
    },[dto])

    return (
        <Page>
            <div className="w-full h-full flex justify-center">
                <div/>
                <div className="container-memos">
                    <div className="title-memos">
                        <span>
                            내 메모들
                        </span>
                    </div>
                    <ul className="memos-frame-ul">
                        
                        {
                            (dto && dto.length) > 0 && dto.map((item,idx)=>(
                                <MemosLI
                                    idx={idx}
                                    date={item.createdAt}
                                    text={item.text}
                                    title={item.title}
                                    key={idx}
                                />
                            ))
                        }
                        {/* {
                            ( data && (data.memos && data.memos.length > 0 )) && data.memos.map((item:any,idx:number)=>(
                                <MemosLI
                                    idx={idx}
                                    date={item.createdAt}
                                    text={item.text}
                                    title={item.title}
                                    key={idx}
                                />
                            ))
                        } */}

                    </ul>
                    <div className="frame-memos-paging">
                        <ul>
                            {
                              jsx_arr
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </Page>
    )
}

type PageNumber_type = {
    idx:number
}

const PageNumber = ({idx}:PageNumber_type) =>{

    const dispatch = useAppDispatch()
    const onclick_handler = (e:React.MouseEvent<HTMLSpanElement>) =>{
        e.preventDefault()
        dispatch(changePageNum(idx))
    }
    return (
        <span 
            onClick={onclick_handler}
            className="select-none cursor-pointer"
        >
            {idx + 1}
        </span>
    )
}

export default MemosPage

type MemosLI_type = {
    date:string,
    title:string,
    text: string[],
    idx:number
}

function MemosLI({
    idx,
    text,
    date,
    title,
}:MemosLI_type){

    const {li_BorderColor,theme} = useAppSelector(state => state.theme)
    const {pageNum} = useAppSelector(state => state.pageNumber)
    const bottomBorderRef = useRef<HTMLDivElement>(null)
    const rightBorderRef = useRef<HTMLDivElement>(null)
    const spanRef1 = useRef<HTMLSpanElement>(null)
    const spanRef2 = useRef<HTMLSpanElement>(null)
    const spanRef3 = useRef<HTMLSpanElement>(null)

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
        
    },[pageNum])

    const extract_date = () =>{

        return date.slice(0,10)
    }

    return(
        <li className="memos-frame-li">
            <div ref={bottomBorderRef} className="memo-frame-li-in-mirror" style={{borderBottom:border}}/>
            <div ref={rightBorderRef} className="memo-frame-li-in-mirror" style={{borderRight:border}}/>
            <div className="memo-frame-li-in">
                <span ref={spanRef1}>{title}</span>
                <span ref={spanRef2}>{extract_date()}</span>
                <span ref={spanRef3}>{overText(text[0])}</span>
            </div>

        </li>
    )
}

