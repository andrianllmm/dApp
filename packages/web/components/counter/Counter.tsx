'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useContracts } from '@/context/ContractsProvider';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '../ui/spinner';
import { CircleHelp, PlusIcon } from 'lucide-react';

export function Counter() {
  const router = useRouter();
  const { contracts, account, provider } = useContracts();
  const { Counter: counterContract } = contracts;

  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pendingTx, setPendingTx] = useState<string | null>(null);

  useEffect(() => {
    if (!account) {
      router.push('/login');
      return;
    }

    const fetchCount = async () => {
      if (counterContract) {
        setIsLoading(true);
        try {
          const currentCount = parseInt(
            (await counterContract.getCount()).toString()
          );
          setCount(currentCount);
        } catch (error) {
          console.error('Error fetching count:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error('Counter contract is not initialized.');
      }
    };

    if (counterContract) {
      fetchCount();
      counterContract.on('CountChanged', (newCount) => {
        setCount(newCount);
      });
    }

    return () => {
      if (counterContract) {
        counterContract.off('CountChanged');
      }
    };
  }, [account, counterContract, router]);

  const handleIncrement = async () => {
    if (isLoading || !counterContract || !provider) return;
    toast.info('Please confirm the transaction request.');
    setIsLoading(true);
    try {
      const tx = await counterContract.increment();
      setPendingTx(tx.hash);
      await tx.wait();
    } catch (error) {
      toast.error('Failed to increment count');
      console.error('Error incrementing count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPendingTransaction = useCallback(async () => {
    if (pendingTx && provider) {
      const tx = await provider.getTransaction(pendingTx);
      if (tx && !tx.blockNumber) {
        toast.info('Transaction is still pending...');
      } else {
        setPendingTx(null);
        toast.success('Incremented count successfully');
      }
    }
  }, [pendingTx, provider]);

  useEffect(() => {
    const intervalId = setInterval(checkPendingTransaction, 5000);
    return () => clearInterval(intervalId);
  }, [checkPendingTransaction]);

  if (!account) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      {/* Count */}
      <h1 className="text-6xl font-bold">
        {count === null ? <Spinner /> : count}
      </h1>

      {/* Increment button */}
      <Button
        size="icon"
        className="rounded-full"
        onClick={handleIncrement}
        disabled={isLoading || pendingTx !== null}
      >
        {isLoading || pendingTx ? (
          <Spinner size="small" className="text-inherit" />
        ) : (
          <PlusIcon />
        )}
      </Button>

      {/* Help text */}
      <p className="mt-5 flex gap-1 items-center text-xs text-muted-foreground">
        <CircleHelp size={12} /> Click the button to increment the number
      </p>
    </div>
  );
}
