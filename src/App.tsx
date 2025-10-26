import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { HomePage } from './pages/HomePage';
import { ListingsPage } from './pages/ListingsPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { DashboardPage } from './pages/DashboardPage';
import { WalletProvider } from './context/walletContext'; // ✅ ensure file name matches exactly

// ✅ Handles all routing logic inside Router
const AppContent: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [favorites, setFavorites] = useState(['1', '4']);
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    // This can later trigger WalletModal or MetaMask logic
    setWalletConnected(true);
  };

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <>
      {/* ✅ Navbar at top of all pages */}
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          }
        />
        <Route
          path="/listings"
          element={
            <ListingsPage
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          }
        />
        <Route
          path="/property/:id"
          element={<PropertyDetailPage onToggleFavorite={handleToggleFavorite} />}
        />
        <Route
          path="/favorites"
          element={
            <FavoritesPage
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <DashboardPage
              walletConnected={walletConnected}
              onConnectWallet={handleConnectWallet}
            />
          }
        />
      </Routes>
    </>
  );
};

// ✅ Main App wrapper — contains WalletProvider & Router
function App() {
  return (
    <WalletProvider>
      <Router>
        <AppContent />
      </Router>
    </WalletProvider>
  );
}

export default App;
