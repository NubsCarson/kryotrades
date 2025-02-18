import { userData } from '../../../config/users';
import OBSTracker from '../../../components/OBSTracker';

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const user = userData[resolvedParams.username];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-transparent text-red-500 font-mono">
        <div className="text-2xl">User not found</div>
      </div>
    );
  }

  return <OBSTracker user={user} />;
}

export function generateStaticParams(): Array<{ username: string }> {
  return Object.keys(userData).map((username) => ({
    username,
  }));
} 