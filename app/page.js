"use client";

import { useState, useEffect } from 'react';
import { Shield, Loader, Wallet, BookOpen } from 'lucide-react';
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESSES, ARC_NETWORK, FACTORY_ABI } from '@/lib/contracts';
import { formatAddress } from '@/lib/utils';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [vaultAddress, setVaultAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const switchToArcNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARC_NETWORK.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [ARC_NETWORK],
        });
      } else {
        throw switchError;
      }
    }
  };

  const connectWallet = async () => {
  if (window.ethereum?.providers?.length) {
    const metaMaskProvider = window.ethereum.providers.find(
      (p) => p.isMetaMask && !p.isRabby
    );
    if (metaMaskProvider) {
      window.ethereum = metaMaskProvider;
    }
  }

  if (typeof window.ethereum === 'undefined') {
    showNotification('Please install MetaMask to use this dApp', 'error');
    return;
  }

  try {
    setIsLoading(true);
    
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }
      
      await switchToArcNetwork();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const ethersProvider = new BrowserProvider(window.ethereum);
      const ethersSigner = await ethersProvider.getSigner();
      
      setAccount(accounts[0]);
      setProvider(ethersProvider);
      setSigner(ethersSigner);
      
      showNotification('Wallet connected successfully!', 'success');
      await checkUserVault(accounts[0], ethersProvider);
    } catch (error) {
      console.error('Connect error:', error);
      showNotification('Failed to connect wallet: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserVault = async (userAccount, ethersProvider) => {
    try {
      const factoryContract = new Contract(
        CONTRACT_ADDRESSES.factory,
        FACTORY_ABI,
        ethersProvider
      );
      
      const vault = await factoryContract.vaultOf(userAccount);
      
      if (vault && vault !== '0x0000000000000000000000000000000000000000') {
        setVaultAddress(vault);
        showNotification('Vault found!', 'success');
      }
    } catch (error) {
      console.error('Error checking vault:', error);
    }
  };

  const createVault = async () => {
    if (!signer) {
      showNotification('Please connect wallet first', 'error');
      return;
    }

    try {
      setIsLoading(true);
      showNotification('Creating your vault...', 'info');
      
      const factoryContract = new Contract(
        CONTRACT_ADDRESSES.factory,
        FACTORY_ABI,
        signer
      );
      
      const tx = await factoryContract.createVault();
      showNotification('Transaction submitted. Waiting for confirmation...', 'info');
      
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(log => {
        try {
          const parsed = factoryContract.interface.parseLog(log);
          return parsed.name === 'VaultCreated';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = factoryContract.interface.parseLog(event);
        setVaultAddress(parsed.args.vault);
        showNotification('Vault created successfully!', 'success');
      } else {
        await checkUserVault(account, provider);
      }
    } catch (error) {
      console.error('Create vault error:', error);
      showNotification('Failed to create vault: ' + (error.reason || error.message), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          setVaultAddress(null);
          setProvider(null);
          setSigner(null);
        } else {
          setAccount(accounts[0]);
          if (provider) {
            checkUserVault(accounts[0], provider);
          }
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [provider]);

  if (account && vaultAddress) {
    return (
      <Dashboard
        account={account}
        vaultAddress={vaultAddress}
        provider={provider}
        signer={signer}
        onNotification={showNotification}
        onRefresh={() => checkUserVault(account, provider)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-20"></div>
      
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 ${
          notification.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-200' :
          notification.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-200' :
          'bg-blue-500/20 border-blue-500/50 text-blue-200'
        }`}>
          {notification.message}
        </div>
      )}

<nav className="relative z-10 px-6 py-6 flex justify-between items-center">
  <div className="flex items-center space-x-3">
    <Shield className="w-10 h-10 text-red-500" />
    <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
      Lokr
    </span>
  </div>
  
  <div className="flex items-center space-x-4">
    {account && (
      <div className="px-4 py-2 bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50">
        <span className="text-sm text-gray-400">Connected: </span>
        <span className="text-sm font-mono text-red-400">{formatAddress(account)}</span>
      </div>
    )}
    
    <a
      href="/docs"
      className="px-6 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 flex items-center space-x-2"
    >
      <BookOpen className="w-5 h-5 text-red-400" />
      <span className="font-semibold">Docs</span>
    </a>
  </div>
</nav>

<div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
  <div className="mb-8 relative">
    <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse"></div>
    <Shield className="w-24 h-24 text-red-500 relative z-10 animate-float" />
  </div>
        
  <h1 className="text-5xl md:text-7xl font-bold mb-6">
    <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text text-transparent">
      Secure Your USDC
    </span>
  </h1>
        
  <p className="text-xl text-gray-400 max-w-2xl mb-12">
    Create your personal vault on Arc Network with advanced security features. 
    Password protection, spending limits, and whitelist management.
  </p>

        {!account ? (
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl font-semibold text-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              <Wallet className="w-6 h-6 group-hover:scale-110 transition-transform" />
            )}
            <span>Connect Wallet to Start</span>
          </button>
        ) : !vaultAddress ? (
          <button
            onClick={createVault}
            disabled={isLoading}
            className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl font-semibold text-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              <Shield className="w-6 h-6 group-hover:scale-110 transition-transform" />
            )}
            <span>Create Your Vault</span>
          </button>
        ) : null}

        <div className="grid md:grid-cols-3 gap-4 mt-12 max-w-4xl">
          <div className="p-4 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 text-center">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-base font-bold mb-1">Password Protected</h3>
            <p className="text-sm text-gray-400">Secure your vault with a strong password.</p>
          </div>
          
          <div className="p-4 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-red-400/50 transition-all duration-300 text-center">
            <div className="w-10 h-10 bg-red-400/20 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <Wallet className="w-5 h-5 text-red-300" />
            </div>
            <h3 className="text-base font-bold mb-1">Spending Limits</h3>
            <p className="text-sm text-gray-400">Set daily and per-transaction limits.</p>
          </div>
          
          <div className="p-4 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 text-center">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-base font-bold mb-1">Whitelist Control</h3>
            <p className="text-sm text-gray-400">Only send to pre-approved addresses.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
