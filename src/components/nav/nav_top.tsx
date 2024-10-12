import React, { useLayoutEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { changeTheme } from "../../store/slices/theme"
import themeJSON from "./topNavInfo.json"
import gsap from "gsap"


const NavTop = React.memo(()=>{
// const NavTop = () => {

    const theme = useAppSelector(state => state.theme.theme)
    const themelight = themeJSON.fromDarktoLight
    const themedark = themeJSON.fromLighttoDark
    const [initialLimit,setInitialLimit] = useState<boolean>(false)
    const [themeText,setThemeText] = useState("light")
    const dispatch = useAppDispatch()

    const onClick_handler = (e:React.MouseEvent<HTMLDivElement>) =>{
        e.preventDefault()
        dispatch(changeTheme())
    }

    useLayoutEffect(()=>{
    
        const tl = gsap.timeline()
        if(!initialLimit){
            setInitialLimit(true)
            setThemeText(theme === "dark" ? "dark" : "light")
            return
        }
        if(theme !== "dark"){
            themedark.map(item=>{
                tl.to('.container-nav-top',{
                    onComplete:()=>setThemeText(item),
                    duration:0.05
                })
            })
        }else{
            themelight.map(item=>{
                tl.to('.container-nav-top',{
                    onComplete:()=>setThemeText(item),
                    duration:0.05
                })
            })
        }

        return () => {
            tl.kill(); // 모든 애니메이션을 즉시 종료
        };
    },[theme])

    return (
        <div 
            className="container-nav-top"
            style={{
            position:"fixed",
            left:"100%",
            top:"0",
            transform: "translate(-4rem,1rem)",
            zIndex:30,
        }}>
            <div
        
                onClick={onClick_handler} 
                className="mr-8 cursor-pointer w-10 select-none"
            >
                {themeText}
            </div>
        </div>
    )
})
// }

export default NavTop