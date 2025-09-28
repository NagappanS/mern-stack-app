import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import API from "../../api/API";

const ManageAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await API.get("/admin/admins"); // backend route to fetch admins
      setAdmins(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    try {
      await API.post("/admin/add-admin", form);
      setOpen(false);
      setForm({ name: "", email: "", password: "", phone: "" });
      fetchAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/delete-admin/${id}`);
      fetchAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <Button color="error" onClick={() => handleDelete(params.row._id)}>
          Delete
        </Button>
      ),
      flex: 1,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Manage Admins
      </Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add Admin
      </Button>

      <Box mt={2} sx={{ height: 400 }}>
        <DataGrid
          rows={admins}
          getRowId={(row) => row._id}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>

      {/* Add Admin Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Admin</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            label="Phone"
            name="phone"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageAdmin;
