const mongoose = require("mongoose")
const joi = require("joi")
const chartSchema = mongoose.Schema({
    Email: {
        type: String
    },
    Password: {
        type: String
    },
    FirstName: {
        type: String
    },
    LastName: {
        type: String
    }
})

const joiObject = joi.object({
    Email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    Password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    FirstName: joi.string().alphanum().min(3).max(30).required(),
    LastName: joi.string().alphanum().min(3).max(30).required()


})

const Model = mongoose.model("chartSchema", chartSchema)
module.exports={Model,joiObject}