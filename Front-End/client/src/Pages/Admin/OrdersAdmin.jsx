import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import API from "../../api/API";

const statusOptions = ["pending", "preparing", "delivered"];

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [filter, setFilter] = useState("all");
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otpInput, setOtpInput] = useState("");

  // Fetch all orders (Admin)
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders"); // backend path for all orders
      console.log(res);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Update order status manually
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await API.put(`/orders/${id}/status`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? res.data : order))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Open OTP dialog
  const handleOpenOtpDialog = (order) => {
    setSelectedOrder(order);
    setOtpInput("");
    setOtpDialogOpen(true);
  };

  // Verify OTP for order delivery
  const handleVerifyOtp = async () => {
    try {
      const res = await API.post(
        `/orders/${selectedOrder._id}/verify-otp`,
        { otp: otpInput }
      );
      // Update orders state
      setOrders((prev) =>
        prev.map((o) => (o._id === selectedOrder._id ? res.data.order : o))
      );
      setOtpDialogOpen(false);
      alert("OTP verified! Order delivered successfully.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "OTP verification failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  return (
    <Box p={3}>
      <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
        Manage Orders
      </Typography>

      {/* Filter Tabs */}
      <Tabs
        value={filter}
        onChange={(e, v) => setFilter(v)}
        sx={{ mb: 2 }}
      >
        <Tab label="All" value="all" />
        <Tab label="Pending" value="pending" />
        <Tab label="Preparing" value="preparing" />
        <Tab label="Delivered" value="delivered" />
      </Tabs>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Order ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Delivery Man</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <TableRow>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() =>
                            setOpenRow(openRow === order._id ? null : order._id)
                          }
                        >
                          {openRow === order._id ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>

                      <TableCell>{order._id}</TableCell>

                      <TableCell>
                        {order.user?.name} <br />
                        <small>{order.user?.email}</small>
                      </TableCell>

                      <TableCell>₹{order.totalPrice}</TableCell>

                      <TableCell>
                        <FormControl size="small" fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                          >
                            {statusOptions.map((s) => (
                              <MenuItem key={s} value={s}>
                                {s}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>

                      <TableCell>
                        {order.deliveryMan?._id}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenOtpDialog(order)}
                        >
                          Verify OTP
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ ml: 1 }}
                          onClick={() => alert("Future: View Invoice/Details")}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Expandable Items */}
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                      >
                        <Collapse
                          in={openRow === order._id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={2}>
                            <Typography variant="subtitle1" gutterBottom>
                              Items
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Food</TableCell>
                                  <TableCell>Quantity</TableCell>
                                  <TableCell>Price</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {order.items.map((item, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>{item.food?.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>
                                      ₹{item.food?.price * item.quantity}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* OTP Verification Dialog */}
      <Dialog
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
      >
        <DialogTitle>Verify Delivery OTP</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter OTP"
            fullWidth
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOtpDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleVerifyOtp}>
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersAdmin;
