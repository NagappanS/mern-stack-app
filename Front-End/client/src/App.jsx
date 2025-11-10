import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { NotificationProvider } from "./context/NotificationContext";

import Layout from "./Pages/LayOut";
import ProtectedRoute from "./components/ProtectedRoute";

import Restaurants from "./Pages/Restaurants";
import RestaurantMenu from "./Pages/RestaurantMenu";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/CheckOut";
import Orders from "./Pages/Orders";
import Profile from "./Pages/Profile";

import AdminLayout from "./Pages/Admin/AdminLayout";
import Dashboard from "./Pages/Admin/Dashboard";
import Users from "./Pages/Admin/Users";
import RestaurantsAdmin from "./Pages/Admin/RestaurantsAdmin";
import Foods from "./Pages/Admin/Foods";
import OrdersAdmin from "./Pages/Admin/OrdersAdmin";
import Reports from "./Pages/Admin/Reports";
import Settings from "./Pages/Admin/Settings";
import ManageAdmin from "./Pages/Admin/ManageAdmin";
import ManageDeliveryMen from "./Pages/Admin/ManageDeliveryMen";

import DeliveryLayout from "./Pages/Admin/DeliveryLayout";
import DeliveryOrders from "./Pages/Admin/DeliveryOrders";

import Login from "./Pages/Login";
import Register from "./Pages/Register";

function App() {
  // ✅ State-driven auth
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [name, setName] = useState(localStorage.getItem("name") || "");


  // Login updates state + localStorage
  const handleLogin = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    setToken(token);
    setRole(role);
    setName(name);
  };

  // Logout clears state + localStorage
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setToken(null);
    setRole(null);
    setName("");
  };

  const isLoggedIn = !!token;
  const isAdmin = role === "admin";

  return (
    <Router>
        <NotificationProvider>
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              isAdmin ? <Navigate to="/admin" replace /> : 
              (role === "delivery" ? <Navigate to ="/delivery" replace/> : (role === "user" ? <Navigate to="/restaurants" replace /> : <Navigate to="/login" replace />))
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to={isAdmin ? "/admin" : (role=="delivery" ? "/delivery" : "/restaurants")} replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate to={isAdmin ? "/admin" : "/restaurants"} replace />
            ) : (
              <Register />
            )
          }
        />

        {/* User routes */}
        <Route
          path="/restaurants"
          element={
            <ProtectedRoute token={token} roleRequired="user">
              <Layout onLogout={handleLogout} name={name}>
                <Restaurants />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurants/:id"
          element={
            <ProtectedRoute token={token} roleRequired="user">
              <Layout onLogout={handleLogout} name={name}>
                <RestaurantMenu />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute token={token} roleRequired="user">
              <Layout onLogout={handleLogout} name={name}>
                <Cart />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute token={token} roleRequired="user">
              <Layout onLogout={handleLogout} name={name}>
                <Checkout />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute token={token} roleRequired="user">
              <Layout onLogout={handleLogout} name={name}>
                <Orders />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute token={token} roleRequired="user">
              <Layout onLogout={handleLogout} name={name}>
                <Profile/>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute token={token} roleRequired="admin" adminOnly>
              <AdminLayout onLogout={handleLogout} name={name} role={role}/>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="restaurants" element={<RestaurantsAdmin />} />
          <Route path="foods" element={<Foods />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings onLogout={handleLogout}/>}/>
          <Route path="manage-admins" element={<ManageAdmin />} />
          <Route path="manage-deliverymen" element={<ManageDeliveryMen />} />
        </Route>
        
        {/* Delivery routes */}
        <Route
            path="/delivery/*"
            element={
              <ProtectedRoute token={token} roleRequired="delivery">
                <DeliveryLayout onLogout={handleLogout} name={name} />
              </ProtectedRoute>
            }
          >
            <Route index element={<DeliveryOrders />} />
         </Route>

      </Routes>
         </NotificationProvider>
    </Router>
  );
}

export default App;
