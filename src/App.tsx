import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/navbar/Navbar";
import Register from "./pages/Register";
import { Toaster } from "@/components/ui/toaster";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import CreateOrder from "./pages/CreateOrder";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="products">
          <Route
            path="list"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="orders">
          <Route
            path="list"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="create"
            element={
              <ProtectedRoute>
                <CreateOrder />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
