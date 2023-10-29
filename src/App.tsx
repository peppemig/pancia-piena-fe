import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/navbar/Navbar";
import Register from "./pages/Register";
import { ThemeProvider } from "./components/ThemeProvider";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebaseConfig";
import { Toaster } from "@/components/ui/toaster";
import LoadingState from "./components/LoadingState";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import CreateOrder from "./pages/CreateOrder";
import CreateProduct from "./pages/CreateProduct";

function App() {
  const [user, loading] = useAuthState(auth);
  //console.log("LOADING: " + loading);
  //console.log("USER: " + JSON.stringify(user));

  if (loading) {
    return <LoadingState />;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Toaster />
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="products">
            <Route path="list" element={<Products user={user} />} />
            <Route path="create" element={<CreateProduct user={user} />} />
          </Route>
          <Route path="orders">
            <Route path="list" element={<Orders user={user} />} />
            <Route path="create" element={<CreateOrder user={user} />} />
          </Route>
          <Route path="dashboard" element={<Dashboard user={user} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
