'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import counterJson from '../public/abis/Counter.json';
import { toast } from 'sonner';

const contractAddresses: { [key: string]: string } = {
  Counter: process.env.NEXT_PUBLIC_COUNTER_CONTRACT_ADDRESS || '',
};

const contractABIs: { [key: string]: ethers.Interface } = {
  Counter: new ethers.Interface(counterJson.abi),
};

interface ContractsContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  account: string;
  contracts: { [key: string]: ethers.Contract };
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const ContractsContext = createContext<ContractsContextType | undefined>(
  undefined
);

export const useContracts = () => {
  const context = useContext(ContractsContext);
  if (!context) {
    throw new Error('useContracts must be used within a ContractsProvider');
  }
  return context;
};

export const ContractsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState('');
  const [contracts, setContracts] = useState<{
    [key: string]: ethers.Contract;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setIsLoading(true);

      if (!window.ethereum) {
        return alert(
          'Please install an Ethereum wallet like MetaMask Wallet to use this app.'
        );
      }

      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);

      if (!newProvider) {
        console.error('Provider is not initialized');
        return;
      }

      window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const newSigner = await newProvider.getSigner();
      setSigner(newSigner);

      newSigner.getAddress().then((address) => {
        setAccount(address);
        localStorage.setItem('isWalletConnected', 'true');
      });

      router.push('/');
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      toast.error('Error connecting to wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setSigner(null);
    setProvider(null);

    localStorage.removeItem('isWalletConnected');

    router.push('/login');
  };

  const createContracts = () => {
    if (!provider || !signer) return;

    try {
      setIsLoading(true);
      const newContracts: { [key: string]: ethers.Contract } = {};
      Object.keys(contractAddresses).forEach((contractName) => {
        newContracts[contractName] = new ethers.Contract(
          contractAddresses[contractName],
          contractABIs[contractName],
          signer
        );
      });
      setContracts(newContracts);
    } catch (error) {
      console.error('Error creating contracts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        localStorage.removeItem('isWalletConnected');
        setAccount('');
        setSigner(null);
        setProvider(null);
      } else {
        setAccount(accounts[0]);
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  useEffect(() => {
    const reconnectWallet = async () => {
      const isWalletConnected = localStorage.getItem('isWalletConnected');
      if (isWalletConnected === 'true') {
        await connectWallet();
      }
    };
    reconnectWallet();
  }, []);

  useEffect(() => {
    createContracts();
  }, [provider, signer]);

  return (
    <ContractsContext.Provider
      value={{
        provider,
        signer,
        account: account,
        contracts,
        isLoading,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </ContractsContext.Provider>
  );
};
