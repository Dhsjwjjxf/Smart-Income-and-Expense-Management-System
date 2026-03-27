const mongoose = require("mongoose")

const IncomeSchema = mongoose.Schema({
    UserID:{
        type:mongoose.Schema.Types.ObjectId
    },
    Income:{
        type:Array
    }
})

module.exports=mongoose.model("IncomeSchema",IncomeSchema)