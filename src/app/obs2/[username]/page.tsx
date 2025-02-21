import { Metadata } from 'next';
import { userData } from '@/config/users';
import OBSTracker2 from '@/components/OBSTracker2';
import OBSLayout from '@/components/OBSLayout';

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const user = userData[resolvedParams.username];
  
  if (!user) return { title: 'User Not Found' };

  return {
    title: `${user.username}'s Solana Tracker OBS Overlay`,
    description: `Track ${user.username}'s Solana wallet balance and PnL in real-time`,
  };
}

export default async function OBSPage({ params }: PageProps) {
  const resolvedParams = await params;
  const user = userData[resolvedParams.username];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-transparent text-red-500 font-mono">
        <div className="text-2xl">User not found</div>
      </div>
    );
  }

  return (
    <OBSLayout>
      <OBSTracker2 user={user} />
    </OBSLayout>
  );
}

export function generateStaticParams(): Array<{ username: string }> {
  return Object.keys(userData).map((username) => ({
    username,
  }));
} 