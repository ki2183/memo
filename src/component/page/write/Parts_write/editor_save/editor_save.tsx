import { useEffect, useRef, useState } from "react"
import "./editor_save.css"
import gsap from "gsap"
import { useAppSelector } from "../../../../store/hooks"


export function EditorSave(){

    const [width,setWidth] = useState(0)
    
    const resize_func = () => setWidth(window.innerWidth)

    useEffect(()=>{
        resize_func()
        window.addEventListener('resize',resize_func)
        return ()=>{
            window.removeEventListener('resize',resize_func)
        }
    },[])

    return (
        width > 1600 ? <EditorSaveBigWindow width={width}/> : <EditorSaveSmallWindow/>
    )
}

type EditorSaveBigWindow_type = {
    width:number
}

function EditorSaveBigWindow({width}:EditorSaveBigWindow_type){
    const theme =  useAppSelector(state => state.theme)
    const {textColor,bgColor,li_BorderColor} = theme
    const saveWindow = useRef<HTMLDivElement>(null)
    const ballRef = useRef<HTMLDivElement>(null)
    const ball2Ref = useRef<HTMLDivElement>(null)
    const ball3Ref = useRef<HTMLDivElement>(null)

    const bigStyle = {
        width:"270px",
        height:"100vh"
    }


    useEffect(()=>{
        gsap.set(ballRef.current, {
            xPercent: -50, 
            yPercent: -50,
            top:"20%"
            ,width:"3rem",
            height:"3rem",
        });
        gsap.set(ball2Ref.current, {
            xPercent: -50, yPercent: -50,
            top:"20%",
            width:"3rem",
            height:"3rem",
            border: `2px solid ${li_BorderColor}`
        })
        gsap.set(ball3Ref.current, {
            xPercent: -50, yPercent: -50,
            top:"20%",
            width:"4rem",
            height:"4rem",
            border: `2px solid ${li_BorderColor}`
        })


        const moveBall_fnc = (x:number, y:number,ref:React.RefObject<HTMLDivElement>,duration:number) => {
            gsap.to(ref.current, {
                duration,
                left: x,
                top: y,
                ease: "power3"
            });
        };

        const MouseOverBall_fnc = (ref:React.RefObject<HTMLDivElement>) => {
            gsap.to(ref.current, {
                duration: 0.5,
                scale:1.2,
                ease: "power3",
                fontWeight:"bold",
                // fontSize:"1rem"
            });
        }

        const MouseLeaveBall_fnc = (ref:React.RefObject<HTMLDivElement>) => {
            gsap.to(ref.current, {
                duration: 0.5,
                scale:1,
                ease: "power3",
                fontWeight:"400",
                fontSize:"1rem"
            });
        }

        const MouseLeaveBall = () => {
            gsap.to(ballRef.current, {
                duration: 0.5,
                scale:1,
                ease: "power3",
                fontWeight:"400",
            });
        }

        saveWindow.current?.addEventListener('mousemove',e=>{
            moveBall_fnc(e.clientX, e.clientY,ballRef,0.9);
            moveBall_fnc(e.clientX, e.clientY,ball2Ref,1.3);
            moveBall_fnc(e.clientX, e.clientY,ball3Ref,1.6);
        })


        ballRef.current?.addEventListener('mouseover',e =>{
            MouseOverBall_fnc(ballRef)
            MouseOverBall_fnc(ball2Ref)
            MouseOverBall_fnc(ball3Ref)
        })

        ballRef.current?.addEventListener('mouseleave',e =>{
            MouseLeaveBall_fnc(ballRef)
            MouseLeaveBall_fnc(ball2Ref)
            MouseLeaveBall_fnc(ball3Ref)
        })

        ballRef.current?.addEventListener('mouseleave',MouseLeaveBall)
        return ()=>{
            saveWindow.current?.removeEventListener('mousemove',e=>{
                moveBall_fnc(e.clientX, e.clientY,ballRef,0.8);
                moveBall_fnc(e.clientX, e.clientY,ball2Ref,1.5);
                moveBall_fnc(e.clientX, e.clientY,ball3Ref,2);
            })
    
    
            ballRef.current?.removeEventListener('mouseover',e =>{
                MouseOverBall_fnc(ballRef)
                MouseOverBall_fnc(ball2Ref)
                MouseOverBall_fnc(ball3Ref)
            })
    
            ballRef.current?.removeEventListener('mouseleave',e =>{
                MouseLeaveBall_fnc(ballRef)
                MouseLeaveBall_fnc(ball2Ref)
                MouseLeaveBall_fnc(ball3Ref)
            })
        }
    },[theme])

    return(
        <div  className=" flex flex-col fixed top-0 right-0" style={bigStyle}>
            <div className="bg-gray" style={{height:"70px", width:"100%"}}/>
            <div ref={saveWindow} style={{height:"100%", width:"100%"}}>

            </div>
            <div ref={ball3Ref} className="fixed rounded-full"/>
            <div ref={ball2Ref} className="fixed rounded-full"/>
            <div style={{
                color:textColor,
                backgroundColor:"transparent",
            }} ref={ballRef} 
            className="justify-center items-center flex cursor-pointer fixed ball w-5 h-5 rounded-full bg-slate-100"
            onClick={(e)=>{
                alert()
            }}
            >
                저장
            </div>
            
        </div>
    )
}

function EditorSaveSmallWindow(){

    return(
        <div style={{
            position:"fixed",
            top:"95%",
            left:"95%"
        }}>
            저장
        </div>
    )
}