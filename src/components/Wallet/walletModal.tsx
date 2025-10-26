import React, { useState, useEffect } from "react";
import { useWallet } from "../../context/walletContext";
import WalletOption from "./walletOption";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MessageType = "info" | "error" | "success";

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { connect, disconnect, account, isConnecting, error } = useWallet();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>("info");
  const [connectedWalletName, setConnectedWalletName] = useState<string | null>(null);
  const [showInstallLink, setShowInstallLink] = useState(false);

  // ✅ Detect MetaMask presence
  const isMetaMaskInstalled =
    typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;

  // ✅ Wallet list (MetaMask + Sample Wallet)
  const wallets = [
    {
      name: "MetaMask",
      icon: "/metamask-icon.svg",
      handler: async (walletName: string) => {
        if (isMetaMaskInstalled) {
          try {
            setMessage(`Connecting to ${walletName}...`);
            setMessageType("info");
            setShowInstallLink(false);

            await connect("MetaMask");
            setConnectedWalletName(walletName);
            setMessage(null);
          } catch {
            // This catch is handled by context, so we do nothing here
          }
        } else {
          setMessage("MetaMask not found. Please install it to continue.");
          setMessageType("error");
          setShowInstallLink(true);
        }
      },
    },
    {
      name: "Sample Wallet",
      icon: "/walletconnect-icon.svg",
      handler: (walletName: string) => {
        setMessage(`Configuration is not available for ${walletName}.`);
        setMessageType("error");
        setShowInstallLink(false);
      },
    },
  ];

  // ✅ Sync context error to modal message
  useEffect(() => {
    if (error) {
      setMessage(error);
      setMessageType("error");
      setShowInstallLink(false);
    }
  }, [error]);

  // ✅ Reset modal when closing
  const handleClose = () => {
    setMessage(null);
    setMessageType("info");
    setShowInstallLink(false);
    onClose();
  };

  // ✅ Disconnect wallet
  const handleDisconnect = () => {
    disconnect();
    setConnectedWalletName(null);
    setMessage("Wallet disconnected successfully.");
    setMessageType("success");
    setTimeout(() => setMessage(null), 2000);
  };

  // ✅ Clear message when reopened
  useEffect(() => {
    if (isOpen) {
      setMessage(null);
      setMessageType("info");
      setShowInstallLink(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const messageColor =
    messageType === "error"
      ? "text-red-600"
      : messageType === "success"
      ? "text-green-600"
      : "text-indigo-700";

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96 relative">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-2">
          {account ? "Wallet Details" : "Select Wallet"}
        </h2>

        {/* ✅ Message + Optional Link */}
        <div className="min-h-[36px] mb-3 flex flex-col items-center text-center">
          {message && <p className={`text-sm mb-1 ${messageColor}`}>{message}</p>}
          {showInstallLink && (
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 text-sm font-semibold hover:underline"
            >
              Install MetaMask
            </a>
          )}
        </div>

        {/* ✅ Wallet list (only if not connected) */}
        {!account && (
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <WalletOption
                key={wallet.name}
                name={wallet.name}
                icon={wallet.icon}
                onSelect={() => wallet.handler(wallet.name)}
                disabled={isConnecting}
              />
            ))}
          </div>
        )}

        {/* ✅ Connected wallet details */}
        {account && (
          <div className="text-center mt-3">
            <p className="text-gray-700 mb-1">
              Connected Wallet:
              <span className="font-semibold ml-1 text-indigo-600">
                {connectedWalletName ?? "Unknown"}
              </span>
            </p>
            <p className="font-mono text-sm bg-gray-100 rounded-md p-2 inline-block">
              {account}
            </p>
            <button
              onClick={handleDisconnect}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
            >
              Disconnect
            </button>
          </div>
        )}

        {/* ✅ Close Button */}
        <button
          onClick={handleClose}
          className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WalletModal;
