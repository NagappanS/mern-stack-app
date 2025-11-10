// src/pages/delivery/DeliveryLayout.jsx
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
  Badge,
  Menu,
  MenuItem,
  Divider
} from "@mui/material";
import { LocalShipping, Notifications, Menu as MenuIcon, ChevronLeft } from "@mui/icons-material";
import { useNotification } from "../../context/NotificationContext";

const drawerWidth = 220;

const DeliveryLayout = ({ name, onLogout }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { notifications } = useNotification();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const toggleDrawer = () => setOpen(!open);

  useEffect(() => {
    // optional: check token/role here if needed
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 ,backgroundColor:"#F5BF0F"}}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton color="inherit" onClick={toggleDrawer}>
            {open ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Delivery Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">{name}</Typography>
            <IconButton color="inherit" onClick={handleOpen}>
              <Badge badgeContent={notifications.length} color="error">
            <Notifications/>
              </Badge>
            </IconButton>

            <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{ mt: 1 }}
        >
          {notifications.length === 0 ? (
            <MenuItem disabled>No new notifications</MenuItem>
          ) : (
            notifications.map((note) => (
              <MenuItem key={note.id}>
                <div>
                  <Typography variant="body2">{note.message}</Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >{`${note.date} ${note.time}`}</Typography>
                </div>
              </MenuItem>
            ))
          )}
          {notifications.length > 0 && <Divider />}
          {notifications.length > 0 && (
            <MenuItem onClick={handleClose} sx={{ textAlign: "center" }}>
              Close
            </MenuItem>
          )}
        </Menu>

            <Button onClick={onLogout} variant="contained" color="error" size="small">
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
          <ListItem button component={Link} to="/delivery">
            <ListItemIcon>
              <LocalShipping />
            </ListItemIcon>
            {open && <ListItemText primary="My Orders" />}
          </ListItem>
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

export default DeliveryLayout;
