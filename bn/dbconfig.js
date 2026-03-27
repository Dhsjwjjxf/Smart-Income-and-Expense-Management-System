const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017")
// mongoose.connect("mongodb://localhost:27017/my-database")
.then((data)=>{
    console.log("database connected")
})
.catch((err)=>{
    console.log(err)
})