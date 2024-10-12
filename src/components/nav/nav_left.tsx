import gsap from "gsap"
import "./nav_left.css"
import { useDispatch } from "react-redux"
import React, { useEffect, useRef } from "react"
import { useAppSelector } from "../../store/hooks"
import { resetText } from "../../store/slices/text"
import { reset_imgs } from "../../store/slices/imgs"
import { useQueryClient } from "@tanstack/react-query"
import useMemoPageHook from "../../useHook/memos/memosApiHooks"
import { useLocation, useNavigate } from "react-router-dom"
import { change_nav_menu, change_nav_total } from "../../store/slices/navState"
 

const NavLeft = React.memo(() => {
    const { nav_menu,nav_total } = useAppSelector(state => state.navState)
    const navigation = useNavigate()
    const dispatch = useDispatch()

    const getToken = localStorage.getItem('token')
    const token = getToken ? JSON.parse(getToken): null



    /** React-query for Memos DTO **/
    //#region


    /** Hooks **/
    //#region
    useEffect(()=>{
        const tl = gsap.timeline()
        if(nav_total === false){
            
            tl.to('.container-edit-nav-left',{
                duration:0.5,
                left:"-271px",
                ease:"power1.in"
            })
            tl.to('.nav-total-handle-button',{
                rotateY:180,
                scaleX:0.1,
                duration:0.1,

            })
            tl.to('.nav-total-handle-button',{
                rotateY:180,
                scaleX:1,
                duration:0.1,
            })
        }else{
            const tl = gsap.timeline()
            tl.to('.container-edit-nav-left',{
                duration:0.5,
                left:0,
                ease:"power1.inOut"
            })
            tl.to('.nav-total-handle-button',{
                scaleX:0.1,
                duration:0.1,

            })
            tl.to('.nav-total-handle-button',{
                rotateY:0,
                scaleX:1,
                duration:0.1,
            })
        }
        
        return ()=>{
            tl.kill()
        }
    },[nav_total])


    const onClick_handler_nav_total = (e:React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault()
        dispatch(change_nav_total())
    }
    const onClick_handler_nav_menu = (e:React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault()
        dispatch(change_nav_menu())
    }

    //#endregion

    return(
        <div className="container-edit-nav-left">
            <div className="frame-edit-nav-left">

                {/* TITLE */}
                <div className="nav-title">

                        <div className="frame-nav-title-login">
                            <span>mem0</span>
                        </div>
                      
                        <span 
                            className="nav-total-handle-button"
                            onClick={onClick_handler_nav_total}
                        >
                            &lt;
                        </span>

                </div>


                {/* Navlist */}
                <div className="container-nav-option">

                    <div className="nav-option-all" onClick={onClick_handler_nav_menu}>
                        <span className="nav-option-button">
                            <span>{nav_menu === false ? "+" : "-"}</span>
                        </span>
                        <span>all</span>
                    </div>

                    <ul className="nav-option-ul">
                        <NavLists/>
                    </ul>

                </div>
                
            </div>


            {/* empty box */}
            <div/>


            {/* login button */}
            <LoginButton/>


        </div>
    )
})

export default NavLeft

function LoginButton(){

    const navigation = useNavigate()
    
    const getToken = sessionStorage.getItem('token')
    const token = getToken ? JSON.parse(getToken): null

    return(
        <span
                onClick={e=>{
                    e.preventDefault()
                    if(token){
                        //token삭제 api만들어야함
                        sessionStorage.removeItem('token')
                        navigation('/login')
                    }
                    navigation('/login')
                }}
                className="login-button"
        >{token ? "logout":"login"}</span>
    )
}

/** NavLeft List Component **/

//#region

function NavLists(){

    const dispatch = useDispatch()

    const location = useLocation()     
    const navigation = useNavigate()
    
    const getToken = localStorage.getItem('token')
    const token = getToken ? JSON.parse(getToken): null

    //동일한 경로 제외
    const PathLimit = (url:string) => {
        const PATH = location.pathname
        const URL = '/' + url.split('?')[0]
      
        return !(PATH == URL)
    }

    const moveURL = (url:string) => navigation(`/${url}`)


    /** React-query for Memos DTO **/
    //#region
    const { getListDto, getLength } = useMemoPageHook()

    const queryClient = useQueryClient()

    async function handleGetLength() {
        try {
            const length = await getLength()
            return length
        } 
        
        catch (err) {
            console.error('ERR fetching length:', err)
        }

    }

    //prefetch 페이지 MAX넘버 훅
    async function prefetchPageMax() {
    
        if(token !== null){
            try {
                await queryClient.prefetchQuery({
                    queryKey: ['pageMax'],  
                    queryFn: handleGetLength,
                    staleTime: 1000 * 60 * 5
                })
                
            } catch (err) {
                console.error('ERR fetching length:', err)
            }
        }
    }

    //prefetch 리스트 DTO들 훅
    const prefetchList = async () => {
        if(token !== null){
            await queryClient.prefetchQuery({
                queryKey: ['memoList',"0"],
                queryFn: ()=> getListDto(0),
                staleTime: 1000 * 60 * 5
            })
        }
    }

    const listArr:Array<eventFunc> = [
        {
            title:"main",
            moveUrl:"/main",
            onclick_FNC:()=>{moveURL("main")}
        },{
            title: "memos",
            moveUrl:"/memos?page=1",
            onclick_FNC:()=>{if (PathLimit("memos?page=1")) moveURL("memos?page=1")},
            onMouseenter:(e:React.MouseEvent<HTMLLIElement, MouseEvent>)=>{
                e.preventDefault()
                prefetchList()
                prefetchPageMax()
            }
        },{
            title:"write",
            moveUrl:"/write",
            onclick_FNC:()=>{
                if (PathLimit('write')) {
                    dispatch(resetText())
                    dispatch(reset_imgs())
                    moveURL("write")

                }
            }
        },{
            title:"로그인 없이 write(개선ver)",
            moveUrl:"/write2",
            onclick_FNC:()=>{
                if (PathLimit('write2')) {
                    dispatch(resetText())
                    dispatch(reset_imgs())
                    moveURL("write2")

                }
            }
        }
    ]

    return (
        <>
            {
                listArr.length > 0 ? listArr.map((item,idx) => (
                    <NavLeftLi
                        {...item}
                        key={idx}
                        idx={idx}
                        max={listArr.length - 1}
                        />

                )) : null
            }
        </>
    )
}

type eventFunc = {
    title:string
    moveUrl:string
    onclick_FNC?:()=>void
    onMouseenter?:(e:React.MouseEvent<HTMLLIElement, MouseEvent>)=>void
    onMouseleave?:(e:React.MouseEvent<HTMLLIElement, MouseEvent>)=>void
}

interface NavLeft_Li_type extends eventFunc{
    idx:number
    max:number
}

function NavLeftLi({
    max,
    idx,
    title,
    moveUrl,
    onMouseleave,
    onMouseenter,
    onclick_FNC
}:NavLeft_Li_type){

    const { nav_menu } = useAppSelector(state => state.navState)
    const fstRef = useRef<HTMLDivElement>(null)
    const secRef = useRef<HTMLDivElement>(null)
    const trdRef = useRef<HTMLDivElement>(null)
    const fourRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLDivElement>(null)

    /** animation **/
    //#region
    useEffect(()=>{        

        const tl = gsap.timeline()
        if(nav_menu === true){
            gsap.to(titleRef.current,{
                opacity:1,
                duration:0.2,
            })
            if(idx === 0){
                tl.to(fourRef.current,{
                    transformOrigin: "right top",
                    scaleX:1,
                    duration:0.2
                })
                tl.to(trdRef.current,{
                    transformOrigin: "right top",
                    scaleY:1,
                    duration:0.2
                })
            }else if(idx === max){
                tl.to(secRef.current,{
                    transformOrigin: "right",
                    scaleX:1,
                    duration:0.2
                })
                tl.to(fstRef.current,{
                    transformOrigin: "top",
                    scaleY:1,
                    duration:0.2
                })    
            }else{
                tl.to(secRef.current,{
                    transformOrigin: "right",
                    scaleX:1,
                    duration:0.2
                })
                tl.to(fstRef.current,{
                    transformOrigin: "bottom",
                    scaleY:1,
                    duration:0.2
                },0.2)
                tl.to(trdRef.current,{
                    transformOrigin: "top",
                    scaleY:1,
                    duration:0.2
                },0.2)
            }
        }else{
            gsap.to(titleRef.current,{
                opacity:0,
                duration:0.2,
            })
            if(idx === 0){
                tl.to(trdRef.current,{
                    transformOrigin: "left top",
                    scaleY:0,
                    duration:0.2
                })
                tl.to(fourRef.current,{
                    transformOrigin: "right bottom",
                    scaleX:0,
                    duration:0.2
                })
            }else if(idx === max){
                tl.to(fstRef.current,{
                    transformOrigin: "left top",
                    scaleY:0,
                    duration:0.2
                }) 
                tl.to(secRef.current,{
                    transformOrigin: "right",
                    scaleX:0,
                    duration:0.2
                })
                 
            }else{
                
                tl.to(fstRef.current,{
                    transformOrigin: "bottom",
                    scaleY:0,
                    duration:0.2
                },0)
                tl.to(trdRef.current,{
                    transformOrigin: "top",
                    scaleY:0,
                    duration:0.2
                },0)
                tl.to(secRef.current,{
                    transformOrigin: "right",
                    scaleX:0,
                    duration:0.2
                },0.2)
            }
        }
        return ()=>{
            tl.kill()
        }
    },[nav_menu])

   
    //#endregion
    
    

    return (
            <li className="nav-option-li" 
                onClick={onclick_FNC}
                onMouseEnter={onMouseenter} 
                onMouseLeave={onMouseleave}                
            >
                    <div className="container-line-li">
                        <div>
                            <div className="li_up_style1" ref={fstRef}/>
                        </div>
                        <div>
                            <div className="li_up_style2" ref={secRef}/>
                        </div>
                        <div>
                            <div className="li_up_style3" ref={trdRef}/>
                        </div>
                        <div>
                            <div className="li_up_style4" ref={fourRef}/>
                        </div>

                    </div>
                    <span className="option-li-title" ref={titleRef}>
                        {title}
                    </span>
                </li>
    )
} 

//#endregion