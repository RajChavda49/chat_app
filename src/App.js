import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Auth from "./Pages/Auth";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Suspense, useEffect } from "react";
import Home from "./Pages/Home";
import ErrorFallback from "./Components/ErrorFallback";
import PrivateRoute from "./Pages/PrivateRoute";
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          window.location.reload();
        }}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-screen h-screen">
              Loading...
            </div>
          }
        >
          <Toaster />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
