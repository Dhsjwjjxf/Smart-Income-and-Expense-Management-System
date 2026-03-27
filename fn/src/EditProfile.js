import React, { useEffect, useState } from "react"
import Navbar from "./Navbar"
import axios from "axios"
import Alert from "@mui/material/Alert"
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Grid, Box, Button } from '@mui/material';
const EditProfile = () => {
  const [data, setData] = useState({})
  const [alert, setAlert] = React.useState()
  const [type, setType] = React.useState()
  const [update, doUpdate] = React.useState(false)
  useEffect(() => {
    axios.get("http://localhost:5000/User/findUser", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((data1) => {
      setData(data1.data.data)

    }).catch((err) => {
      console.log(err)
    })

  }, [update])
  const handleChange = (e, type) => {
    setData({ ...data, [type]: e.target.value })
  }
  return (<>
    <Navbar />
    <Grid container spacing={2} justifyContent="center" sx={{ mt: 6, mb: 1 }}>
  <Grid items xs={2}>

  </Grid>
      <Grid item xs={8} sx={{ mt: 2 }}>
        

        {alert && <Alert severity={type}>{alert}</Alert>}
        {/* <TextField id="input-with-sx" disabled={true} label="Email" variant="standard" fullWidth value={data.Email} /> */}
      </Grid>
     
      <Grid items xs={2}>
    
    </Grid>


      <Grid item xs={4} sx={{ mt: 2 }}>

        <TextField id="input-with-sx" disabled={true} label="Email" variant="standard" fullWidth value={data.Email} />
      </Grid>
      <br />
    </Grid>
    <Grid container spacing={2} justifyContent="center" sx={{ mb: 1 }}>

      <Grid item xs={4} >

        <TextField id="input-with-sx" label="First Name" variant="standard" fullWidth value={data.FirstName} onChange={(e) => { handleChange(e, "FirstName") }} />
      </Grid>
    </Grid>
    <Grid container spacing={2} justifyContent="center" sx={{ mb: 1 }}>

      <Grid item xs={4}>

        <TextField id="input-with-sx" label="Last Name" variant="standard" fullWidth value={data.LastName} onChange={(e) => { handleChange(e, "LastName") }} />
      </Grid>
    </Grid>
    <Grid container spacing={2} justifyContent="center" sx={{ my: 1 }}>

      <Grid item xs={4}>


        <Button variant="contained" onClick={() => {
          axios.post(`http://localhost:5000/User/updateUser`, data, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }).then((data) => {
            if (data.data.msg == "user upadeted success") {
              setAlert(data.data.msg)
              setType("success")
              doUpdate(!update)
            }

          }).catch((err) => {
            console.log(err)
          })
        }}>Save</Button>

        {/* <TextField id="input-with-sx"  label="Last Name" variant="standard"  fullWidth/> */}
      </Grid>
    </Grid>


  </>


  )


}
export default EditProfile;