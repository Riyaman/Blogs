import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Footer, Header } from "./components/index";
import { Outlet } from "react-router-dom";
import LoadingScreen from "./pages/LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [dispatch]);
  
  if (loading) return <LoadingScreen label="Restoring your session…" />;

  return <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300"><Header /><main className="flex-1"><Outlet /></main><Footer /></div>;
}

export default App
