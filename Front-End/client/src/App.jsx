// import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Restaurants from "./Pages/Restaurants";
import RestaurantMenu from "./Pages/RestaurantMenu";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/CheckOut";
import Orders from "./Pages/Orders";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Layout from "./Pages/LayOut";
import ProtectedRoute from "./components/ProtectedRoute";


import AdminLayout from "./Pages/Admin/AdminLayout";
import Dashboard from "./Pages/Admin/Dashboard";
import Users from "./Pages/Admin/Users";
import RestaurantsAdmin from "./Pages/Admin/RestaurantsAdmin";
import Foods from "./Pages/Admin/Foods";
import OrdersAdmin from "./Pages/Admin/OrdersAdmin";
import Reports from "./Pages/Admin/Reports";
import Settings from "./Pages/Admin/Settings";

function App() {
 const isLoggedIn = !!localStorage.getItem("token");
 const isAdmin = localStorage.getItem("role") === "admin";

  return (
     <Router>
      <Routes>
        {/* Default path */}
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to={isAdmin ? "/admin" : "/restaurants"} /> : <Navigate to="/login" />} 
        />

        {/* Auth */}
        <Route path="/login" element={isLoggedIn ? <Navigate to={isAdmin ? "/admin" : "/restaurants"} /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to={isAdmin ? "/admin" : "/restaurants"} /> : <Register />} />

        {/* User Protected routes */}
        <Route 
          path="/restaurants" 
          element={
            <ProtectedRoute>
              <Layout><Restaurants /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/restaurants/:id" 
          element={
            <ProtectedRoute>
              <Layout><RestaurantMenu /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Layout><Cart /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Layout><Checkout /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <Layout><Orders /></Layout>
            </ProtectedRoute>
          } 
        />

        {/* Admin Protected routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="restaurants" element={<RestaurantsAdmin />} />
          <Route path="foods" element={<Foods />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
