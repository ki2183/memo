export type urlHooksType = {
    e:React.KeyboardEvent<HTMLInputElement>
    url:string,
    idx:number,
    NewPushImgs:(idx:number,url:string)=> void,
    update_URL_false: () => void
}

function urlHooks({
    e,
    url,
    idx,
    NewPushImgs,
    update_URL_false
}:urlHooksType){

    if(e.key === "Enter"){
        console.log(idx)
        NewPushImgs(idx,url)
        update_URL_false()
    }

}

export type urlHooksReturnType = {

}

export default urlHooks