// src/pages/admin/ManageRestaurants.jsx
import { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, IconButton, Stack, Avatar, Snackbar, Alert
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import API from "../../api/API"; // your axios instance

export default function RestaurantsAdmin() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", location: "", image: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  const baseUploadsUrl = API.defaults.baseURL ? `${API.defaults.baseURL}/uploads` : "/uploads";

  const showSnack = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await API.get("/restaurants");
      setRestaurants(res.data);
    } catch (err) {
      console.error(err);
      showSnack("Failed to load restaurants", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleOpenAdd = () => {
    setEditing(null);
    setForm({ name: "", location: "", image: "" });
    setFile(null);
    setPreview("");
    setOpen(true);
  };

  const handleEdit = (row) => {
    setEditing(row);
    setForm({ name: row.name || "", location: row.location || "", image: row.image || "" });
    setPreview(row.image ? (row.image.startsWith("http") ? row.image : `http://localhost:5000/uploads/${row.image}`) : "");
    setFile(null);
    setOpen(true);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const uploadFile = async (fileToUpload) => {
    const fd = new FormData();
    fd.append("image", fileToUpload);
    const res = await API.post("/restaurants/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    // res.data: { filename, url }
    return res.data.filename;
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let imageToSave = form.image || "";

      // if a new file was selected → upload it first
      if (file) {
        imageToSave = await uploadFile(file);
      }

      const payload = { name: form.name, location: form.location, image: imageToSave };

      if (editing) {
        await API.put(`/restaurants/${editing._id}`, payload);
        showSnack("Restaurant updated");
      } else {
        await API.post("/restaurants", payload);
        showSnack("Restaurant added");
      }
      setOpen(false);
      fetchRestaurants();
    } catch (err) {
      console.error(err);
      showSnack(err.response?.data?.message || "Save failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;
    try {
      await API.delete(`/restaurants/${id}`);
      showSnack("Restaurant deleted");
      fetchRestaurants();
    } catch (err) {
      console.error(err);
      showSnack("Delete failed", "error");
    }
  };

  const columns = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "location", headerName: "Location", flex: 1 },
  {
    field: "image",
    headerName: "Image",
    flex: 1,
    renderCell: (params) =>
      params.row.image ? (
        <img
          src={`http://localhost:5000/uploads/${params.row.image}`}
          alt={params.row.name}
          style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
        />
      ) : (
        "No Image"
      ),
  },
  {
    field: "createdAt",
    headerName: "Created At",
    flex: 1,
    renderCell: (params) =>
      params.row?.createdAt
        ? new Date(params.row.createdAt).toLocaleDateString()
        : "N/A",
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    renderCell: (params) => (
      <>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleEdit(params.row)}
        >
          <EditIcon/>
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleDelete(params.row._id)}
          style={{ marginLeft: 8 }}
        >
          <DeleteIcon/>
        </Button>
      </>
    ),
  },
];

  // map restaurants to rows; DataGrid expects `id` field
  const rows = restaurants.map((r) => ({ id: r._id, ...r }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }} gutterBottom>Manage Restaurants</Typography>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" onClick={handleOpenAdd}>➕ Add Restaurant</Button>
      </Box>

      <div style={{ height: 520, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25]}
          loading={loading}
          getRowId={(row) => row.id}
        />
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Edit Restaurant" : "Add Restaurant"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <TextField label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          <Box>
            <input
              accept="image/*"
              id="restaurant-image-input"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="restaurant-image-input">
              <Button variant="outlined" component="span" startIcon={<UploadFileIcon />}>
                {file ? "Change Image" : "Upload Image"}
              </Button>
            </label>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Or keep the existing image (if editing).
            </Typography>
            {preview ? (
              <Box sx={{ mt: 1 }}>
                <img src={preview} alt="preview" style={{ maxWidth: 200, maxHeight: 150, borderRadius: 6 }} />
              </Box>
            ) : form.image ? (
              <Box sx={{ mt: 1 }}>
                <img
                  src={form.image.startsWith("http") ? form.image : `${baseUploadsUrl}/${form.image}`}
                  alt="current"
                  style={{ maxWidth: 200, maxHeight: 150, borderRadius: 6 }}
                />
              </Box>
            ) : null}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
