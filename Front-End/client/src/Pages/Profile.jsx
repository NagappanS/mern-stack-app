import { useEffect, useState } from "react";
import { TextField, Button, IconButton, MenuItem } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import API from "../api/API";

const Profile = () => {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Fetch user details from your backend
    API.get("/admin/users") // replace with your endpoint
      .then(res => {
        setUser(res.data);
        setFormData(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    axios.put(`/api/users/${user._id}`, formData)
      .then(res => {
        setUser(res.data);
        setEditMode(false);
      })
      .catch(err => console.log(err));
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", fontFamily: "Arial" }}>
      <div style={{ 
        background: "#9EEAEF", 
        borderRadius: "0 0 50% 50%", 
        height: 150, 
        position: "relative", 
        textAlign: "center"
      }}>
        {editMode && (
          <IconButton 
            onClick={() => setEditMode(false)} 
            style={{ position: "absolute", left: 10, top: 10 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <img 
          src={"../assets/male.png"} 
          alt="Profile" 
          style={{ 
            width: 100, 
            height: 100, 
            borderRadius: "50%", 
            marginTop: 30,
            border: "3px solid white"
          }} 
        />
        {!editMode && (
          <IconButton 
            onClick={() => setEditMode(true)} 
            style={{ position: "absolute", right: 10, top: 10 }}
          >
            <EditIcon />
          </IconButton>
        )}
      </div>

      {!editMode ? (
        <div style={{ padding: 20 }}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Status:</strong> {user.status || "-"}</p>
          <p><strong>Phone no.:</strong> {user.phone || "-"}</p>
          <p><strong>E-Mail:</strong> {user.email}</p>
        </div>
      ) : (
        <div style={{ padding: 20 }}>
          <TextField 
            label="Name" 
            name="name"
            fullWidth 
            margin="normal" 
            value={formData.name || ""} 
            onChange={handleChange} 
          />
          <TextField 
            label="Phone no." 
            name="phone"
            fullWidth 
            margin="normal" 
            value={formData.phone || ""} 
            onChange={handleChange} 
          />
          <TextField 
            label="E-Mail" 
            name="email"
            fullWidth 
            margin="normal" 
            value={formData.email || ""} 
            onChange={handleChange} 
          />
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            onClick={handleSave}
            style={{ marginTop: 20 }}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
