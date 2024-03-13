import { useState } from "react";
import Modal from "react-modal";
import "./editModal.css"
import { useAppSelector } from "../../store/hooks";

export const customModalStyles: ReactModal.Styles = {
    overlay: {
      backgroundColor: "transparent",
      width: "100%",
      height: "100vh",
      zIndex: "10",
      position: "fixed",
      top: "0",
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
      backgroundColor: "transparent",
      justifyContent: "center",
    },
  };
  
  type OptionModalType = {
    modalOpen:boolean
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  }

  function OptionModal({modalOpen,setModalOpen}:OptionModalType) {
  
    const mouseXY = useAppSelector((state)=>state.mouseXY)
    const modelstyle = {
      top:`${mouseXY.y}px`,
      left:`${mouseXY.x}px`
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
              <li></li>
              <li></li>
            </ul>
          </div>
          
        </Modal>
    );
    }

    export default OptionModal