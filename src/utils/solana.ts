import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const RATE_LIMIT_MS = 120000; // 2 minutes

// Create a connection with commitment
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

export async function fetchBalance(wallet: string): Promise<number | null> {
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
    
    console.log(`✅ Balance fetched:
      Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}
      Balance: ${balance.toFixed(4)} SOL
      Time: ${new Date().toLocaleTimeString()}`);
    
    return balance;
  } catch (error) {
    console.error(`❌ Balance fetch error:
      Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}
      Error: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

export function subscribeToBalanceChanges(
  wallet: string,
  onUpdate: (balance: number) => void
): () => void {
  let isSubscribed = true;
  let lastBalance: number | null = null;
  let lastUpdateTime = 0;

  console.log(`🔄 Starting balance tracking:
    Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}
    Time: ${new Date().toLocaleTimeString()}`);

  // Set up account subscription
  const subscriptionId = connection.onAccountChange(
    new PublicKey(wallet),
    async (account) => {
      if (!isSubscribed) return;
      
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateTime;
      
      // Only process updates if we're outside the rate limit window
      if (timeSinceLastUpdate >= RATE_LIMIT_MS) {
        const balance = account.lamports / LAMPORTS_PER_SOL;
        
        if (lastBalance === null || balance !== lastBalance) {
          const change = lastBalance !== null ? balance - lastBalance : 0;
          const changePercentage = lastBalance !== null ? (change / lastBalance) * 100 : 0;
          
          console.log(`📈 Balance Update:
            Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}
            Previous: ${lastBalance?.toFixed(4) || 'None'} SOL
            Current: ${balance.toFixed(4)} SOL
            Change: ${change.toFixed(4)} SOL (${changePercentage.toFixed(2)}%)
            Time: ${new Date().toLocaleTimeString()}`);
          
          lastBalance = balance;
          lastUpdateTime = now;
          onUpdate(balance);
        }
      }
    },
    'confirmed'
  );

  // Initial balance fetch
  fetchBalance(wallet).then(balance => {
    if (balance !== null) {
      lastBalance = balance;
      lastUpdateTime = Date.now();
      onUpdate(balance);
    }
  });

  // Return cleanup function
  return () => {
    console.log(`🛑 Stopping balance tracking:
      Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}
      Final Balance: ${lastBalance?.toFixed(4) || 'None'} SOL
      Time: ${new Date().toLocaleTimeString()}`);
    isSubscribed = false;
    connection.removeAccountChangeListener(subscriptionId);
  };
} 