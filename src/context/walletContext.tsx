import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WalletContextType {
  account: string | null;
  connect: (provider: string) => Promise<void>;
  disconnect: () => void;
  error: string | null;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async (provider: string) => {
    try {
      setIsConnecting(true);
      setError(null);

      if (provider === "MetaMask") {
        if (!window.ethereum) {
          setError("MetaMask not found. Please install it from https://metamask.io/");
          return;
        }

        const accounts = (await window.ethereum.request({
          method: "eth_requestAccounts",
        })) as string[];

        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          localStorage.setItem("connectedWallet", provider);
        }
      } else {
        setError("Unsupported wallet (MetaMask only for now)");
      }
    } catch (err: any) {
      if (err.code === 4001) setError("User rejected connection request.");
      else setError("Failed to connect wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    localStorage.removeItem("connectedWallet");
    setError(null);
  };

  // ✅ Listen for MetaMask account changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        disconnect();
      } else {
        setAccount(accounts[0]);
      }
    };

    if (window.ethereum?.on) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  // ✅ Auto reconnect on reload
  useEffect(() => {
    const lastConnected = localStorage.getItem("connectedWallet");
    if (lastConnected === "MetaMask" && window.ethereum?.selectedAddress) {
      setAccount(window.ethereum.selectedAddress);
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{ account, connect, disconnect, error, isConnecting }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
};
