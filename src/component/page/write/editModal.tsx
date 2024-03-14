import { useState } from "react";
import Modal from "react-modal";
import "./editModal.css"
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { delText } from "../../store/slices/text";
import { getTFIdx } from "../../store/slices/urlInputCheck";

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
    update_URL_true: (idx: number) => void
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  }

  function OptionModal({modalOpen,setModalOpen,update_URL_true}:OptionModalType) {
  
    const mouseXY = useAppSelector((state)=>state.mouseXY)
    const modalBackGround = useAppSelector((state)=>state.theme.modalBackground)
    const {idx,x,y} = mouseXY
    const dispatch = useAppDispatch()
    const modelstyle = {
      top:`${y + 30}px`,
      left:`${x}px`,
      background:modalBackGround
    }

    const delEvent = (idx:number) => {
      if(idx !== 0){
        dispatch(delText({idx}))
      }
        
    }
    const imgEvent = (idx:number) => {
      update_URL_true(idx)
    }

    return (
       <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            style={customModalStyles}
            ariaHideApp={false}
            shouldCloseOnOverlayClick={false}
        >
          <div 
            onClick={e=>{
              e.preventDefault()
              setModalOpen(false)
            }}
            className="container-option-modal"
          >
            <ul 
              style={modelstyle}
              className="frame-option-modal"
            >
              <ModalList idx={idx} title="삭제" spanName="delete" func={delEvent}/>
              <ModalList idx={idx} title="사진" spanName="image" func={imgEvent}/>
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
      func:(idx:number)=>void
    }

    function ModalList({title,spanName,func,idx}:ModalListType){
      return(
        <li className="option-modal-li" onClick={e=>{
          e.preventDefault()
          func(idx)
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