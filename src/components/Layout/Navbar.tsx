import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Wallet } from "lucide-react";
import { useWallet } from "../../context/walletContext";
import WalletModal from "../Wallet/walletModal";

export const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const { account } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`flex items-center ${
                  isActive("/") ? "text-indigo-600" : "text-gray-700"
                } hover:text-indigo-600`}
              >
                <Home className="w-5 h-5 mr-1" /> Home
              </Link>
              <Link
                to="/dashboard"
                className={`flex items-center ${
                  isActive("/dashboard") ? "text-indigo-600" : "text-gray-700"
                } hover:text-indigo-600`}
              >
                <Search className="w-5 h-5 mr-1" /> Dashboard
              </Link>
            </div>

            {/* Connect Wallet Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Wallet className="w-4 h-4" />
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
            </button>
          </div>
        </div>
      </nav>

      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
