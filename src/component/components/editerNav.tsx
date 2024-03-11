import gsap from "gsap"
import "./editerNav.css"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { changeTheme } from "../store/slices/theme"

function EditNav(){
    return(
        <>
            <EditNavTop/>
            <EditNavRight/>
        </>
    )
}

export default EditNav

function EditNavRight(){

    const theme = useAppSelector(state => state.theme)

    return(
        <div className="container-edit-nav-left" style={{backgroundColor:theme.navColor, borderRight:` 1px solid ${theme.navBorder}`}}>

        </div>
    )
}

function EditNavTop(){ 

    const [themeTween, setThemeTween] = useState<GSAPTween | null>();
    const theme = useAppSelector(state => state.theme)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const tween = gsap.to('.theme-button', {
            duration: 0.3,
            ease: "back.inOut",
            x: "-95%",
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