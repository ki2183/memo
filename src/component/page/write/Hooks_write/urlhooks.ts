export type urlHooksType = {
    e:React.KeyboardEvent<HTMLInputElement>
    url:string,
    idx:number,
    max:number,
    NewPushImgs:(idx:number,url:string)=> void,
    new_textArea_focusing: () => void,
    img_URL_close: () => void,
    add_text:()=>void,
}

function urlHooks({
    e,
    url,
    idx,
    max,
    add_text,
    NewPushImgs,
    img_URL_close,
    new_textArea_focusing
}:urlHooksType){

    if(e.key === "Enter"){
        NewPushImgs(idx,url)
        if(max === idx){
            add_text()
            new_textArea_focusing()
        }  //마지막일 경우 인덱스 추가
        img_URL_close() // closeURL
    }

}

export default urlHooks