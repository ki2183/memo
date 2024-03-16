import { imgsType } from './../edit';

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

    return {
        addImg,
        delImg,
    }
}
 
export type imgsReturnType = {
    addImg:(imgs:string,idx:number)=>void
    delImg:(imgs:string,idx:number)=>void
}

export default imgHooks

