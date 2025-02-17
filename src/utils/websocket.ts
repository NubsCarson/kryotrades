import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { formatBalance } from './format';

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const RATE_LIMIT_MS = 30000; // 30 seconds

interface BalanceSubscription {
  wallet: string;
  subscriptionId: number;
  onUpdate: (balance: number, pnl: number) => void;
  baseline: number;
  lastKnownBalance: number;
  lastUpdateTime: number;
}

const activeSubscriptions = new Map<string, BalanceSubscription>();

// Create a single connection instance with WebSocket support
const connection = new Connection(RPC_URL, {
  commitment: 'confirmed',
  wsEndpoint: RPC_URL.replace('https://', 'wss://'),
});

// Rate limiting state
const lastRequestTime: { [key: string]: number } = {};

async function getRateLimitDelay(wallet: string): Promise<number> {
  const now = Date.now();
  const lastRequest = lastRequestTime[wallet] || 0;
  const timeSinceLastRequest = now - lastRequest;
  return Math.max(0, RATE_LIMIT_MS - timeSinceLastRequest);
}

async function getCurrentBalance(wallet: string): Promise<number | null> {
  try {
    // Apply rate limiting
    const delay = await getRateLimitDelay(wallet);
    if (delay > 0) {
      console.log(`⏳ Rate limit: waiting ${(delay / 1000).toFixed(1)} seconds for wallet ${wallet.slice(0, 4)}...${wallet.slice(-4)}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const pubkey = new PublicKey(wallet);
    const lamports = await connection.getBalance(pubkey);
    const balance = lamports / LAMPORTS_PER_SOL;

    // Update last request time
    lastRequestTime[wallet] = Date.now();
    return balance;
  } catch (error) {
    console.error('Error fetching current balance:', error);
    return null;
  }
}

export async function subscribeToWalletBalance(
  wallet: string,
  onUpdate: (balance: number, pnl: number) => void
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
      
      if (subscription) {
        const now = Date.now();
        const timeSinceLastUpdate = now - subscription.lastUpdateTime;
        
        // Only update if balance changed and we're outside the rate limit window
        if (balance !== subscription.lastKnownBalance && timeSinceLastUpdate >= RATE_LIMIT_MS) {
          const pnl = balance - subscription.baseline;
          const pnlPercentage = (pnl / subscription.baseline) * 100;
          
          console.log(`💰 Balance Update:
            Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}
            Current: ${formatBalance(balance)} SOL
            Baseline: ${formatBalance(subscription.baseline)} SOL
            PnL: ${pnl >= 0 ? '+' : ''}${formatBalance(pnl)} SOL (${pnlPercentage.toFixed(2)}%)
            Time: ${new Date().toLocaleTimeString()}`);
          
          subscription.lastKnownBalance = balance;
          subscription.lastUpdateTime = now;
          subscription.onUpdate(balance, pnl);
        } else if (balance !== subscription.lastKnownBalance) {
          // Log skipped update due to rate limiting
          const timeToNextUpdate = RATE_LIMIT_MS - timeSinceLastUpdate;
          console.log(`⏳ Balance change detected but skipping update due to rate limit:
            Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}
            Next update in: ${(timeToNextUpdate / 1000).toFixed(1)} seconds
            Time: ${new Date().toLocaleTimeString()}`);
        }
      }
    },
    'confirmed'
  );

  // Store subscription info
  activeSubscriptions.set(wallet, {
    wallet,
    subscriptionId,
    onUpdate,
    baseline: initialBalance,
    lastKnownBalance: initialBalance,
    lastUpdateTime: Date.now(),
  });

  // Initial update with initial PnL (should be 0 since baseline = initial balance)
  const initialPnL = 0;
  onUpdate(initialBalance, initialPnL);

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