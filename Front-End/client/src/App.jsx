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

function App() {
 const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Default path */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/restaurants" /> : <Navigate to="/login" />} />

        {/* Auth */}
        <Route path="/login" element={isLoggedIn ? <Navigate to="/restaurants" /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/restaurants" /> : <Register />} />

        {/* Protected routes with layout */}
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

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
