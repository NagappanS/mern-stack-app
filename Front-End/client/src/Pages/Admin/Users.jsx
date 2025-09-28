import { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, MenuItem, Select, InputLabel, FormControl, Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import API from "../../api/API";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "user", status: "active", password: "" });

  // Fetch users from DB
  const fetchUsers = async () => {
    try {
    // Use params option in axios instead of manual string concatenation
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (filterRole) params.role = filterRole;

    const res = await API.get("/admin/users", { params });
    setUsers(res.data);
  } catch (err) {
    console.error("Error fetching users:", err.response?.data || err.message);
  }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterStatus, filterRole]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    await API.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  const handleStatusToggle = async (user) => {
    const newStatus = user.status === "active" ? "blocked" : "active";
    await API.patch(`/admin/users/${user._id}/status`, { status: newStatus });
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ ...user, password: "" });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", phone: "", role: "user", status: "active", password: "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await API.put(`/admin/users/${editingUser._id}`, form);
      } else {
        await API.post("/admin/users", form);
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving user");
    }
  };

  // MUI DataGrid columns
  const columns = [
    { field: "id", headerName: "S.No", width: 80 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 130 },
    { field: "role", headerName: "Role", width: 130 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <Box>
          <Button variant="contained" size="small" onClick={() => handleEdit(params.row)} sx={{ mr: 1 }}>Edit</Button>
          <Button variant="outlined" size="small" color={params.row.status === "active" ? "error" : "success"} onClick={() => handleStatusToggle(params.row)} sx={{ mr: 1 }}>
            {params.row.status === "active" ? "Block" : "Unblock"}
          </Button>
          <Button variant="contained" size="small" color="error" onClick={() => handleDelete(params.row._id)}>Delete</Button>
        </Box>
      )
    }
  ];

  // Map users to rows
  const rows = users.map((u, index) => ({ id: index + 1, ...u }));

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }} gutterBottom>Manage Users</Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} label="Status" sx={{ width: 150 }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Role</InputLabel>
          <Select value={filterRole} onChange={e => setFilterRole(e.target.value)} label="Role" sx={{ width: 150 }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="restaurant">Restaurant</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="delivery">Delivery</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleAdd}>➕ Add User</Button>
      </Box>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
      </div>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <TextField label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <TextField label="Phone" value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} />
          {!editingUser && <TextField label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />}
          <FormControl>
            <InputLabel>Role</InputLabel>
            <Select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="restaurant">Restaurant</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="delivery">Delivery</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
