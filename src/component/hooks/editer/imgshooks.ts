import { imgsType } from "../../page/write/edit"

export type imgsTypeProps = {
  imgs: imgsType[],
  setImgs: React.Dispatch<React.SetStateAction<imgsType[]>>
}

function imgHooks(
    imgs:imgsType[],
    setImgs:React.Dispatch<React.SetStateAction<imgsType[]>>
    ):imgsReturnType{

    function addImg(imgs:string,idx:number){
        setImgs(prevImgs => [...prevImgs,{url:imgs,idx:idx} as imgsType])
    }

    function delImg(url:string,idx:number){

        setImgs(prevImg => {
            const prevImg_ = [...prevImg]
            const idx_ = prevImg.findIndex(el => el.idx === idx && el.url === url)
            prevImg_.splice(idx_,1)
            return prevImg_
        })
    }
    function handleDropImg(e:DragEvent,idx:number){
        e.preventDefault()
        const files: FileList | null = e.dataTransfer ? e.dataTransfer.files : null
        console.log(e.target)
        if (files && files.length > 0) {
            const file: File = files[0];
            
            const reader: FileReader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const imageUrl: string | ArrayBuffer | null | undefined = e.target?.result;
                if (typeof imageUrl === "string" || imageUrl instanceof ArrayBuffer) {
                    console.log("Dropped image URL:", imageUrl);
                    addImg(imageUrl as string, idx);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    return {
        addImg,
        delImg,
        handleDropImg

    }
}
 
export type imgsReturnType = {
    addImg:(imgs:string,idx:number)=>void
    delImg:(imgs:string,idx:number)=>void
    handleDropImg:(e:DragEvent,idx:number)=>void
}

export default imgHooks

export const abstractURL = (e:DragEvent)=> {
    e.preventDefault()

    const file:FileList | null = e.dataTransfer ? e.dataTransfer.files : null
    
}