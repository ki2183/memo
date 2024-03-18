import { useDispatch } from "react-redux"
import { useDrag, useDrop } from "react-dnd"
import { useAppSelector } from "../../../../store/hooks"
import { computeModalInfo } from "../../Hooks_write/etcFCN"
import { getModalInfo } from "../../../../store/slices/modalInfo"
import { dnd_img_to_img, imgRate, imgSort } from "../../../../store/slices/imgs"

type ImgMolecules_type = {
    EditorField_idx:number,
    modal_open:()=>void,
}

function ImgMolecules({EditorField_idx,modal_open}:ImgMolecules_type){

    const imgs = useAppSelector(state => state.imgs)
    const dispatch = useDispatch()

    function onclick_handler_option_img(e:React.MouseEvent<HTMLDivElement>,index:number){
        const modalInfo = computeModalInfo(e,index,"img_modal")
        dispatch(getModalInfo(modalInfo))
        modal_open()
    }

    return (
        <>
        {imgs.map((item,img_index)=>
            item.idx === EditorField_idx ? (
                <ImgAtoms
                    key={img_index}
                    url={item.url}
                    rate={item.rate}
                    sort={item.sort}
                    img_index={img_index}
                    onclick_handler_option_img={onclick_handler_option_img}
                />
            ):null
        )}
        </>
    )
}

export default ImgMolecules

type ImgAtoms_type = {
    url: string
    rate: imgRate
    sort: imgSort
    img_index:number
    onclick_handler_option_img:(e: React.MouseEvent<HTMLDivElement>, index: number) => void
}

function ImgAtoms({url,rate,sort,img_index,onclick_handler_option_img}:ImgAtoms_type){

    const dispatch = useDispatch()

    const [,drag] = useDrag({
        type:"img",
        item:{img_index}
    })

    const [,drop] = useDrop({
        accept:"img",
        drop(item:{img_index:number}, monitor) {
            dispatch(dnd_img_to_img({arrIdx:img_index,willchangeIdx:item.img_index}))

        },
    })

    return(
        <div className="edit-img">
                    <div/>
                    <div className="edit-img-frame">
                        <div>

                        </div>
                        <div
                            style={{justifyContent:sort, display:"flex"}}
                            ref={el => drag(drop(el))}
                        >
                            <img 
                                src={url} 
                                style={{
                                    width:typeof rate === "number" ?
                                    `${rate}%`:
                                    `auto`
                                }}
                            />
                        </div>
                    </div>
                    <div className="edit-img-frame" onClick={e=>{onclick_handler_option_img(e,img_index)}}>
                        <div className="option-button">
                            <span className="material-symbols-outlined">
                                more_vert
                            </span>
                        </div>
                    </div>
                </div>
    )
}

