import { useState, useEffect } from "react";
import "./style.scss";
import Home from "./pages/Home";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Detail from "./pages/Detail";
import AddEditData from "./pages/AddEditData";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import TagData from "./pages/TagData";
import CategoryData from "./pages/CategoryData";
import ScrollToTop from "./components/ScrollToTop";
import Data from "./pages/Data";
import Approval from "./pages/Approval";
import PublisherData from "./pages/PublisherData";
import Search from "./components/Search";

function App() {
  const [active, setActive] = useState("home");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setActive("login");
      navigate("/auth");
    });
  };

  return (
    <div className="App">
      <Navbar
        setActive={setActive}
        active={active}
        user={user}
        handleLogout={handleLogout}
      />
      <ScrollToTop />
      <ToastContainer position="top-center" />
      <Routes>
        <Route
          path="/"
          element={<Home setActive={setActive} active={active} user={user} />}
        />
        <Route
          path="/search"
          element={<Home setActive={setActive} user={user} />}
        />
        <Route
          path="/detail/:id"
          element={<Detail setActive={setActive} user={user} />}
        />
        <Route
          path="/create"
          element={
            user?.uid ? <AddEditData user={user} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/update/:id"
          element={
            user?.uid ? (
              <AddEditData user={user} setActive={setActive} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/Data" element={<Data setActive={setActive} />} />
        <Route path="/tag/:tag" element={<TagData setActive={setActive} />} />
        <Route
          path="/category/:category"
          element={<CategoryData setActive={setActive} />}
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/auth"
          element={<Auth setActive={setActive} setUser={setUser} />}
        />
        <Route path="*" element={<NotFound />} />
        <Route path="/approval" element={<Approval setActive={setActive} />} />
        <Route
          path="/author/:author"
          element={<PublisherData setActive={setActive} />}
        />
      </Routes>
    </div>
  );
}

export default App;
