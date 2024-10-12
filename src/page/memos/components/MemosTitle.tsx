import React from "react"

function MemosTitle(){
    return(
        <div className="title-memos">
            <span>
                내 메모들
            </span>
        </div>
    )
}

export default React.memo(MemosTitle)