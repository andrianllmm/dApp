'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useContracts } from '@/context/ContractsProvider';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';

export function LoginForm() {
  const router = useRouter();

  const { account } = useContracts();

  useEffect(() => {
    if (account) {
      router.push('/');
    }
  }, [account, router]);

  return (
    <div className="w-full h-full flex items-center justify-center gap-4">
      <WalletConnectButton />
    </div>
  );
}
