import { useContracts } from '@/context/ContractsProvider';
import { LoadingButton } from '../ui/loading-button';

export function WalletConnectButton() {
  const { account, connectWallet, disconnectWallet, isLoading } =
    useContracts();

  return (
    <>
      {account ? (
        <LoadingButton
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
          loading={isLoading}
        >
          Disconnect {account.slice(0, 12)}...
        </LoadingButton>
      ) : (
        <LoadingButton
          variant="outline"
          size="sm"
          onClick={async () => connectWallet()}
          loading={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </LoadingButton>
      )}
    </>
  );
}
