export type urlHooksType = {
    e:React.KeyboardEvent<HTMLInputElement>
    url:string,
    idx:number,
    NewPushImgs:(idx:number,url:string)=> void
}

function urlHooks({
    e,
    url,
    idx,
    NewPushImgs,
}:urlHooksType){

    if(e.key === "Enter"){
        console.log(idx)
        NewPushImgs(idx,url)
    }

}

export type urlHooksReturnType = {

}

export default urlHooks