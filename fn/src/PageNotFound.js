import React from "react"
import { useNavigate } from "react-router-dom"

const PageNotFound=()=>{
    const navigate=useNavigate("")
    return(<>Page Not Found 
    
    <button onClick={()=>{
    navigate("/dashboard")
    }}>Back </button>
    </>)
}
export default PageNotFound