import { useEffect, useState } from "react";
import Modal from "react-modal";
import "./editModal.css"
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { delText } from "../../../../store/slices/text";
import { changeRateImg, changeSortImg, delImg } from "../../../../store/slices/imgs";

export const customModalStyles: ReactModal.Styles = {
    overlay: {
      backgroundColor: "transparent",
      width: "100%",
      height: "100vh",
      zIndex: "10",
      position: "fixed",
      top: "0",
      border:"0px",
      left: "0",
      overflow:"hidden"
    },
    content: {
      overflow:"hidden",
      width: "100vw",
      height: "100vh",
      zIndex: "150",
      position: "absolute",
      top: "0",
      left: "0",
      borderRadius: "10px",
      border:"0px",
      backgroundColor: "transparent",
      justifyContent: "center",
    },
  };
  
  type OptionModalType = {
    modalOpen:boolean
    modal_close:()=> void
    img_URL_open?: (idx: number) => void
  }

  function OptionModal({modalOpen,img_URL_open,modal_close}:OptionModalType) {
  
    const addModalStyle_invisible = {
      display : "none",
    }
    const modalInfo = useAppSelector((state)=>state.modalInfo)
    const imgs = useAppSelector((state)=>state.imgs)
    const [addModalStyle,setAddModalStyle] = useState(addModalStyle_invisible)
    const [addModal_type,setAddModal_type] = useState<"sort"|"size">("sort")
    const modalBackGround = useAppSelector((state)=>state.theme.modalBackground)
    const {idx,x,y,modal_type} = modalInfo
    const dispatch = useAppDispatch()
    useEffect(()=>{console.log(imgs)},[imgs])
    const modelstyle = {
      top:`${y + 30}px`,
      left:`${x}px`,
      background:modalBackGround
    }
    
    useEffect(()=>{
      setAddModalStyle(addModalStyle_invisible)
    },[])
    useEffect(()=>{ //모달이 꺼지든 실행되든 안보임
      setAddModalStyle(addModalStyle_invisible)
    },[modalOpen])

    const delEvent_text = (e:React.MouseEvent<HTMLLIElement>) => {
      if(idx !== 0)
        dispatch(delText({idx}))
      modal_close() 
    }
    const imgEvent = (e:React.MouseEvent<HTMLLIElement>) => {
      if(img_URL_open){
        img_URL_open(idx)
      }
      modal_close()
    }

    const delEvent_img = (e:React.MouseEvent<HTMLLIElement>) => {
      dispatch(delImg(idx))
      modal_close() 
    }

    const openSort = (e:React.MouseEvent<HTMLLIElement>) => {
      setAddModal_type("sort")
      const divRect = e.currentTarget.getBoundingClientRect()
      const addModalStyle_visible = {
        display : "block",
        top:`${divRect.top}px`,
        left:`${divRect.left}px`,
        background:modalBackGround
      }
      setAddModalStyle(addModalStyle_visible)
    }

    const openSize = (e:React.MouseEvent<HTMLLIElement>) => {
      setAddModal_type("size")
      const divRect = e.currentTarget.getBoundingClientRect()
      const addModalStyle_visible = {
        display : "block",
        top:`${divRect.top}px`,
        left:`${divRect.left}px`,
        background:modalBackGround
      }
      setAddModalStyle(addModalStyle_visible)
    }

    const modal_list = modal_type === 'text_modal' 
    ? [
      {idx,title:"삭제",spanName:"delete",func:delEvent_text},
      {idx,title:"사진",spanName:"image",func:imgEvent}
    ]  //text-modal-list
    : [
      {idx,title:"삭제",spanName:"delete",func:delEvent_img},
      {idx,title:"정렬",spanName:"sort",func:openSort},
      {idx,title:"크기",spanName:"fit_width",func:openSize},
    ] //img-modal-list

    return (
       <Modal
            isOpen={modalOpen}
            onRequestClose={() => modal_close()}
            style={customModalStyles}
            ariaHideApp={false}
            shouldCloseOnOverlayClick={false}
        >
          <div 
            onClick={e=>{
              e.preventDefault()
              modal_close()
            }}
            className="container-option-modal"
          >
            <ul 
              style={modelstyle}
              className="frame-option-modal"
            >
              {
                modal_list.map((item,index)=>(
                  <ModalList idx={idx} title={item.title} spanName={item.spanName} func={item.func}/>
                ))
              }
            </ul>
          </div>
          <div 
          >
            <ul
                style={addModalStyle} 
                className="frame-option-modal add-modal"
              >
                {addModal_type === "sort" ? (<SortModal idx={idx}/>) : (<SizeModal idx={idx}/>) }
                
            </ul>
          </div>
        </Modal>
    );
    }

    export default OptionModal

    type ModalListType = {
      title:string,
      spanName:string,
      idx:number,
      func:(e:React.MouseEvent<HTMLLIElement>)=>void
    }

    function ModalList({title,spanName,func,idx}:ModalListType){
      return(
        <li className="option-modal-li" onClick={e=>{
          e.preventDefault()
          e.stopPropagation()
          func(e)
        }}>
          <div>
            <span className="material-symbols-outlined">
              {spanName}
            </span>
            <span>
              {title}
            </span>
          </div>
        </li>
      )
    }

    

    type SortModalType = {
      idx:number
    }

    function SortModal({idx}:SortModalType){

      const dispatch = useAppDispatch()

      const leftSort_img = (e:React.MouseEvent<HTMLLIElement>) => {
        dispatch(changeSortImg({idx,sort:"flex-start"}))  
      }  
      const centerSort_img = (e:React.MouseEvent<HTMLLIElement>) => {
        dispatch(changeSortImg({idx,sort:"center"}))  
      }  
      const rightSort_img = (e:React.MouseEvent<HTMLLIElement>) => {
        dispatch(changeSortImg({idx,sort:"flex-end"}))  
      }  

      return (
        <>
          <ModalList idx={idx} title={"왼쪽"} spanName={"format_align_left"} func={leftSort_img}/>
          <ModalList idx={idx} title={"가운데"} spanName={"format_align_center"} func={centerSort_img}/>
          <ModalList idx={idx} title={"오른쪽"} spanName={"format_align_right"} func={rightSort_img}/>
        </>
      )
    }

    function SizeModal({idx}:SortModalType){
      const dispatch = useAppDispatch()

      const autoRate_img = (e:React.MouseEvent<HTMLLIElement>) => {
        dispatch(changeRateImg({idx,rate:"auto"}))  
      }  

      const controlRate_img = (num:number) => {
        dispatch(changeRateImg({idx,rate:num}))
      }

      return (
        <>
          <ModalList idx={idx} title={"자동"} spanName={"hdr_auto"} func={autoRate_img}/>
          <ModalList idx={idx} title={"수동"} spanName={"straighten"} func={(e)=>{}}/>
          <Modal_ProgressiveBar idx={idx} func={controlRate_img}/>
        </>
      )
    }

    type Modal_ProgressiveBar_type = {
      idx:number,
      func:(num:number)=>void
    }

    function Modal_ProgressiveBar({func,idx}:Modal_ProgressiveBar_type){

      const onChangeHandler = (e:React.ChangeEvent<HTMLInputElement>)=>{
        e.preventDefault()
        const val = parseInt(e.target.value)
        func(val)
      }

      return(
        <li id="option-progress" className="option-modal-li" onClick={e=>{
          e.preventDefault()
          e.stopPropagation()
        }}>
          <div className="option-progressiveBar">
            <input 
              type="range" 
              min={1}
              max={100}
              step={0.5}
              onChange={onChangeHandler}
              className="progressiveBar"
            />
          </div>
        </li>
      )
    }