'use client';

import Link from 'next/link';
import { WalletConnectButton } from '../wallet/WalletConnectButton';
import { ThemeToggle } from './ThemeToggle';

export function SiteHeader() {
  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex h-[var(--header-height)] w-full items-center justify-between gap-2 px-8">
        <div>
          <Link href="/" className="text-2xl font-bold">
            dApp
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <WalletConnectButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
