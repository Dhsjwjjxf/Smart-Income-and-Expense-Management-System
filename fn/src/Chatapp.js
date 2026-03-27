
import react, { useEffect, useState } from "react"
import io from "socket.io-client"
const socket=io.connect("http://localhost:5000")
const Chatapp=()=>{
    const [table,setTable]=useState([])
    useEffect(()=>{
        socket.on("socket-msg",(data1)=>{
            let cp=[...table,data1]
            setTable([...cp])
            console.log("socket mesage",data1)
        })
    },[socket])
    const[data,setData]=useState("")
    return(<>
    {table.map((data1)=>(data1))}
    <input type="text" onChange={(e)=>{setData(e.target.value)}} value={data}/>
    
    <button onClick={()=>{
        socket.emit("message",data)
    }}>Submit</button>
    </>)
}
export default Chatapp