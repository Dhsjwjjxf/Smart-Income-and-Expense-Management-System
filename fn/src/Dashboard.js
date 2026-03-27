import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangeCalendar } from "@mui/x-date-pickers-pro/DateRangeCalendar";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Sidebar from "../src/Sidebar"
import axios from "axios";
import Grid from "@mui/material/Grid";
import PiChart from "./Pichart";
import Grpah from "./Graph";
import { Container, Typography, Paper } from "@mui/material";
import Navbar from "./Navbar";

// Summary Card Component
function SummaryCard({ title, value, color, icon }) {
  return (
    <Card
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: 'white',
        height: '100%',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Typography 
        variant="subtitle1" 
        fontWeight="bold" 
        color="text.secondary"
      >
        {title}
      </Typography>
      
      <Box sx={{ fontSize: '32px', my: 2, color: '#616161' }}>
        {icon}
      </Box>
      
      <Typography 
        variant="h5" 
        component="div" 
        fontWeight="600" 
        color={color}
      >
        ₹{parseInt(value).toLocaleString('en-IN')}
      </Typography>
    </Card>
  );
}

export default function OutlinedCard() {
  const [update, doUpdate] = React.useState(false);
  const [incomeTotal, setIncomeTotal] = React.useState(0);
  const [expenseTotal, setExpenseTotal] = React.useState(0);
  
  // Fetch summary data
  React.useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch expense data
        const expenseResponse = await axios.get(
          "http://localhost:5000/User/getExpense",
          { headers }
        );
        
        if (expenseResponse.data && expenseResponse.data.data && expenseResponse.data.data.Expense) {
          const expenseData = expenseResponse.data.data.Expense;
          const total = expenseData.reduce((sum, item) => {
            // Convert string values to numbers before adding
            return sum + (parseInt(item.Expense) || 0);
          }, 0);
          setExpenseTotal(total);
        }
        
        // Fetch income data
        const incomeResponse = await axios.get(
          "http://localhost:5000/User/getIncome",
          { headers }
        );
        
        if (incomeResponse.data && incomeResponse.data.data && incomeResponse.data.data.Income) {
          const incomeData = incomeResponse.data.data.Income;
          const total = incomeData.reduce((sum, item) => {
            // Convert string values to numbers before adding
            return sum + (parseInt(item.Income) || 0);
          }, 0);
          setIncomeTotal(total);
        }
      } catch (error) {
        console.error("Error fetching summary data:", error);
        // Don't set fallback values so we can see the real calculated totals
      }
    };
    
    fetchSummaryData();
  }, [update]);
  
  const profitLoss = incomeTotal - expenseTotal;
  const isProfitable = profitLoss >= 0;

  const updateState = () => {
    doUpdate(!update);
  };

  return (
    <>
      <Sidebar>
        <>
          {/* Fixed Summary Cards */}
          <Box sx={{ px: 3, pt: 3, pb: 1 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
              Financial Summary
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <SummaryCard 
                  title="Total Income" 
                  value={incomeTotal} 
                  color="#2e7d32"
                  icon="💰"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SummaryCard 
                  title="Total Expense" 
                  value={expenseTotal}
                  color="#d32f2f"
                  icon="💸"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SummaryCard 
                  title={isProfitable ? "Net Profit" : "Net Loss"} 
                  value={Math.abs(profitLoss)}
                  color={isProfitable ? "#1976d2" : "#ed6c02"}
                  icon={isProfitable ? "📈" : "📉"}
                />
              </Grid>
            </Grid>
          </Box>
          
          {/* Original Graph Components */}
          <Grid container sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Grpah
                Url="http://localhost:5000/User/getExpense"
                Title="Expense"
                update={update}
              />
            </Grid>
            <Grid item xs={12}>
              <Grpah
                Url="http://localhost:5000/User/getIncome"
                Title="Income"
                update={update}
              />
            </Grid>
          </Grid>
        </>
      </Sidebar>
    </>
  );
}