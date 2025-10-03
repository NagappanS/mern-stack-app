// src/pages/admin/ManageDeliveryMan.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import API from "../../api/API";

const ManageDeliveryMen = () => {
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password:""
  });

  const fetchDeliveryMen = async () => {
    try {
      const res = await API.get("/");
      setDeliveryMen(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    try {
      await API.post("/admin/delivery-men", formData);
      fetchDeliveryMen();
      setOpenDialog(false);
      setFormData({ name: "", email: "", phone: "",password:"" });
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add delivery man");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/delivery-men/${id}`);
      fetchDeliveryMen();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  useEffect(() => {
    fetchDeliveryMen();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
        Manage Delivery Men
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setOpenDialog(true)}
      >
        Add Delivery Man
      </Button>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Available</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deliveryMen.map((man, index) => (
                  <TableRow key={man._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{man.name}</TableCell>
                    <TableCell>{man.email}</TableCell>
                    <TableCell>{man.phone}</TableCell>
                    <TableCell>
                      {man.isAvailable ? "✅ Available" : "❌ Busy"}
                    </TableCell>
                    <TableCell>
                      {new Date(man.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(man._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Delivery Man Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Delivery Man</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="dense"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextField
            label="Phone"
            fullWidth
            margin="dense"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <TextField
            label="Password"
            fullWidth
            margin="dense"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageDeliveryMen;
