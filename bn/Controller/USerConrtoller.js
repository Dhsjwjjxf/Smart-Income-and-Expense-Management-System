const { Model, joiObject } = require('../Model/RegisterModel')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const AddUser = (req, res) => {
    try {
        let { error, value } = joiObject.validate(req.body);
        console.log({ error }, { value })

        if (error) {
            res.send({ err: error.details });
        } else {
            Model.findOne({Email:req.body.Email}).then((data1)=>{
                if(data1){
                    res.send({msg:"User Already Exist"})
                }else{

                    let { Email, Password, FirstName, LastName } = req.body;
                    let bcriptedPass = bcrypt.hashSync(Password, 10);
        
                    const model1 = new Model({
                        Email,
                        Password: bcriptedPass,
                        FirstName,
                        LastName
                    });
        
                    model1.save().then((data) => {
                        res.send({ msg: "data Added", data });
                    }).catch((err) => {
                        res.send({ msg: "Error", err });
                    });
                }
            })


        }
    } catch (err) {
        console.log(err)
    }
};

const LoginUser = (req, res) => {
    Model.findOne({ Email: req.body.Email }).then((data) => {
        if (data) {
            let check = bcrypt.compareSync(req.body.Password, data.Password)
            if (data.Email == req.body.Email && check) {
                let token = jwt.sign({ data }, "User")
                res.send({ msg: "Login Success", token })
            }
            else {
                res.send({ msg: "Enter Valid Password" })
            }
        }
        else {
            res.send({ msg: "Register First" })
        }
    })
        .catch((err) => {
            res.send({ err })
        })
}

const updateUser = (req, res) => {


    Model.findOne({ _id: req.val.data._id }).then((data) => {
        if (data) {
          
            let obj = JSON.parse(JSON.stringify(data))
            if (req.body.FirstName) {
                obj.FirstName = req.body.FirstName
            }
            if (req.body.LastName) {
                obj.LastName = req.body.LastName
            }
            Model.updateOne({ _id: req.val.data._id }, obj).then((data) => {
                res.send({ msg: "user upadeted success" })
            })
                .catch((err) => {
                    res.send({ err })
                })

        }
    })
        .catch((err) => {
            res.send({ err })
        })
}

const findUser=(req,res)=>{
    Model.findOne({_id:req.val.data._id}).then((data)=>{
        if(data){
            res.send({msg:"data finded",data})
        }else{
            res.send({msg:"data not found"})
        }
    }).catch((err)=>{
        res.send({err})
    })
}
module.exports = { AddUser, LoginUser, updateUser,findUser }