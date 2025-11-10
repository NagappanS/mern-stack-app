// src/pages/admin/AdminLayout.jsx
import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  Button,
} from "@mui/material";
import {
  Dashboard,
  People,
  Restaurant,
  Fastfood,
  ShoppingCart,
  BarChart,
  Settings,
  Notifications,
  Menu as MenuIcon,
  ChevronLeft,
  LocalShipping,
} from "@mui/icons-material";

const drawerWidth = 240;

const AdminLayout = ({ onLogout, name, role }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const toggleDrawer = () => setOpen(!open);

  useEffect(() => {
    if (!role) {
      navigate("/login");
    }
  }, [role, navigate]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1,backgroundColor:"#740C08"}}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton color="inherit" onClick={toggleDrawer}>
            {open ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Panel — {role === "admin" ? "Administrator" : "Delivery"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
            <Typography variant="body1">{name}</Typography>
            <Button
              onClick={onLogout}
              color="error"
              variant="contained"
              size="small"
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar>
          <img
            src="../assets/JOY.png"
            alt="Logo"
            style={{
              width: "120px",
              marginTop: "50px",
              marginBottom: "20px",
              display: "block",
            }}
          />
        </Toolbar>

        <List>
          
            <>
              <ListItem button component={Link} to="/admin">
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                {open && <ListItemText primary="Dashboard" />}
              </ListItem>

              <ListItem button component={Link} to="/admin/users">
                <ListItemIcon>
                  <People />
                </ListItemIcon>
                {open && <ListItemText primary="Users" />}
              </ListItem>

              <ListItem button component={Link} to="/admin/restaurants">
                <ListItemIcon>
                  <Restaurant />
                </ListItemIcon>
                {open && <ListItemText primary="Restaurants" />}
              </ListItem>

              <ListItem button component={Link} to="/admin/foods">
                <ListItemIcon>
                  <Fastfood />
                </ListItemIcon>
                {open && <ListItemText primary="Foods" />}
              </ListItem>

              <ListItem button component={Link} to="/admin/orders">
                <ListItemIcon>
                  <ShoppingCart />
                </ListItemIcon>
                {open && <ListItemText primary="Orders" />}
              </ListItem>

              <ListItem button component={Link} to="/admin/manage-deliverymen">
                <ListItemIcon>
                  <LocalShipping />
                </ListItemIcon>
                {open && <ListItemText primary="Manage Delivery Men" />}
              </ListItem>

              <ListItem button component={Link} to="/admin/reports">
                <ListItemIcon>
                  <BarChart />
                </ListItemIcon>
                {open && <ListItemText primary="Reports" />}
              </ListItem>

              <ListItem button component={Link} to="/admin/settings">
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                {open && <ListItemText primary="Settings" />}
              </ListItem>

              <ListItem button component={Link} to="/admin/manage-admins">
                <ListItemIcon>
                  <People />
                </ListItemIcon>
                {open && <ListItemText primary="Manage Admins" />}
              </ListItem>
            </>

        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          transition: "margin 0.3s",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
