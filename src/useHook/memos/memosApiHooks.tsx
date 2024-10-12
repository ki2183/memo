import { computePageMax } from "./pagehooks"
import { useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function useMemoPageHook(){
    const postsPerPage = 5
    const queryClient = useQueryClient()
    const navigate= useNavigate()
    const go_login = () => navigate('/login')
    const apiURL = process.env.REACT_APP_API_URL
    const get_token = sessionStorage.getItem('token')
    const token = get_token ? JSON.parse(get_token) : null
    
    const checkToken = async () => {
        try {
                const res = await axios.post(`${apiURL}/memos/checkToken`, get_token, {
                    headers: {
                        "Content-Type": 'application/json'
                    }
                })
            
                const tf = res.data; 
                if (!tf) go_login()
    
        } catch (err) {
            go_login()
        }
    }

    async function getLength() {
        try {
            const res = await axios.post(`${apiURL}/memos/getPageLength`, get_token, {
                headers: {
                    "Content-Type": 'application/json'
                }
            })
            // res.data가 받아온 데이터
            const page_max = computePageMax({ item_length: res.data, postsPerPage })
            return page_max // 값을 반환
        } catch (err) {
            console.log(err)
        }
    }

    const getList = async (pageNum:number) => {
        const dto = {_id:token._id}
        const response = await axios.post(`${apiURL}/memos/listPaging/${pageNum}`, dto, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    }

    const getListDto = async (page:number) => {
        const dto = {_id:token._id}
        const response = await axios.post(`${apiURL}/memos/listPaging/${page}`, dto, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    }

    const handleMouseEnter = (pageNumber: number) => {
        queryClient.prefetchQuery({
          queryKey: ['memoList',pageNumber.toString()],
          queryFn: () => getListDto(pageNumber),
          staleTime: 1000 * 60 * 5
        })
    }


      

    return {
        getList,
        getLength,
        checkToken,
        getListDto,
        handleMouseEnter,
        
    }
}

export default useMemoPageHook