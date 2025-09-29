import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import API from "../../api/API";

const Foods = () => {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit,setEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    restaurant: "",
    imageFile: null, // store file here
  });

  useEffect(() => {
    fetchFoods();
    fetchRestaurants();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await API.get("/foods");
      setFoods(res.data.filter(f => f != null));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const res = await API.get("/restaurants");
      setRestaurants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFood = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("restaurant", formData.restaurant);
      if (formData.imageFile) data.append("image", formData.imageFile);

      if (formData._id) {
      // EDIT existing food
      await API.put(`/foods/${formData._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } 
      else {
      await API.post("/foods", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
        }

      fetchFoods();
      setOpen(false);
      setFormData({ name: "", price: "", description: "", restaurant: "", imageFile: null });
    } catch (err) {
      console.error(err);
    }
  };

    const handleEdit = (food) => {
    setFormData({
        name: food.name,
        price: food.price,
        description: food.description,
        restaurant: food.restaurant?._id || food.restaurant,
        imageFile: null, // reset or handle if editing image
        _id: food._id,
    });
    setOpen(true);
    };
    
  const handleDelete = async (id) => {
    try {
      await API.delete(`/foods/${id}`);
      fetchFoods();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { field: "name", headerName: "Name", width: 180 },
    { field: "price", headerName: "Price", width: 120 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "restaurant", headerName: "Restaurant", width: 180, renderCell: (params) => params?.row?.restaurant?.name || "N/A" },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      renderCell: (params) =>
        params?.row?.image ? (
          <img
            src={`http://localhost:5000/uploads/${params.row.image}`}
            alt={params.row.name}
            style={{ width: 100, height: 70, objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          "No Image"
        ),
    },
            {
        field: "actions",
        headerName: "Actions",
        width: 200,
        renderCell: (params) => (
            <>
            <Button
                color="primary"
                variant="contained"
                sx={{ mr: 1 }}
                onClick={() => handleEdit(params.row)}
            >
            <EditIcon/>
            </Button>
            <Button
                color="error"
                variant="contained"
                onClick={() => handleDelete(params.row._id)}
            >
            <DeleteIcon/>
            </Button>
            </>
        ),
        },
  ];

  return (
    <Container>
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }} gutterBottom>
            Manage Foods
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
            ➕ Add Food
          </Button>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid rows={foods} columns={columns} getRowId={(row) => row._id} pageSize={5} rowsPerPageOptions={[5, 10]} />
          </div>
        </CardContent>
      </Card>

      {/* Add Food Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add Food</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Name" fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <TextField margin="dense" label="Price" type="number" fullWidth value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
          <TextField margin="dense" label="Description" fullWidth value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <TextField select margin="dense" label="Restaurant" fullWidth value={formData.restaurant} onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}>
            {restaurants.map((r) => (
              <MenuItem key={r._id} value={r._id}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Upload Image
            <input type="file" hidden accept="image/*" onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })} />
          </Button>
          {formData.imageFile && (
                <div style={{ marginTop: "8px" }}>
                    <Typography variant="body2">{formData.imageFile.name}</Typography>
                    <img
                    src={URL.createObjectURL(formData.imageFile)}
                    alt="preview"
                    style={{ width: "120px", height: "80px", objectFit: "cover", marginTop: "4px", borderRadius: "6px" }}
                    />
                </div>
                )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddFood} variant="contained" color="primary">
            {formData._id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Foods;
