import { text } from "stream/consumers"

export type editerType = {
  texts: string[],
  setTexts: React.Dispatch<React.SetStateAction<string[]>>
}

function editer(
  texts:string[],
  setTexts: React.Dispatch<React.SetStateAction<string[]>>
  ):editerReturnType{

  const check = () =>{
    console.log(texts)
  }

  const newAddTexts = () => {
    setTexts(prevTexts => [...prevTexts,""]);
  }

  const updateTexts = (idx:number, newText:string) => {
    setTexts(prevTexts => {
      const updatedTexts = [...prevTexts]
      updatedTexts[idx] = newText
      return updatedTexts
    });
  }

  const deleteTexts = (idx:number) => {
    if(idx === 0) return
    setTexts(prevTexts => {
      const updatedTexts = [...prevTexts]
      prevTexts.splice(idx,1)
      return updatedTexts
    })
  }

  return {
    check,
    newAddTexts,
    updateTexts,
    deleteTexts
  }
}

export type editerReturnType = {
  check : ()=> void
  newAddTexts : ()=> void
  updateTexts: (idx:number, newText:string)=> void
  deleteTexts: (idx:number) => void
}

export default editer