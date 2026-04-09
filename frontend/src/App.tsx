import { useState } from "react";
import "./index.css";
import "./App.css";
import { BookingProvider } from "./context/BookingContext";
import { AuthProvider } from "./context/AuthContext";
import AuthModal from "./components/AuthModal";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoryFilter from "./components/CategoryFilter";
import TopPicks from "./components/TopPicks";
import TrustIndicators from "./components/TrustIndicators";
import DriverPackages from "./components/DriverPackages";
import AllActivities from "./components/AllActivities";
import AirportTransfer from "./components/AirportTransfer";
import PopularDestinations from "./components/PopularDestinations";
import TravelGuide from "./components/TravelGuide";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import BookingModal from "./components/BookingModal";

function App() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <AuthProvider>
    <BookingProvider>
      <div className="min-h-screen bg-white font-sans">
        <Navbar />
        <Hero />
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        <TopPicks />
        <TrustIndicators />
        <DriverPackages />
        <AirportTransfer />
        <AllActivities activeCategory={activeCategory} />
        <PopularDestinations />
        <TravelGuide />
        <Footer />
        <WhatsAppButton />
        <BookingModal />
        <AuthModal />
      </div>
    </BookingProvider>
    </AuthProvider>
  );
}

export default App;
