import { memo_dto } from "../memosPage"

export const pagehooks = () =>{
    
}

type computePageMax_type = {
    postsPerPage:number
    item_length:number
}
export const computePageMax = ({
    postsPerPage,
    item_length
}:computePageMax_type) => {
    const pagesWithoutRemainder = Math.floor(item_length/postsPerPage)
    const hasRemainer = item_length%postsPerPage === 0 ? 0 : 1
    return pagesWithoutRemainder + hasRemainer
}
type getPageInfo = {
    pageNum:number
    memo_dto:memo_dto[]
    postsPerPage:number

}
export const getPageInfo = ({
    pageNum,
    memo_dto,
    postsPerPage
}:getPageInfo) => {
    const startIdx = pageNum * postsPerPage
    const endIdx = startIdx + postsPerPage
    const memo_dto_array = Array.isArray(memo_dto) ? memo_dto : [];
    const sliced_memo_dto = memo_dto_array.slice(startIdx, endIdx);

    return sliced_memo_dto
}

export const overText =  (text:string) => {
    let text_ = text
    if(text.length > 15){
        text_ = text_.slice(0,15)+"..."
    }

    return text_
}