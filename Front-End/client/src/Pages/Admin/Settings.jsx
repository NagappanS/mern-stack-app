import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Card, CardContent, Grid } from "@mui/material";
import API from "../../api/API";
import { useNavigate } from "react-router-dom";

export default function Settings({onLogout}) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/admin/admins"); // your backend route to get current user
        setProfile({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await API.patch("/auth/update-profile", profile);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const handleLogout = () => {
    onLogout(); // call App's handleLogout
    navigate("/login", { replace: true });
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h5" sx = {{fontWeight:"bold",flexGrow: 1}}gutterBottom>⚙️ Settings</Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Profile</Typography>
              <TextField
                label="Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled // usually email shouldn't be editable
              />
              <TextField
                label="Phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ mt: 2 }}>
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences / Logout */}
        <Grid item xs={12} md={6}>
          <Card sx={{ textAlign: "center", py: 5 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Preferences</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {profile.name}
                You can customize your settings here.
              </Typography>
              <Button variant="outlined" color="error" onClick={handleLogout}>
                🚪 Log Out
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
