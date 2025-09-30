// src/pages/AdminOrders.js
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
  Tab
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import API from "../../api/API";

const statusOptions = ["pending", "preparing", "delivered"];

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [filter, setFilter] = useState("all");

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Update order status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await API.put(`/admin/orders/${id}/status`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? res.data : order))
      );
    } catch (err) {
      console.error(err);
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
      <Typography variant="h5" sx = {{fontWeight:"bold",flexGrow: 1}}gutterBottom>
        Manage Orders
      </Typography>

      {/* Filters */}
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
                        <FormControl size="small">
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
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            alert("Future Action: View Invoice/Details")
                          }
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Expandable Items */}
                    <TableRow>
                      <TableCell
                        colSpan={6}
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
    </Box>
  );
};

export default OrdersAdmin;
