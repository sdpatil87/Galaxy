import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Toaster } from "react-hot-toast";

export default function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="app-container">{children}</main>
      <Toaster position="top-right" />
      <Footer />
    </div>
  );
}
