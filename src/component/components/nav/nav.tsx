import './nav.css'
import darkMode from './navIcon/outline_dark_mode_white_24dp.png'
import lightMode from './navIcon/outline_light_mode_white_24dp.png'
import { useEffect, useRef, useState } from 'react'
import {gsap} from 'gsap'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { changeTheme } from '../../store/slices/theme'

/** TEMPLATES **/
//#region
function Nav(){
    const list = [{title:"home",url:"/home"},{title:"write",url:"/write"},{title:"list",url:"/list"},{title:"about",url:"/about"}]
    const backgroundColor = useAppSelector(state => state.theme.navColor)
    return <div className='container-nav' style={{backgroundColor:backgroundColor}}>
        <div className='frame-nav'>
            <NavLeft/>
            <NavCenter list={list}/>
            <NavRight/>
        </div>
    </div>
}
//#endregion


/** MOLECULES **/
//#region

function NavLeft(){
    return (
        <div className='nav-left'>
            
        </div>
    )
}

type listType = {
    title:string,
    url:string,
}

type NavCenterProp = {
    list : Array<listType>
}

function NavCenter({list}:NavCenterProp){
    return (
        <div className='nav-center'>
            <ul>
                {list.map((item,idx)=>(
                    <List key={idx} title={item.title} url={item.url}/>
                ))}
            </ul>
        </div>
    )
}

type modeType = "dark"|"light"

function NavRight(){
    const [mode,setMode] = useState<modeType>("light")
    const hitbox = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()
    useEffect(()=>{

        if(mode === 'light'){
            gsap.set('.lightmode',{
                opacity:0
            })
        }else{
            gsap.set('.darkmode',{
                opacity:0
            })
        }
    },[])

    const modeHandler = (e:React.MouseEvent<HTMLDivElement>) =>{
        e.preventDefault();   

        if(mode === 'light'){
        
            const tl = gsap.timeline()
            tl.set('.lightmode',{
                opacity:0,
                scale:0,
            })
            tl.set('.darkmode',{
                opacity:100,
                scale:1,
            })
            tl.to('.darkmode',{
                opacity:0,
                duration:0.3,
                scale:0,
                ease:'elastic.inOut'
            },0)
            tl.to('.lightmode',{
                opacity:100,
                duration:0.3,
                scale:1,
                ease:'elastic.inOut'
            },0)
        }else{
            const tl = gsap.timeline()
            tl.set('.darkmode',{
                opacity:0,
                scale:0,
            })
            tl.set('.lightmode',{
                opacity:100,
                scale:1,
            })
            tl.to('.lightmode',{
                opacity:0,
                duration:0.3,
                scale:0,
                ease:'elastic.inOut'
            },0)
            tl.to('.darkmode',{
                opacity:100,
                duration:0.3,
                scale:1,
                ease:'elastic.inOut'
            },0)
        }
        setMode(mode === "light" ? "dark":"light")
        dispatch(changeTheme())
    }     

    return (
        <div className='nav-right'>
            <div className='frame-mode'>
                <img src={darkMode} className='mode-img darkmode'/>
                <img src={lightMode} className='mode-img lightmode'/>
                <div className='mode-img mode-img-click' ref={hitbox}
                 onClick={modeHandler}
                />
            </div>
        </div>
    )
}

//#endregion


/** ATOMS **/
//#region

function List({title,url}:listType){

    const location = useLocation()
    const navigate = useNavigate()

    const onClickHandler = (e:React.MouseEvent<HTMLLIElement>) =>{
        e.preventDefault()
        navigate(url)
    }

    return (
        <li 
            className='nav-list' 
            onClick={onClickHandler}
            style={location.pathname === "/"+title ? {
                opacity:0.5,
                fontSize:"16px"
            } : {}}
            >
            {title}
        </li>
    )
}
//#endregion

export default Nav

