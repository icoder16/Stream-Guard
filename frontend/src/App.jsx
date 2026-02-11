import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Player from "./pages/Player";
import Members from "./pages/Members";

import {
  PrivateRoute,
  PublicRoute
} from "./routes/ProtectedRoutes";

function App() {
  return (
    <>

    <Toaster position="top-center" />

    <Routes>

      {/* Public Routes (Only if NOT logged in) */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Private Routes (Only if logged in) */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <Upload />
          </PrivateRoute>
        }
      />

      <Route
        path="/player/:id"
        element={
          <PrivateRoute>
            <Player />
          </PrivateRoute>
        }
      />

      <Route
        path="/members"
        element={
          <PrivateRoute>
            <Members />
          </PrivateRoute>
        }
      />

    </Routes>
    </>
  );
}

export default App;
