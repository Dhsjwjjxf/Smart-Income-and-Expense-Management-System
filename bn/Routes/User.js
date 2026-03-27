const express = require("express");
const {
  AddUser,
  findUser,
  LoginUser,
  updateUser,
} = require("../Controller/USerConrtoller");
const { AddIncome, getIncome, updateIncome, deleteIncome } = require("../Controller/IncomeController");
const { AddExpense, getExpense, updateExpense, deleteExpense } = require("../Controller/ExpenseController");
const jwt = require("jsonwebtoken");

const routes = express.Router();
const isAuth = (req, res, next) => {
  let token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  try {
    let val = jwt.decode(token);
    if (token && val) {
      let val = jwt.decode(token);

      req.val = val;

      next();
    } else {
      res.send("Jwt not verify");
    }
  } catch (err) {
    console.log("in err", err);
    res.send(err);
  }
};
routes.post("/Register", AddUser);
routes.get("/findUser",isAuth,findUser)
routes.post("/Login", LoginUser);
routes.post("/Income", isAuth, AddIncome);
routes.post("/Expense", isAuth, AddExpense);
routes.get("/getExpense", isAuth, getExpense);
routes.get("/getIncome", isAuth, getIncome);
routes.post("/updateUser", isAuth, updateUser);
routes.post("/updateExpense", isAuth, updateExpense);
routes.delete("/deleteExpense", isAuth, deleteExpense)
routes.post("/updateIncome", isAuth, updateIncome);
routes.delete("/deleteIncome", isAuth, deleteIncome)

module.exports = routes;
