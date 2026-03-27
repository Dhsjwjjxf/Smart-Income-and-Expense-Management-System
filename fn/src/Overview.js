import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import * as XLSX from "xlsx";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Sidebar from "../src/Sidebar";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Set up pdfMake fonts
pdfMake.vfs = pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : {};

const Overview = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [filterType, setFilterType] = useState("day");
  const [anchorElExport, setAnchorElExport] = useState(null);
  const exportOpen = Boolean(anchorElExport);

  // Fetch income and expense data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeResponse = await axios.get("http://localhost:5000/User/getIncome", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const expenseResponse = await axios.get("http://localhost:5000/User/getExpense", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setIncomeData(incomeResponse.data.data.Income || []);
        setExpenseData(expenseResponse.data.data.Expense || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Process data based on filter
  useEffect(() => {
    const processData = () => {
      const groupedData = {};
      const today = new Date();

      const filterAndGroup = (data, key) => {
        data.forEach((item) => {
          const date = new Date(item.Date);
          let groupKey;

          switch (filterType) {
            case "day":
              groupKey = date.toLocaleDateString();
              break;
            case "month":
              groupKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
              break;
            case "year":
              groupKey = date.getFullYear().toString();
              break;
            default:
              groupKey = date.toLocaleDateString();
          }

          if (!groupedData[groupKey]) {
            groupedData[groupKey] = { income: 0, expense: 0 };
          }
          groupedData[groupKey][key] += Number(item.Expense || item.Income || 0);
        });
      };

      filterAndGroup(incomeData, "income");
      filterAndGroup(expenseData, "expense");

      const labels = Object.keys(groupedData);
      const profits = labels.map((key) => groupedData[key].income - groupedData[key].expense);
      const backgroundColors = profits.map((profit) => (profit >= 0 ? "green" : "red"));

      setChartData({
        labels,
        datasets: [
          {
            label: "Profit/Loss",
            data: profits,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors,
            borderWidth: 1,
          },
        ],
      });

      setTableData(
        labels.map((label, index) => ({
          period: label,
          profitLoss: profits[index],
        }))
      );
    };

    if (incomeData.length || expenseData.length) {
      processData();
    }
  }, [incomeData, expenseData, filterType]);

  // Chart options with adjustments for responsiveness
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows chart to resize vertically
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Profit/Loss Overview" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Amount" } },
      x: {
        title: { display: true, text: filterType === "day" ? "Date" : filterType === "month" ? "Month" : "Year" },
        ticks: {
          autoSkip: true, // Automatically skip labels to prevent overlap
          maxRotation: 45, // Rotate labels for better fit
          minRotation: 0,
        },
      },
    },
  };

  // Export handlers
  const handleExportClick = (event) => setAnchorElExport(event.currentTarget);
  const handleExportClose = () => setAnchorElExport(null);

  const exportToExcel = () => {
    const data = tableData.map((row) => ({
      [filterType === "day" ? "Date" : filterType === "month" ? "Month" : "Year"]: row.period,
      "Profit/Loss": row.profitLoss,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Overview");
    XLSX.writeFile(workbook, "Profit_Loss_Overview.xlsx");
    handleExportClose();
  };

  const exportToPDF = () => {
    const docDefinition = {
      content: [
        { text: "Profit/Loss Overview", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "auto"],
            body: [
              [filterType === "day" ? "Date" : filterType === "month" ? "Month" : "Year", "Profit/Loss"],
              ...tableData.map((row) => [row.period, row.profitLoss]),
            ],
          },
        },
      ],
      styles: { header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] } },
    };
    pdfMake.createPdf(docDefinition).download("Profit_Loss_Overview.pdf");
    handleExportClose();
  };

  const handlePrint = () => {
    const printContent = document.getElementById("overview-container").outerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
    handleExportClose();
  };

  // Tab change handler
  const handleTabChange = (event, newValue) => setFilterType(newValue);

  return (
    <Sidebar navigatePathName="/dashboard/Overview">
        <div style={{width:"100%"}}>
      <Grid container spacing={2} sx={{ p: 2, height: "100%" ,width:"100%"}} id="overview-container">
        <Grid item xs={12}>
          <Tabs value={filterType} onChange={handleTabChange} centered>
            <Tab label="Day" value="day" />
            <Tab label="Month" value="month" />
            <Tab label="Year" value="year" />
          </Tabs>
        </Grid>
        <Grid item xs={12} sx={{ height: "400px", overflowX: "auto" }}>
          {chartData.labels && (
            <div style={{ position: "relative", height: "100%", width: "100%" }}>
              <Bar data={chartData} options={options} />
            </div>
          )}
        </Grid>
        <Grid item xs={12} sx={{ overflowX: "auto" }}>
          <TableContainer component={Paper} sx={{ maxHeight: "300px" }}>
            <Table stickyHeader aria-label="profit-loss table">
              <TableHead>
                <TableRow>
                  <TableCell>{filterType === "day" ? "Date" : filterType === "month" ? "Month" : "Year"}</TableCell>
                  <TableCell align="right">Profit/Loss</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.length > 0 ? (
                  tableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.period}</TableCell>
                      <TableCell align="right" style={{ color: row.profitLoss >= 0 ? "green" : "red" }}>
                        {row.profitLoss}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} container justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={handleExportClick}
            style={{ color: "white", backgroundColor: "black" }}
          >
            Export
          </Button>
          <Menu anchorEl={anchorElExport} open={exportOpen} onClose={handleExportClose}>
            <MenuItem onClick={exportToExcel}>Export to Excel</MenuItem>
            <MenuItem onClick={exportToPDF}>Export to PDF</MenuItem>
            <MenuItem onClick={handlePrint}>Print</MenuItem>
          </Menu>
        </Grid>
      </Grid></div>
    </Sidebar>
  );
};

export default Overview;