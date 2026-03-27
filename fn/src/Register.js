import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import {  useNavigate } from 'react-router-dom';
import HomeNavbar from "./HomeNavbar"
import Alert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios"
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
 

  const nav=useNavigate();
  const [data,setData]=React.useState()
  const [alert,setAlert]=React.useState()
  const [type,setType]=React.useState()




  
  
  
  
  
  
  
  
  const Submit=(e)=>{
   
    axios.post("http://localhost:5000/User/Register",data).then((data)=>{
      if(data.data.msg=="data Added"){
        setType("success")
        setAlert("Register Succesuflly wait sometime for login page")
        setTimeout(()=>{
          nav("/Login")

        },2000)
        

      }else if(data.data.err){
        setType("error")
        setAlert(data.data.err[0].message)

      }else if(data.data.msg){
        setType("error")
        setAlert(data.data.msg)
      }
      
    }).catch((err)=>{
        console.log(err)
    })

  }
  const handleChange=(e,type)=>{
  
    if(type=="Email"){
        setData({...data,[type]:e.target.value})

    }else if(type=="FirstName"){
        setData({...data,[type]:e.target.value})
    }
    else if(type=="Password"){
        setData({...data,[type]:e.target.value})
    }
    else if(type=="LastName"){
        setData({...data,[type]:e.target.value})
    }
  }

  return (<>
    {/* <HomeNavbar/> */}
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'black' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
        {alert&&  <Alert severity={type}>{alert}</Alert>}
          <Box component="form"   sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  
                  onChange={(e)=>{
                    handleChange(
                        e,"FirstName"
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={(e)=>{
                    handleChange(
                        e,"LastName"
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e)=>{
                    handleChange(
                        e,"Email"
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(e)=>{
                    handleChange(
                        e,"Password"
                    )
                  }}
                />
              </Grid>
             
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{color:"white",backgroundColor:"black"}}
              sx={{ mt: 3, mb: 2 }}
              onClick={(e)=>{
                e.preventDefault()
               Submit()
              }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/Login"  >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
    </>
  );
}