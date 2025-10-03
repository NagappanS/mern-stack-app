// src/pages/delivery/DeliveryOrders.jsx
import { useEffect, useState } from "react";
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import API from "../../api/API";

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otpInput, setOtpInput] = useState("");

  const deliveryManId = localStorage.getItem("deliverymanId");
  console.log("deliveryId",deliveryManId);
   // Fetch orders assigned to this delivery man
  const fetchOrders = async () => {
    if(!deliveryManId) return;
    try {
      const res = await API.get(`/orders/delivery/${deliveryManId}`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [deliveryManId]);

  const handleOpenOtpDialog = (order) => {
    setSelectedOrder(order);
    setOtpInput("");
    setOtpDialogOpen(true);
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await API.post(`/orders/${selectedOrder._id}/verify-otp`, {
        otp: otpInput,
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === selectedOrder._id ? res.data.order : o))
      );
      setOtpDialogOpen(false);
      alert("OTP verified ✅. Order delivered.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "OTP verification failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
        My Deliveries
      </Typography>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Delivery Address</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Map</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>
                      {order.user?.name}
                      <br />
                      <small>{order.user?.phone}</small>
                    </TableCell>
                    <TableCell>{order.deliveryInfo?.address}</TableCell>
                    <TableCell>₹{order.totalPrice}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      {order.location?.lat && order.location?.lng ? (
                        <a
                          href={`https://www.google.com/maps?q=${order.location.lat},${order.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Map
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenOtpDialog(order)}
                      >
                        Verify OTP
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* OTP Verification Dialog */}
      <Dialog open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)}>
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

export default DeliveryOrders;
