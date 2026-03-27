import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Navbar from "./Navbar";
import Sidebar from "../src/Sidebar";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PiChart from "./Pichart";
import Grid from "@mui/material/Grid";
import axios from "axios";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as XLSX from 'xlsx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// Set up pdfMake fonts with a fallback
pdfMake.vfs = pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : {};

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [Edit, setEdit] = React.useState();
  const [arr, setArr] = React.useState([]);
  const [filteredArr, setFilteredArr] = React.useState([]);
  const [data, setData] = React.useState({});
  const [update, setUpdate] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [anchorElExport, setAnchorElExport] = React.useState(null); // For Export dropdown
  const [anchorElSort, setAnchorElSort] = React.useState(null); // For Sort dropdown
  const [filterType, setFilterType] = React.useState("Today");
  const [selectedTab, setSelectedTab] = React.useState("today");
  const exportOpen = Boolean(anchorElExport);
  const sortOpen = Boolean(anchorElSort);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleExportClick = (event) => {
    setAnchorElExport(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorElExport(null);
  };

  const handleSortClick = (event) => {
    setAnchorElSort(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorElSort(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Edit) {
      axios.post(`http://localhost:5000/User/updateExpense?id=${Edit}`, { arr: { ...data } }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then(() => {
        setUpdate(!update);
      }).catch((err) => {
        console.log(err);
      });
    } else {
      axios.post(`http://localhost:5000/User/Expense`, { arr: { ...data, Date: new Date().toLocaleString() } }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then(() => {
        setUpdate(!update);
      }).catch((err) => {
        console.log(err);
      });
    }
    setOpen(false);
    setEdit("");
    setData({});
  };

  const handleClose = () => {
    setOpen(false);
    setEdit("");
    setData({});
  };

  const handleChange = (e, type) => {
    setData({ ...data, [type]: e.target.value });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredArr);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expense");
    XLSX.writeFile(workbook, "Expense_Data.xlsx");
    handleExportClose();
  };

  const exportToPDF = () => {
    const docDefinition = {
      content: [
        { text: 'Expense Data', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', '*'],
            body: [
              ['Index', 'Date', 'Expense', 'Category', 'Description'],
              ...filteredArr.map((row, index) => [
                index + 1,
                row.Date ?? '',
                row.Expense ?? '',
                row.Category ?? '',
                row.Description ?? '',
              ]),
            ],
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      },
    };
    try {
      pdfMake.createPdf(docDefinition).download('Expense_Data.pdf');
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
    handleExportClose();
  };

  const handlePrint = () => {
    const printContent = document.getElementById('table-to-print').outerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
    handleExportClose();
  };
  const filterData = (filterType) => {
    const today = new Date();
    let filtered = arr;

    switch (filterType) {
      case "today":
        filtered = arr.filter(row => new Date(row.Date).toDateString() === today.toDateString());
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        filtered = arr.filter(row => new Date(row.Date).toDateString() === yesterday.toDateString());
        break;
      case "last7days":
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 7);
        filtered = arr.filter(row => new Date(row.Date) >= last7Days);
        break;
      case "thisMonth":
        filtered = arr.filter(row => new Date(row.Date).getMonth() === today.getMonth() && new Date(row.Date).getFullYear() === today.getFullYear());
        break;
      case "thisYear":
        filtered = arr.filter(row => new Date(row.Date).getFullYear() === today.getFullYear());
        break;
      case "lastYear":
        filtered = arr.filter(row => new Date(row.Date).getFullYear() === today.getFullYear() - 1);
        break;
      default:
        filtered = arr;
    }
    setFilteredArr(filtered);
  };



  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredArr(arr);
    } else {
      const filtered = arr.filter((row) =>
        row.Date?.toLowerCase().includes(term.toLowerCase()) ||
        row.Expense?.toString().includes(term) ||
        row.Category?.toLowerCase().includes(term.toLowerCase()) ||
        row.Description?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredArr(filtered);
    }
  };

  // Sorting functions
  const sortByExpenseAsc = () => {
    const sorted = [...filteredArr].sort((a, b) => (Number(a.Expense) || 0) - (Number(b.Expense) || 0));
    setFilteredArr(sorted);
    handleSortClose();
  };

  const sortByExpenseDesc = () => {
    const sorted = [...filteredArr].sort((a, b) => (Number(b.Expense) || 0) - (Number(a.Expense) || 0));
    setFilteredArr(sorted);
    handleSortClose();
  };

  const sortByDateAsc = () => {
    const sorted = [...filteredArr].sort((a, b) => new Date(a.Date || 0) - new Date(b.Date || 0));
    setFilteredArr(sorted);
    handleSortClose();
  };

  const sortByDateDesc = () => {
    const sorted = [...filteredArr].sort((a, b) => new Date(b.Date || 0) - new Date(a.Date || 0));
    setFilteredArr(sorted);
    handleSortClose();
  };
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    filterData(newValue);
  };

  React.useEffect(() => {
    axios.get("http://localhost:5000/User/getExpense", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((response) => {
      const expenseData = response.data.data.Expense;
      setArr(expenseData);
      setFilteredArr(expenseData);
    }).catch((err) => {
      console.log(err);
    });
  }, [update, filterType]);

  return (
    <Sidebar navigatePathName="/dashboard/Expense">
      <Navbar />
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Today" value="today" />
        <Tab label="Yesterday" value="yesterday" />
        <Tab label="Last 7 Days" value="last7days" />
        <Tab label="This Month" value="thisMonth" />
        <Tab label="This Year" value="thisYear" />
        <Tab label="Last Year" value="lastYear" />
      </Tabs>
      <Grid container justifyContent="end" sx={{ mt: 5, pt: 5, mb: 2 }}>
        <Grid item xs={5.4} md={2}>
          <Button variant="outlined" onClick={handleClickOpen} style={{ color: "white", backgroundColor: "black" }}>
            Add Expense
          </Button>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{Edit ? "Edit" : "Add"} Expense Details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <TextField
                required
                margin="dense"
                id="Date"
                name="Date"
                label="Date"
                type="date"
                value={data.Date || ''}
                onChange={(e) => handleChange(e, "Date")}
                fullWidth
                variant="standard"
                InputLabelProps={{
                  shrink: true,
  }}
/>
              <TextField
                autoFocus
                required
                margin="dense"
                id="Expense"
                name="Expense"
                label="Expense"
                onChange={(e) => handleChange(e, "Expense")}
                value={data.Expense || ''}
                type="number"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="Category"
                name="Category"
                label="Category"
                value={data.Category || ''}
                onChange={(e) => handleChange(e, "Category")}
                type="text"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="Description"
                name="Description"
                label="Description"
                value={data.Description || ''}
                onChange={(e) => handleChange(e, "Description")}
                type="text"
                fullWidth
                variant="standard"
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button style={{ color: "white", backgroundColor: "black" }} onClick={handleClose}>
              Cancel
            </Button>
            <Button style={{ color: "white", backgroundColor: "black" }} type="submit">
              {Edit ? "Edit" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Grid container justifyContent="center">
        <Grid item xs={8} md={6}>
          <PiChart
            Url="http://localhost:5000/User/getExpense"
            type="Expense"
            update={update}
            filteredArr={filteredArr}
          />
        </Grid>
      </Grid>

      <Grid container sx={{ px: 4, mt: 2, mb: 3 }}>
        <Grid item xs={12}>
          <Grid container justifyContent="end" sx={{ mb: 2 }} spacing={2}>
            <Grid item xs={6} sm={4} md={3}>
              <TextField
                fullWidth
                label="Search Expense"
                value={searchTerm}
                onChange={handleSearch}
                variant="outlined"
                placeholder="Search..."
              />
            </Grid>
            <Grid item xs={6} sm={2} md={2}>
              <Button
                variant="outlined"
                onClick={handleSortClick}
                style={{ color: "white", backgroundColor: "black", width: '100%' }}
              >
                Sort
              </Button>
              <Menu
                anchorEl={anchorElSort}
                open={sortOpen}
                onClose={handleSortClose}
              >
                <MenuItem onClick={sortByExpenseAsc}>Sort by Expense (Asc)</MenuItem>
                <MenuItem onClick={sortByExpenseDesc}>Sort by Expense (Desc)</MenuItem>
                <MenuItem onClick={sortByDateAsc}>Sort by Date (Asc)</MenuItem>
                <MenuItem onClick={sortByDateDesc}>Sort by Date (Desc)</MenuItem>
              </Menu>
            </Grid>
            <Grid item xs={6} sm={2} md={2}>
              <Button
                variant="outlined"
                onClick={handleExportClick}
                style={{ color: "white", backgroundColor: "black", width: '100%' }}
              >
                Export
              </Button>
              <Menu
                anchorEl={anchorElExport}
                open={exportOpen}
                onClose={handleExportClose}
              >
                <MenuItem onClick={exportToExcel}>Export to Excel</MenuItem>
                <MenuItem onClick={exportToPDF}>Export to PDF</MenuItem>
                <MenuItem onClick={handlePrint}>Print</MenuItem>
              </Menu>
            </Grid>
          </Grid>

          <TableContainer component={Paper} id="table-to-print" sx={{ borderRadius: '16px' }}>
            <Table sx={{ minWidth: 650 }} aria-label="expense table">
              <TableHead>
                <TableRow>
                  <TableCell>Index</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Expense</TableCell>
                  <TableCell align="right">Category</TableCell>
                  <TableCell align="right">Description</TableCell>
                  <TableCell align="center">Edit</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredArr.length > 0 ? (
                  filteredArr.map((row, index) => (
                    <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">{index + 1}</TableCell>
                      <TableCell>{row.Date}</TableCell>
                      <TableCell align="right">{row.Expense}</TableCell>
                      <TableCell align="right">{row.Category}</TableCell>
                      <TableCell align="right">{row.Description}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          style={{ color: "white", backgroundColor: "black" }}
                          onClick={() => {
                            setData(row);
                            setEdit(row.id);
                            setOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          style={{ color: "white", backgroundColor: "black" }}
                          onClick={() => {
                            axios.delete(`http://localhost:5000/User/deleteExpense/?id=${row.id}`, {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                              },
                            }).then(() => {
                              setUpdate(!update);
                            }).catch((err) => {
                              console.log(err);
                            });
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Sidebar>
  );
}