const mongoose = require("mongoose")


const ExpenseSchema = mongoose.Schema({
    UserID:{
        type:mongoose.Schema.Types.ObjectId
    },
    Expense:{
        type:Array
    }
})


module.exports=mongoose.model("ExpenseSchema",ExpenseSchema)