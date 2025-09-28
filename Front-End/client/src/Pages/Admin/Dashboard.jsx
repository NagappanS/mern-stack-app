import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import API from "../../api/API"; // your axios instance

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/admin/stats");
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <Typography>Loading dashboard...</Typography>;

  const { cards, charts } = stats;

  return (
    <Box p={3}>
        <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            📊 Admin Dashboard
          </Typography>
      {/* ===== Dashboard Cards ===== */}
      <Grid container spacing={3}>
        <DashboardCard title="Pending Orders 🔴" value={cards.pendingOrders} />
        <DashboardCard title="Completed Orders ✅" value={cards.completedOrders} />
        <DashboardCard title="👥 Total Users" value={cards.totalUsers} />
        <DashboardCard title="🍴 Total Restaurants" value={cards.totalRestaurants} />
        <DashboardCard title="🛒 Total Foods" value={cards.totalFoods} />
        <DashboardCard title="💰 Total Revenue" value={`₹${cards.totalRevenue}`} />
      </Grid>

      {/* ===== Charts ===== */}
      <Grid container spacing={3} mt={3}>
        {/* Orders per Day */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">📈 Orders per Day</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={charts.ordersPerDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue by Month */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">💵 Revenue by Month</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charts.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Selling Foods */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">🍕 Top Selling Foods</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={charts.topSellingFoods}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {charts.topSellingFoods.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function DashboardCard({ title, value }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ textAlign: "center", p: 2 }}>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="h5" fontWeight="bold">{value}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
