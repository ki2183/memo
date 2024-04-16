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
import { useNavigate } from "react-router-dom"

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
    imgs:imgstype[],
    _id:string
}

export type memo_res = {
    data:memo_dto
}

function MemosPage(){

    const {pageNum,pageMax} = useAppSelector(state => state.pageNumber)
    const [jsx_arr,setJsx_Arr] = useState<JSX.Element[]>([])
    const dispatch = useAppDispatch()
    const get_token = localStorage.getItem('token')
    const token = get_token ? JSON.parse(get_token) : null
    const navigate = useNavigate()
    const [delay,setDelay] = useState<boolean>(false)

    const getList = async () => {
        const dto = {_id:token._id}
        const response = await axios.post(`/memos/listPaging/${pageNum}`, dto, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data;
    }


    const { data, refetch ,isLoading } = useQuery(['memoList'], getList)

    const go_login = () =>{
        navigate('/login')    
    }

    useEffect(()=>{
        console.log(get_token)
        const checkToken = async () => {
            try {
                const res = await axios.post('/memos/checkToken', get_token, {
                    headers: {
                        "Content-Type": 'application/json'
                    }
                })
                const tf = res.data; 
                console.log(tf)
                if (!tf) go_login()
            } catch (err) {
                go_login()
            }
        }
       
        const getLength = async () =>{
            try{
                axios.post('/memos/getPageLength',get_token,{
                    headers:{
                        "Content-Type":'application/json'
                    }
                })
                    .then(res => {
                        // console.log(res.data)
                        const page_max = computePageMax({item_length:res.data,postsPerPage})
                        dispatch(changePageMax(page_max))
                    })
                    .catch(err=>{
                        // console.log(err)
                    })
                    
            }catch(err){
                // console.log(err)
            }
        }
        if(!token) navigate("/login")
        checkToken()
        getLength()
        
        setTimeout(()=>{
            setDelay(true)
        },1000)
        
    },[])

    const postsPerPage = 5

    useEffect(()=>{
        refetch()
    },[pageNum])

    useEffect(() => {
        const jsxArr_: JSX.Element[] = [];
        for (let i = 0; i < pageMax; i++) {
          jsxArr_.push(<PageNumber idx={i} key={i}/>);
        }
        setJsx_Arr(jsxArr_);
      }, [pageMax])

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
                        {(!delay || isLoading) && <div>로딩중</div>}
                        {
                            (delay === true &&(data && data.length > 0)) && data.map((item:memo_dto,idx:number)=>(
                                <MemosLI
                                    idx={idx}
                                    date={item.createdAt}
                                    text={item.text}
                                    title={item.title}
                                    key={idx}
                                    _id={item._id}
                                    data={data}
                                />
                            ))
                        }
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
    const { pageNum } = useAppSelector(state => state.pageNumber)
    return (
        <span 
            onClick={onclick_handler}
            className={`select-none cursor-pointer ${pageNum === idx ? "font-bold":""}`}
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
    idx:number,
    _id:string,
    data: memo_dto | any | null
}

function MemosLI({
    _id,
    idx,
    text,
    date,
    data,
    title,
}:MemosLI_type){

    const {li_BorderColor,theme} = useAppSelector(state => state.theme)
    const {pageNum} = useAppSelector(state => state.pageNumber)
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

