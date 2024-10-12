import { IuseTextArea } from "../../../../useHook/writeVer2/useTextarea"
import { useAppSelector } from "../../../../store/hooks"
import { HTML5Backend } from "react-dnd-html5-backend"
import TextEditer from "../../Editers/textEditer"
import ImgEditor from "../../Editers/ImgEditor"
import { DndProvider } from "react-dnd" 

function WriteSpace(useText: IuseTextArea) {

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="frame-memos">                    
                <WriteComponents {...useText} />
            </div>
        </DndProvider>
    )
}

export default WriteSpace



function WriteComponents(useText: IuseTextArea) {
    const text = useAppSelector(state => state.text)
    const img = useAppSelector(state => state.imgObj)

    return (
        <>
            { text.length > 0 && text.map((_,idx)=>(

                <div key={idx}>
                    <TextEditer
                        idx={idx}
                        useText={useText}
                    />

                    {
                        img[idx] && img[idx].length > 0  && 
                        img[idx].map((v,img_idx)=>(
                            <ImgEditor
                                imgDTO={v}
                                key={img_idx} 
                                textIdx={idx}
                                imgIdx={img_idx} 
                            />
                        ))
                    }
                </div>  

            ))}
        </>
    )
}