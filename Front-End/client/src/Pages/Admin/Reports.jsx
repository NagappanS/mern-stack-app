import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Download, PictureAsPdf } from "@mui/icons-material";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import API from "../../api/API"; // Axios instance
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Reports = () => {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [revenueData, setRevenueData] = useState([]);
  const [foodData, setFoodData] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await API.get(`/admin/reports?timeFrame=${timeFrame}`);
        setRevenueData(data.revenueByRestaurant || []);
        setFoodData(data.mostOrderedItems || []);
        setSummary(data.summary || {});
      } catch (err) {
        console.error(err);
      }
    };
    fetchReport();
  }, [timeFrame]);

  // Export CSV
  const exportCSV = () => {
    const headers = ["Restaurant", "Revenue"];
    const rows = revenueData.map(r => [r.restaurant, r.revenue]);
    const csv = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${timeFrame}_report.csv`;
    link.click();
  };

  // Export PDF
  const exportPDF = () => {
        const doc = new jsPDF();
  doc.text(`Admin Report - ${timeFrame.toUpperCase()}`, 14, 16);

  autoTable(doc,{
    head: [["Restaurant", "Revenue"]],
    body: revenueData.map(r => [r.restaurant, `₹${r.revenue}`]),
    startY: 25,
  });

  doc.text("Most Ordered Food Items", 14, doc.lastAutoTable.finalY + 10);
  autoTable(doc,{
    head: [["Food Item", "Count"]],
    body: foodData.map(f => [f.food, f.count]),
    startY: doc.lastAutoTable.finalY + 15,
  });

  doc.save(`${timeFrame}_report.pdf`);
  };

  const COLORS = ["#2196f3", "#4caf50", "#ff9800", "#e91e63", "#9c27b0"];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        📊 Reports & Analytics
      </Typography>

      {/* Filters + Exports */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Time Frame</InputLabel>
          <Select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Download />}
            sx={{ mr: 2 }}
            onClick={exportCSV}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<PictureAsPdf />}
            onClick={exportPDF}
          >
            Export PDF
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#e3f2fd" }}>
            <CardContent>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4" fontWeight="bold">
                {summary.totalOrders || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#e8f5e9" }}>
            <CardContent>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4" fontWeight="bold">
                ₹{summary.totalRevenue?.toLocaleString() || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>💰 Revenue by Restaurant</Typography>
              {revenueData.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <XAxis dataKey="restaurant" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#1976d2" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography>No data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>🍔 Most Ordered Food Items</Typography>
              {foodData.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={foodData}
                      dataKey="count"
                      nameKey="food"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {foodData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography>No data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
