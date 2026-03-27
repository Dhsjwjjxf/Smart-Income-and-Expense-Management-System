const { json } = require('express')
const model = require('../Model/IncomeModel')
const { Model } = require('../Model/RegisterModel')

const AddIncome = (req, res) => {
    let {  arr } = req.body
    let UserID = req.val.data._id;

    Model.findOne({ _id: UserID }).then((data1) => {
        if (data1) {

            model.findOne({ UserID }).then((data) => {

                if (data) {
                    let obj = JSON.parse(JSON.stringify(data))
                    obj.Income.push({...arr,id:obj.Income.length+1})

                    model.updateOne({ UserID }, obj).then((data) => {
                        res.send({ msg: "obj Added success", data })
                    })
                        .catch((err) => {
                            res.send({ err })
                        })
                } else {
                    const model1 = new model({
                        UserID,
                        Income: [{...arr,id:1}]
                    })
                    model1.save().then((data) => {
                        res.send({ msg: "Income Added", data })
                    })
                        .catch((err) => {
                            res.send({ err })
                        })
                }
            })
        } else {
            res.send({ Msg: "invalid user" })
        }


    })
        .catch((err) => {
            res.send({ err })
        })
}

const getIncome = (req, res) => {
    model.findOne({ UserID: req.val.data._id }).then((data) => {
        console.log(data)
        res.send({ data })
    }).catch((err) => {
        res.send({ err })
    })

}

const updateIncome = (req, res) => {
    let id = req.query.id;
    model.findOne({ UserID: req.val.data._id }).then((data) => {
     
      if (data) {
        let copy = JSON.parse(JSON.stringify(data))
        let idx=data.Income.findIndex((e)=>(e.id==id))
      
        copy.Income[idx]=req.body.arr
      
        model.updateOne({ UserID: req.val.data._id }, copy).then((data) => {
          
          res.send({ msg: "Data Update" })
        }).catch((err) => {
          res.send({ err })
        })
  
  
  
  
  
  
  
  
      } else {
        res.send({ msg: "data not found" })
      }
    }
    ).catch((err) => {
      res.send({ err })
    })
  }
  const deleteIncome=(req,res)=>{
  
    model.findOne({UserID:req.val.data._id}).then((data)=>{
      if(data){
        let dataCopy=JSON.parse(JSON.stringify(data))
        let id=req.query.id;
        let index=data.Income.findIndex((ele)=>(ele.id==id))
        dataCopy.Income.splice(index,1);
        for(i=index;i<dataCopy.Income.length;i++){
          dataCopy.Income[i].id-=1

        }
        model.updateOne({UserID:req.val.data._id},dataCopy).then((data)=>{
          if(data){
            res.send({msg:"data Deleted"})
          }else{
            res.send({msg:"data not updated"})
          }
        })
      }
    }).catch((err)=>{
      res.send({err})
    })
  
  }
module.exports = { AddIncome, getIncome,updateIncome, deleteIncome}