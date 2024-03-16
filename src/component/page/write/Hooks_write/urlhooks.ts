export type urlHooksType = {
    e:React.KeyboardEvent<HTMLInputElement>
    url:string,
    idx:number,
    NewPushImgs:(idx:number,url:string)=> void,
    img_URL_close: () => void
}

function urlHooks({
    e,
    url,
    idx,
    NewPushImgs,
    img_URL_close
}:urlHooksType){

    if(e.key === "Enter"){
        NewPushImgs(idx,url)
        img_URL_close() // closeURL
    }

}

export default urlHooks