import { GaiaChat } from '@/components/features/gaia-chat';

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-theme(spacing.16))] p-4 md:p-6 lg:p-8">
      <GaiaChat />
    </div>
  );
}
