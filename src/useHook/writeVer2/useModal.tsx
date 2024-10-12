import { useEffect, useRef } from "react"
import { ALLModalClose } from "../../store/slices/imgModalState" 
import { useAppDispatch, useAppSelector } from "../../store/hooks"

export default function useModal(){
    const urlRef = useRef<HTMLDivElement>(null)
    const sortRef = useRef<HTMLOListElement>(null)
    const optionRef = useRef<HTMLOListElement>(null)

    const modalState = useAppSelector(state => state.imgModalState)
    const {url,sort,option} = modalState
    const dispatch = useAppDispatch()

    const getImgState = () => {
        if(option === true) return 'option'
        else if(url && !sort) return 'url'
        else if(url && sort) return 'sort'
        else return null
    }
    /** event handler **/
    //#region

    //윈도우 클릭 핸들러
    const windowClickHandler = (e:MouseEvent) => {
        e.preventDefault()
        const state = getImgState()
        
        //진공상태
        if(state === null) return

        if ((e.target as HTMLElement).classList.contains('optionButton')) 
            return
        
        //option이 켜져 있을 때 window클릭 하면 모든 모달이 꺼짐
        const target = 
            state === "option" ? optionRef.current :
            state === "sort" ? sortRef.current :
            state === "url" ? urlRef.current : null;

        // 만약에 본인과 자식제외한 window객체 클릭하면 close All
        if(target && !target.contains(e.target as Node)) dispatch(ALLModalClose()) 
    }

    //#endregion

    //윈도우 클릭시 모달 전부 OFF
    useEffect(()=>{
        window.addEventListener('click',windowClickHandler)
        return ()=>window.removeEventListener('click',windowClickHandler)
    },[modalState])

    return{
        url,
        sort,
        option,
        urlRef,
        sortRef,
        optionRef,
    }
}