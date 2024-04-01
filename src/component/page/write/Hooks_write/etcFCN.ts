import { ModalInfoType, modal_type } from "../../../store/slices/modalInfo";

export const adjustTextAreaHeight = (element:HTMLTextAreaElement) => {
    element.style.height = '0px'
    const scrollHeight = element.scrollHeight;
    element.style.height = scrollHeight + 'px'
} //textarea height 자동조절

export function computeModalInfo(e:React.MouseEvent<HTMLDivElement>,idx:number,modal_type:modal_type):ModalInfoType{
    e.preventDefault()
    const divRect = e.currentTarget.getBoundingClientRect()
    const modalInfo:ModalInfoType = {
        x:divRect.left,
        y:divRect.top,
        idx,
        height:divRect.height,
        modal_type:modal_type
    }
    return modalInfo
} //modal height 계산 리턴