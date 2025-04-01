import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <Spinner size="large" />
    </div>
  );
}
