import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/navbar/Navbar";
import Register from "./pages/Register";
import { ThemeProvider } from "./components/ThemeProvider";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebaseConfig";
import LoadingState from "./components/LoadingState";
import Products from "./pages/Products";

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
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products user={user} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
