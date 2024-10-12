import "./memosPage.css"
import { useEffect } from "react"
import Page from "../../components/Page"
import MemosTitle from "./components/MemosTitle"
import MyMemoListComponent from "./components/MyMemoLists"
import PageNumberComponent from "./components/PageNumbersList"
import useMemoPageHook from "../../useHook/memos/memosApiHooks"

function MemosPage(){
    const { checkToken } =  useMemoPageHook()

    useEffect(()=>{ checkToken() },[])
    
    return (
        <Page>
            <div className="w-full h-full flex justify-center">

                <div/>

                <div className="container-memos">

                    <MemosTitle/>

                    <MyMemoListComponent/>

                    <PageNumberComponent/>

                </div>
            </div>
        </Page>
    )
}



export default MemosPage





