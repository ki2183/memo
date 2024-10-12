import React, { ReactNode, useRef } from "react"
import { useAppSelector } from "../store/hooks"
import NavLeft from "./nav/nav_left"
import NavTop from "./nav/nav_top" 
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

type Page_type = {
    children:ReactNode
}
const Page = ({children}:Page_type)=>{
    const containerRef = useRef<HTMLDivElement>(null)
    const {nav_total} = useAppSelector(state => state.navState)

    useGSAP(()=>{
        if(nav_total){
            gsap.to(containerRef.current,{
                x:0,
                duration:0.5,
            })
        }else{
            gsap.to(containerRef.current,{
                x:"-135px",
                duration:0.5,
            })
        }
    },[nav_total])

    return (
        <div className="w-screen h-screen grid" style={{gridTemplateColumns:"270px auto"}}>
            <NavLeft/>
            <NavTop/>
            <div/>

            <div ref={containerRef}>
                {children}
            </div>
            
        </div>
    )
}

export default React.memo(Page)