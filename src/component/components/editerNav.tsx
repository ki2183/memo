import gsap from "gsap"
import "./editerNav.css"
import { ReactNode, useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { changeTheme } from "../store/slices/theme"
import { useDispatch } from "react-redux"
import { change_nav_menu, change_nav_total } from "../store/slices/navState"
import { useLocation, useNavigate } from "react-router-dom"

function EditNav(){
    return(
        <>
            <EditNavRight/>
        </>
    )
}

export default EditNav

function EditNavRight(){

    const theme = useAppSelector(state => state.theme)
    const { nav_menu,nav_total } = useAppSelector(state => state.navState)
    const navigation = useNavigate()
    const dispatch = useDispatch()

    const move_url = (url:string) =>{
        navigation(`/${url}`)
    }

    const li_arr = [
        {
            title:"main",
            onclick_FNC:()=>{move_url("main")}
        },{
            title:"memos",
            onclick_FNC:()=>{move_url("memos")}
        },{
            title:"write",
            onclick_FNC:()=>{move_url("write")}
        }
    ]

    const max = li_arr.length-1

    useEffect(()=>{
        console.log(nav_total)
        if(nav_total === false){
            const tl = gsap.timeline()
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
        
    },[nav_total])

    useEffect(()=>{
        console.log(nav_menu)

    
    },[nav_menu])

    const onClick_handler_nav_total = (e:React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault()
        dispatch(change_nav_total())
    }
    const onClick_handler_nav_menu = (e:React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault()
        dispatch(change_nav_menu())
    }

    const nav_all_style = {
        backgroundColor: nav_menu ? "#b4b4b454" : "transparent"
    }

    return(
        <div className="container-edit-nav-left" style={{backgroundColor:theme.navColor, borderRight:` 1px solid ${theme.navBorder}`}}>
            <div className="frame-edit-nav-left">
                <div className="nav-title">
                       <span>
                            mem0 
                        </span>
                        <span 
                            className="nav-total-handle-button"
                            onClick={onClick_handler_nav_total}
                        >
                            &lt;
                        </span>
                </div>

                <div className="container-nav-option">

                    <div className="nav-option-all" style={nav_all_style} onClick={onClick_handler_nav_menu}>
                        <span className="nav-option-button">
                            <span>{nav_menu === false ? "-" : "+"}</span>
                        </span>
                        <span>all</span>
                    </div>

                    <ul className="nav-option-ul">
                        {
                            li_arr.length > 0 ? li_arr.map((item,idx)=>(
                                <NavRightLi
                                    key={idx}
                                    idx={idx}
                                    max={max}
                                    title={item.title}
                                    onclick_FNC={item.onclick_FNC}
                                    />
                            )) : null
                        }
                    </ul>
                </div>
                
            </div>
        </div>
    )
}

type NavRightLi_type = {
    idx:number
    title:string
    max:number
    onclick_FNC:()=>void
}

function NavRightLi({idx,title,max,onclick_FNC}:NavRightLi_type){

    const border_color = useAppSelector(state => state.theme.textColor)
    const { nav_menu } = useAppSelector(state => state.navState)
    const location = useLocation()
    const fstRef = useRef<HTMLDivElement>(null)
    const secRef = useRef<HTMLDivElement>(null)
    const trdRef = useRef<HTMLDivElement>(null)
    const fourRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLDivElement>(null)

    const pathname = location.pathname.slice(1)

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
    },[nav_menu])

    const li_up_style_1 = {
        borderRight: idx !== 0 ? `1px solid ${border_color}` : "none",
    }

    const for_fst_style_4 = {
        borderTop:idx === 0 ? `1px solid ${border_color}` : "none",
    }

    const li_center_style_2 = {
        borderBottom: idx !== 0 ? `1px solid ${border_color}` : "none",
    }   

    const li_down_style_3 = {
        borderRight: idx !== max ?`1px solid ${border_color}` : "none"
    }
    
    

    return (
        <li className="nav-option-li" 
            onClick={e=>{
            e.preventDefault()
            onclick_FNC()
        }} >
                            <div className="container-line-li ">
                                <div>
                                    <div ref={fstRef} style={li_up_style_1}/>
                                </div>
                                <div>
                                    <div ref={secRef} style={li_center_style_2}/>
                                </div>
                                <div>
                                    <div ref={trdRef} style={li_down_style_3}/>
                                </div>
                                <div>
                                    <div ref={fourRef} style={for_fst_style_4}/>
                                </div>

                            </div>
                            <span className="option-li-title" ref={titleRef}
                                style={{
                                    textDecoration: pathname === title ? "underline" : "none"
                                }}
                            >
                                {title}
                            </span>
                        </li>
    )
} 
interface AnimationMenu_type{
    idx:number
    max:number
    children : ReactNode
}

export function EditNavTop(){ 

    const [themeTween, setThemeTween] = useState<GSAPTween | null>();
    const theme = useAppSelector(state => state.theme)
    
    const dispatch = useAppDispatch()

    useEffect(() => {
        const tween = gsap.to('.theme-button', {
            duration: 0.3,
            ease: "back.inOut",
            x: "-85%",
        });
        setThemeTween(tween);
    }, []);

    useEffect(() => {
        if (themeTween) {
            if (theme.theme === 'light') {
                themeTween.play();
            } else {
                themeTween.reverse();
            }
        }
    }, [theme, themeTween]);


    return(
        <div className="container-edit-nav-top">
            <button className="frame-theme" onClick={e=>{
                e.preventDefault()
                dispatch(changeTheme())
            }}>
                <div className="theme-button"/>
            </button>
        </div>
    )
}