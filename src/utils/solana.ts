const LAMPORTS_PER_SOL = 1000000000;
const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

export async function fetchBalance(wallet: string): Promise<number | null> {
  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [wallet],
      }),
    });

    if (!response.ok) {
      console.error('Network response was not ok:', response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('RPC Error:', data.error.message || data.error);
      return null;
    }

    if (!data.result || typeof data.result.value !== 'number') {
      console.error('Invalid response format:', data);
      return null;
    }

    return data.result.value / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching balance:', error instanceof Error ? error.message : error);
    return null;
  }
} 