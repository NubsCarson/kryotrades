import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { formatBalance } from './format';

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

interface BalanceSubscription {
  wallet: string;
  subscriptionId: number;
  onUpdate: (balance: number) => void;
  lastKnownBalance: number;
}

const activeSubscriptions = new Map<string, BalanceSubscription>();

// Create a single connection instance with WebSocket support
const connection = new Connection(RPC_URL, {
  commitment: 'confirmed',
  wsEndpoint: RPC_URL.replace('https://', 'wss://'),
});

async function getCurrentBalance(wallet: string): Promise<number | null> {
  try {
    const pubkey = new PublicKey(wallet);
    const lamports = await connection.getBalance(pubkey);
    const balance = lamports / LAMPORTS_PER_SOL;
    return balance;
  } catch (error) {
    console.error('Error fetching current balance:', error);
    return null;
  }
}

export async function subscribeToWalletBalance(
  wallet: string,
  onUpdate: (balance: number) => void
): Promise<() => void> {
  // Clean up any existing subscription first
  if (activeSubscriptions.has(wallet)) {
    unsubscribeFromWallet(wallet);
  }

  console.log('📡 Setting up balance tracking for wallet:', wallet);

  // Initial balance check
  const initialBalance = await getCurrentBalance(wallet);
  if (initialBalance === null) {
    console.error('❌ Failed to get initial balance');
    return () => {};
  }

  console.log(`💫 Starting balance tracking:
    Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}
    Initial Balance: ${formatBalance(initialBalance)} SOL
    Time: ${new Date().toLocaleTimeString()}`);

  // Set up subscription
  const subscriptionId = connection.onAccountChange(
    new PublicKey(wallet),
    (account) => {
      const balance = account.lamports / LAMPORTS_PER_SOL;
      const subscription = activeSubscriptions.get(wallet);
      
      if (subscription && balance !== subscription.lastKnownBalance) {
        const change = balance - subscription.lastKnownBalance;
        
        console.log(`💰 Trade Detected:
          Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}
          Previous: ${formatBalance(subscription.lastKnownBalance)} SOL
          Current: ${formatBalance(balance)} SOL
          Change: ${change >= 0 ? '+' : ''}${formatBalance(change)} SOL
          Time: ${new Date().toLocaleTimeString()}`);
        
        subscription.lastKnownBalance = balance;
        subscription.onUpdate(balance);
      }
    },
    'confirmed'
  );

  // Store subscription info
  activeSubscriptions.set(wallet, {
    wallet,
    subscriptionId,
    onUpdate,
    lastKnownBalance: initialBalance
  });

  // Initial update
  onUpdate(initialBalance);

  // Return cleanup function
  return () => unsubscribeFromWallet(wallet);
}

function unsubscribeFromWallet(wallet: string) {
  const subscription = activeSubscriptions.get(wallet);
  if (subscription) {
    console.log('🔌 Stopping balance tracking for wallet:', wallet);
    connection.removeAccountChangeListener(subscription.subscriptionId);
    activeSubscriptions.delete(wallet);
  }
} 