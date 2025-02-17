import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SolanaTracker from '@/components/SolanaTracker';
import { userData } from '@/config/users';

interface Props {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = params.username;
  const user = userData[username];
  
  if (!user) return { title: 'User Not Found' };

  return {
    title: `${user.username}'s Solana Tracker`,
    description: `Track ${user.username}'s Solana wallet balance and PnL in real-time`,
  };
}

export default async function UserPage({ params }: Props) {
  const username = params.username;
  const user = userData[username];

  if (!user) {
    notFound();
  }

  return <SolanaTracker initialData={user} />;
}

export function generateStaticParams() {
  return Object.keys(userData).map((username) => ({
    username,
  }));
} 