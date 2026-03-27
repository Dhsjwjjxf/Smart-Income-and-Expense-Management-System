import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login"
import DashBoard from "./Dashboard"
import EditProfile from "./EditProfile"
import Income from "./Income"
import Expense from "./Expense"
import PageNotFound from "./PageNotFound"
import { Navigate } from "react-router-dom";
import Overview from "../src/Overview"
import ForgotPassword from "./ForgetPassword";
const PrivateAuth = (props) => {
  const isAuth = () => {
    let token = localStorage.getItem('token');
    return token ? true : false;
  };


  return isAuth() ? props.children : <Navigate to="/Login" />;
};



function App() {


  return (
    <>
 
       <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/forgetPassword" element={<ForgotPassword/>}/>
          <Route path="/DashBoard" element={<PrivateAuth><DashBoard /></PrivateAuth>} />
          <Route path="/EditProfile" element={<PrivateAuth><EditProfile /></PrivateAuth>} />
          <Route path="/Dashboard/Income" element={<PrivateAuth><Income /></PrivateAuth>} />
          <Route path="/Dashboard/Overview" element={<PrivateAuth><Overview /></PrivateAuth>} />


          <Route path="/Dashboard/Expense" element={<PrivateAuth><Expense /></PrivateAuth>} />
          <Route path="*" element={<PageNotFound/>}/>


        </Routes>
      </BrowserRouter> 

    </>

  );
}


export default App;
