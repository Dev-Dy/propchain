interface EthereumProvider {
  isMetaMask?: boolean;

  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;


  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;

  selectedAddress?: string;
  chainId?: string;
}

interface Window {
  ethereum?: EthereumProvider;
}
