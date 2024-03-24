import { useEffect, useState } from "react"
import { useAppSelector } from "../../../store/hooks"
import mainJSON from "../mainJSON/fst.json"
import "./main_fst.css"
import gsap from "gsap"
import notion_white from '../img/노션white.png' 

export function MainFst(){
    
    const theme = useAppSelector(state => state.theme)
    const [title,setTitie] = useState<string>("Hello World")

    useEffect(()=>{
        const tl = gsap.timeline()
        tl.to(".main-fst-title",{
            duration:2,
        })
        mainJSON.data.map((item,idx)=>{
            tl.to(".main-fst-title",{
                duration:0.022,
                onComplete:()=>{
                    setTitie(item)
                }
            })
        })
        tl.to(".main-fst-title",{
            duration:2,
        })
        mainJSON.data2.map((item,idx)=>{
            tl.to(".main-fst-title",{
                duration:0.022,
                onComplete:()=>{
                    setTitie(item)
                }
            })
        })
        return ()=>{
            tl.kill()
        }
    },[])

    return (
        <div className="container-main-fst">
            <div className="main-fst-title">
                <span>
                    {title}
                </span>
            </div>
            <div className="main-fst-content">
                <MySVGComponent/>
                <div className="mt-5">
                    이 사이트는 mem0입니다! mem0는 텍스트 에티터를 구현과 mongoDB를 사용해보고 싶어서 만들어봤어요. <br/>
                </div>
                <svg
                    className="wordmark_wordmark__gPyj1"
                    // style={{ '--wordmark-height': '32px' }}
                    viewBox="0 0 87 30"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path d="M1.805 1.294l16.6-1.226c2.039-.175 2.563-.057 3.845.875l5.299 3.733c.874.642 1.165.817 1.165 1.516v20.473c0 1.283-.466 2.042-2.097 2.158L7.34 29.99c-1.224.058-1.807-.117-2.448-.934L.99 23.982c-.7-.934-.99-1.633-.99-2.45V3.334c0-1.049.466-1.924 1.805-2.04z" fill="#fff" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.405.068l-16.6 1.226C.466 1.41 0 2.285 0 3.334v18.198c0 .817.29 1.516.99 2.45l3.902 5.074c.641.817 1.224.992 2.448.934l19.277-1.167c1.63-.116 2.097-.875 2.097-2.158V6.192c0-.663-.262-.854-1.033-1.42a85.473 85.473 0 01-.133-.096L22.25.943c-1.282-.932-1.806-1.05-3.845-.875zM7.776 5.857c-1.574.106-1.931.13-2.825-.597L2.678 3.452c-.231-.234-.115-.526.467-.584l15.958-1.166c1.34-.117 2.038.35 2.562.758l2.737 1.983c.117.059.408.408.058.408l-16.48.992-.204.014zM5.941 26.49V9.11c0-.759.233-1.109.931-1.168L25.8 6.834c.642-.058.932.35.932 1.108v17.264c0 .759-.117 1.401-1.165 1.459l-18.113 1.05c-1.048.058-1.513-.291-1.513-1.225zm17.88-16.448c.116.525 0 1.05-.525 1.11l-.873.173v12.832c-.758.408-1.456.641-2.039.641-.932 0-1.165-.292-1.863-1.166l-5.709-8.982v8.69l1.806.409s0 1.05-1.457 1.05l-4.017.233c-.117-.234 0-.817.407-.933l1.049-.291v-11.49L9.144 12.2c-.117-.525.174-1.283.99-1.342l4.31-.29 5.94 9.098v-8.049l-1.514-.174c-.117-.643.349-1.11.931-1.167l4.02-.234z" fill="#000" />
                    <path className="wordmark_fill__RZFeq" d="M73.299 21.429c2.634 0 4.237-1.724 4.237-4.584 0-2.852-1.611-4.584-4.237-4.584-2.619 0-4.238 1.74-4.238 4.584 0 2.86 1.595 4.584 4.238 4.584zm0-1.676c-1.394 0-2.192-1.063-2.192-2.908 0-1.837.798-2.908 2.192-2.908 1.385 0 2.183 1.071 2.183 2.908 0 1.845-.79 2.908-2.183 2.908zM78.725 21.251h1.998V16.12c0-1.297.75-2.119 1.941-2.119 1.217 0 1.78.677 1.78 2.022v5.228h1.999v-5.703c0-2.103-1.072-3.287-3.037-3.287-1.314 0-2.2.604-2.619 1.587h-.137v-1.41h-1.925v8.813z" fill="#000" />
                    </svg>

                    <svg width="192" height="192" viewBox="0 0 192 192" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M24 0H168C181.255 0 192 10.7451 192 24V168C192 181.255 181.255 192 168 192H24C10.7451 192 0 181.255 0 168V24C0 10.7451 10.7451 0 24 0ZM49 57.9199V65.48H67L80.6799 142.52L98.5 141.26C116.02 119.06 127.84 102.44 133.96 91.3999C140.2 80.24 143.32 70.9399 143.32 63.5C143.32 59.0601 142 55.7 139.36 53.4199C136.84 51.1399 133.66 50 129.82 50C122.62 50 116.62 53.0601 111.82 59.1799C116.5 62.3 119.68 64.8799 121.36 66.9199C123.16 68.8401 124.06 71.4199 124.06 74.6599C124.06 80.0601 122.44 86.1799 119.2 93.02C116.08 99.8601 112.66 105.92 108.94 111.2C106.54 114.56 103.48 118.7 99.76 123.62L88.0601 57.2C87.1001 52.3999 84.1001 50 79.0601 50C76.78 50 72.3999 50.96 65.9199 52.8799C59.4399 54.6799 53.8 56.3601 49 57.9199Z" fill="currentColor"></path></svg>
                <div>
                    예전부터 노션이나 벨로그 같이 글쓰기 편한 에디터들은 어떻게 구현하는지 너무 궁금했는데, 이참에 많이 부족하지만 그들과 비슷하게 만들어 보았어요.
                </div>

                <div>
                    몇몇 커맨드는 부자연스럽지만, 시간되면 점차 추가해서 자연스러운 동작을 하도록 하겠습니다.
                </div>
            </div>
        </div>
    )
}

const MySVGComponent = () => {

    const svg_color = useAppSelector(state => state.theme.svg_color)

    useEffect(()=>{
        const tl = gsap.timeline()
        tl.to('.hand',{
            transformOrigin:"bottom left",
            rotate:"15deg",
            yoyo:true,
            repeat:4,
            ease:"power1.inOut",
            duration:0.7
        })
        tl.to('.hand',{
            duration:1.5
        })
        tl.to('.hand',{
            transformOrigin:"bottom left",
            rotate:"0deg",
            ease:"power1.inOut",
            duration:0.5
        })
        return ()=>{
            tl.kill()
        }
    },[])

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 354.33 354.33" width="125" height="125">
      <circle className="cls-1" cx="177.17" cy="35.85" r="25.51" fill="none" stroke={svg_color} strokeWidth="15"/>
      <line className="cls-1" x1="209.68" y1="156.65" x2="209.68" y2="354.33" fill="none" stroke={svg_color} strokeWidth="15"/>
      <path className="cls-2" d="m145.65,354.33v-143.11l-28.66-28.61.18-30.9-.18-48.52c.92-26.15,24.95-38.01,52.3-40.89,22.72-2.4,40.14,9.52,45.47,13.5l23.82,16.63" fill="none" stroke={svg_color} strokeWidth="15" strokeLinecap="round"/>
      <line className="cls-2 hand" x1="275.15" y1="33.42" x2="240.96" y2="92.92" fill="none" stroke={svg_color} strokeWidth="15" strokeLinecap="round"/>
    </svg>
  );
}

export default MySVGComponent;