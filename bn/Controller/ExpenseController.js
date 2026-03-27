const { json } = require("express");
const model = require("../Model/ExpenseModel");
const { Model } = require("../Model/RegisterModel");

const AddExpense = (req, res) => {
  let { arr } = req.body;
  let UserID = req.val.data._id;
  Model.findOne({ _id: UserID })
    .then((data1) => {
      if (data1) {
        model.findOne({ UserID }).then((data) => {
          if (data) {
            let obj = JSON.parse(JSON.stringify(data));

            obj.Expense.push({...arr,id:obj.Expense.length+1});

            model
              .updateOne({ UserID }, obj)
              .then((data) => {
                res.send({ msg: "obj Added success", data });
              })
              .catch((err) => {
                res.send({ err });
              });
          } else {
            const model1 = new model({
              UserID,
              Expense: [{...arr,id:1}],
            });
            model1
              .save()
              .then((data) => {
                res.send({ msg: "Expense Added", data });
              })
              .catch((err) => {
                console.log(err);
                res.send({ err });
              });
          }
        });
      } else {
        res.send({ Msg: "invalid user" });
      }
    })
    .catch((err) => {
      res.send({ err });
    });
};
const getExpense = (req, res) => {
  model
    .findOne({ UserID: req.val.data._id })
    .then((data) => {
      console.log(data);
      res.send({ data });
    })
    .catch((err) => {
      res.send({ err });
    });
};

const updateExpense = (req, res) => {
  let id = req.query.id;
  model.findOne({ UserID: req.val.data._id }).then((data) => {
   
    if (data) {
      let copy = JSON.parse(JSON.stringify(data))
      let index=copy.Expense.findIndex((ele)=>(ele.id==id))
      copy.Expense[index]=req.body.arr
    
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
const deleteExpense=(req,res)=>{

  model.findOne({UserID:req.val.data._id}).then((data)=>{
    if(data){
      let dataCopy=JSON.parse(JSON.stringify(data))
      console.log(req.query.id)
      let id=req.query.id;
      let index=data.Expense.findIndex((ele)=>(ele.id==id))
      dataCopy.Expense.splice(index,1)
      for(i=index;i<dataCopy.Expense.length;i++){
        dataCopy.Expense[i].id-=1

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
module.exports = { AddExpense, getExpense,updateExpense ,deleteExpense};
