import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import LandingPage from "./pages/LandingPage";
import WizardPage from "./pages/WizardPage";
import NotFoundPage from "./pages/NotFoundPage"; // Create this simple 404 page
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import ConfirmationPage from "./pages/ConfirmationPage";


// Scroll restoration on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Shared layout that conditionally renders Header/Footer
function Layout() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="min-h-screen flex flex-col bg-primaryGray text-primaryText">
        {isLanding && <Header />}
        <main className="flex-grow">
          <Outlet />
        </main>
        {isLanding && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Layout for main routes */}
        <Route element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="wizard" element={<WizardPage />} />
          <Route path="confirmation" element={<ConfirmationPage />} />
        </Route>

        {/* 404 fallback route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
