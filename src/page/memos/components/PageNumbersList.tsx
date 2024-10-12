import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import useMemoPageHook from "../../../useHook/memos/memosApiHooks"
import React from "react"

function PageNumberComponent(){
    return (
        <div className="frame-memos-paging">
            <ul>
                <PageNumbersList/>
            </ul>
        </div>
    )
}

export default React.memo(PageNumberComponent)

function PageNumbersList(){

    const {
        getLength,
        handleMouseEnter,
    } =  useMemoPageHook()

    //get queryString number
    const [searchParams] = useSearchParams()
    const pageNumber = searchParams.get('page')

    //get pageMax Number
    async function handleGetLength() {
        try {
            const length = await getLength()
            return length
        } catch (err) {
            console.error('ERR fetching length:', err)
        }
    }

    //cachState
    const { data } = useQuery({
        queryKey: ['pageMax'],  
        queryFn: handleGetLength,
        staleTime : 1000 * 60 * 5
    })

    return (
        <>
            {
                data && Array.from({length:data}).map((_,idx)=>
                    <PageNumber 
                        MouseEnter={handleMouseEnter} 
                        pageNum={Number(pageNumber)} 
                        idx={idx} 
                        key={idx}
                    />
                )
            }
        </>
    )
}



/** PageNumberButton **/
//#region

type PageNumber_type = {
    idx:number,
    pageNum:number,
    MouseEnter:(pageNumber:number)=> void
}

const PageNumber = ({
    idx,
    pageNum,
    MouseEnter,
}:PageNumber_type) =>{

    return (
        <Link to={`/memos?page=${idx + 1}`}>
            <span 
                onMouseEnter={()=>MouseEnter(idx)}
                style={{ fontWeight: Number(pageNum) === idx + 1 ? "bold" : "normal" }}
                className={`select-none cursor-pointer `}
            >
                {idx + 1}
            </span>
        </Link>
    )
}

//#endregion