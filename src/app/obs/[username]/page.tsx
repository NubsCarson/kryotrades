import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import OBSTracker from '@/components/OBSTracker';
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
    title: `${user.username}'s Solana Tracker (OBS)`,
    description: `OBS overlay for ${user.username}'s Solana wallet balance and PnL`,
  };
}

export default async function OBSPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolvedParams = await params;
  const user = userData[resolvedParams.username];

  if (!user) {
    notFound();
  }

  return <OBSTracker initialData={user} />;
}

export function generateStaticParams(): Array<Params> {
  return Object.keys(userData).map((username) => ({
    username,
  }));
} 