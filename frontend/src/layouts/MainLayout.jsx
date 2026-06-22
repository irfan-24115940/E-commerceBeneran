import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--surface-2)" }}>
      {/* HEADER */}
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="flex-1 px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default MainLayout;