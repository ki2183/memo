import { RootState } from '../store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface IImg{
    url:string
    scale:number | "auto",
    sort:"left" | "right" | "center"
}

export interface IImgObject {
    [key: number]: IImg[],
}

const initialState:IImgObject = {}
    

export const ImgObjSlice = createSlice({
    name: 'ImgObj',
    initialState,
    reducers: {
        addImg:(state, action:PayloadAction<{ idx:number, url:string }>)=>{
            const { idx, url } = action.payload
            //만약에 존재하지 않던 객체면 빈배열 추가
            if (!state[idx]) state[idx] = []
            //url_push
            state[idx].push({ url, scale:"auto", sort:"left" })
        },
        delImg:(state, action:PayloadAction<{ textIdx:number, imgIdx:number}>)=>{
            const {textIdx, imgIdx} = action.payload
            const obj = JSON.parse(JSON.stringify(state)) as IImgObject
            obj[textIdx].splice(imgIdx,1)
            return obj    
        },
        sortImg:(state, action:PayloadAction<{curIdx:number,targetIdx:number}>)=>{
            //이렇게 제이슨 파싱안하면 proxy값 리턴 redux 불편함;;; recoil로 정상화 시키고 싶음
            const obj = JSON.parse(JSON.stringify(state)) 
            const {curIdx,targetIdx} = action.payload
            
            //idx이상의 img keys
            const highObject =  Object.keys(obj).filter(v => parseInt(v) > curIdx)
            //없으면 그냥 반환
            if(highObject.length === 0) return obj
  
            //요소들 arr
            highObject.forEach(v=>{
                const arr = obj[v] as IImg[]
                //안에 요소들 마지막 인덱스로 push
                arr.forEach(v=>{
                    const item = v as IImg
                    //없으면 빈배열 삽입
                    if (!obj[targetIdx]) obj[targetIdx] = []
                    obj[targetIdx].push(item)
                })
                delete obj[v]
            })

            return obj
        },
        //이미지 크기 변경 훅
        controlImgScale: (state, action:PayloadAction<{textIdx:number,imgIdx:number,value:number|"auto"}>)=>{
            const {textIdx, imgIdx, value} = action.payload
            const obj = JSON.parse(JSON.stringify(state)) as IImgObject
            if(value === "auto")
                 obj[textIdx][imgIdx].scale = "auto"
            else
                obj[textIdx][imgIdx].scale = value
            // console.log(obj[textIdx][imgIdx].scale)
            return obj
        },
        //sort 값 변경 훅
        controlImgSort:(state, action:PayloadAction<{textIdx:number,imgIdx:number,sort:"left"|"center"|"right"}>)=>{
            const {textIdx, imgIdx, sort} = action.payload
            const obj = JSON.parse(JSON.stringify(state)) as IImgObject
            obj[textIdx][imgIdx].sort = sort
            return obj
        },
        //이미지랑 이미지 교환 훅 for DND
        dndImgToImg:(state, action:PayloadAction<{
            draged:{textIdx:number,imgIdx:number},
            drop:{textIdx:number,imgIdx:number}
        }>)=>{
            const {draged,drop} = action.payload
            const obj = JSON.parse(JSON.stringify(state)) as IImgObject

            const dragedImg = obj[draged.textIdx][draged.imgIdx].url
            const dropImg = obj[drop.textIdx][drop.imgIdx].url

            obj[draged.textIdx][draged.imgIdx].url = dropImg
            obj[drop.textIdx][drop.imgIdx].url = dragedImg

            return obj
        },dndImgToText: (state, action: PayloadAction<{
            draged: { textIdx: number, imgIdx: number },
            drop: { textIdx: number }
          }>) => {
            const { draged, drop } = action.payload
            const obj = JSON.parse(JSON.stringify(state)) as IImgObject
          
            // 드래그한 텍스트 인덱스와 이미지 인덱스가 존재하는지 확인
            if (!obj[draged.textIdx] || !obj[draged.textIdx][draged.imgIdx]) {
              console.error("Cannot find the dragged item.")
              return obj // 존재하지 않으면 바로 리턴
            }
          
            // 드래그한 아이템을 obj[draged.textIdx]에서 추출
            const dragValue = obj[draged.textIdx].splice(draged.imgIdx, 1)
          
            // 드롭할 위치의 배열이 없으면 초기화
            obj[drop.textIdx] = obj[drop.textIdx] ?? []
          
            // 드롭할 위치에 아이템 추가
            obj[drop.textIdx].push(...dragValue)
          
            // 드래그한 위치의 배열이 비었으면 삭제
            if (obj[draged.textIdx].length === 0) delete obj[draged.textIdx]
            
          
            return obj
        },      
        AllChangeDto:(state, action:PayloadAction<IImgObject>)=>{
            const obj = JSON.parse(JSON.stringify(action)) as IImgObject
            return obj
        }    
    },

})

export const { addImg, sortImg, delImg, controlImgScale,controlImgSort, dndImgToImg, dndImgToText, AllChangeDto } = ImgObjSlice.actions

export const selectTheme = (state: RootState) => state.imgObj

export default ImgObjSlice.reducer