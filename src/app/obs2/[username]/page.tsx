import { Metadata } from 'next';
import { userData } from '@/config/users';
import { notFound } from 'next/navigation';
import OBSTracker2 from '@/components/OBSTracker2';

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
    notFound();
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <OBSTracker2 user={user} />
    </main>
  );
}

export function generateStaticParams(): Array<{ username: string }> {
  return Object.keys(userData).map((username) => ({
    username,
  }));
} 