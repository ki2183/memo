import axios from "axios"
import { useEffect, useState } from "react"
import React from "react"
import { useQuery } from "react-query"

interface Item {
    _id: string,
    prodId: number,
    price: number,
    quantity: number
}

function AxiosQuery(){

    const { isLoading, data, isError, error } = useQuery('get-product', async () => {
        const response = await axios.get('/users')
        return response.data
    });

    if (isLoading) return <>Loading...</>
    if (isError) return <>{error}</>

    return(
        <>
            <div className='text-4xl'>AxiosQuery</div>
                <ul className='list-disc p-4'>
                    {data && data.map((item: Item, idx: number) => (
                        <li key={idx}>{item._id}</li>
                    ))}
                </ul>
            <div>axios</div>
        </>
    )
}

export default AxiosQuery