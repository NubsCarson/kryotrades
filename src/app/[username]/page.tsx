import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SolanaTracker from '@/components/SolanaTracker';
import { userData } from '@/config/users';

type Params = { username: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const user = userData[resolvedParams.username];
  
  if (!user) return { title: 'User Not Found' };

  return {
    title: `${user.username}'s Solana Tracker`,
    description: `Track ${user.username}'s Solana wallet balance and PnL in real-time`,
  };
}

export default async function UserPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolvedParams = await params;
  const user = userData[resolvedParams.username];

  if (!user) {
    notFound();
  }

  return <SolanaTracker initialData={user} />;
}

export function generateStaticParams(): Array<Params> {
  return Object.keys(userData).map((username) => ({
    username,
  }));
} 