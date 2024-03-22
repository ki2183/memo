import { ReactNode, useRef } from "react"
import { useAppSelector } from "../store/hooks"
import { NavRight } from "../components/nav/nav_left"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { NavTop } from "../components/nav/nav_top"

type Page_type = {
    children:ReactNode
}

function Page({children}:Page_type){
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
        <div
            className="w-screen h-screen grid"
            style={{gridTemplateColumns:"270px auto"}}
        >
            <NavRight/>
            <NavTop/>
            <div/>

            <div ref={containerRef}>
                {children}
            </div>
            
        </div>
    )
}

export default Page