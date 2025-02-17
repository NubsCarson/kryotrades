export function formatBalance(balance: number): string {
  return balance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function calculatePnL(currentBalance: number, baseline: number): number {
  if (baseline === 0) {
    console.log('❌ PnL calculation skipped: baseline is 0');
    return 0;
  }
  
  const pnl = currentBalance - baseline;
  const pnlPercentage = (pnl / baseline) * 100;
  
  console.log(`📈 PnL Update:
    Current Balance: ${formatBalance(currentBalance)} SOL
    Baseline: ${formatBalance(baseline)} SOL
    PnL: ${formatBalance(pnl)} SOL (${pnlPercentage.toFixed(2)}%)
    Time: ${new Date().toLocaleTimeString()}`);
  
  return pnl;
}

const lastLoggedBaseline: { [key: string]: number } = {};

export function getDailyBaseline(wallet: string): number {
  const today = new Date().toISOString().split('T')[0];
  const key = `${wallet}_baseline_${today}`;
  const baselineKey = `${wallet}_has_baseline`;
  
  console.log(`🔍 Getting Baseline:
    Date: ${today}
    Time: ${new Date().toLocaleTimeString()}
    Storage Key: ${key}
    Has Baseline Key: ${baselineKey}
    Has Baseline Value: ${localStorage.getItem(baselineKey)}
    Stored Baseline: ${localStorage.getItem(key)}`);
  
  const stored = localStorage.getItem(key);
  const baseline = stored ? parseFloat(stored) : 0;
  
  if (Math.abs((lastLoggedBaseline[wallet] || 0) - baseline) > 0.0001) {
    console.log(`🎯 Daily baseline for ${today}:
      Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}
      Baseline: ${formatBalance(baseline)} SOL
      Previous Logged: ${formatBalance(lastLoggedBaseline[wallet] || 0)} SOL
      Time: ${new Date().toLocaleTimeString()}`);
    lastLoggedBaseline[wallet] = baseline;
  }
  return baseline;
}

export function setDailyBaseline(wallet: string, balance: number): void {
  const today = new Date().toISOString().split('T')[0];
  const key = `${wallet}_baseline_${today}`;
  const baselineKey = `${wallet}_has_baseline`;
  const timestamp = new Date().toISOString();
  
  console.log(`🔍 Setting Baseline:
    Date: ${today}
    Time: ${new Date().toLocaleTimeString()}
    Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}
    Current Balance: ${formatBalance(balance)} SOL
    Storage Key: ${key}
    Has Baseline: ${localStorage.getItem(baselineKey)}
    Existing Baseline: ${localStorage.getItem(key)}`);
  
  // Check if we've already recorded a baseline for any day
  const hasBaseline = localStorage.getItem(baselineKey);
  
  if (!hasBaseline) {
    // First time setting baseline
    localStorage.setItem(key, balance.toString());
    localStorage.setItem(`${key}_time`, timestamp);
    localStorage.setItem(baselineKey, 'true');
    console.log(`✅ Initial baseline set:
      Date: ${today}
      Time: ${new Date().toLocaleTimeString()}
      Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}
      Baseline: ${formatBalance(balance)} SOL`);
    lastLoggedBaseline[wallet] = balance;
  } else {
    // Check if we need to set a new day's baseline
    const storedBaseline = localStorage.getItem(key);
    if (!storedBaseline) {
      // Get yesterday's final balance
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = `${wallet}_baseline_${yesterday.toISOString().split('T')[0]}`;
      const yesterdayBaseline = localStorage.getItem(yesterdayKey);
      
      console.log(`🔍 Checking Previous Day:
        Yesterday: ${yesterday.toISOString().split('T')[0]}
        Time: ${new Date().toLocaleTimeString()}
        Yesterday Key: ${yesterdayKey}
        Yesterday Baseline: ${yesterdayBaseline}`);
      
      if (yesterdayBaseline) {
        // Use yesterday's final balance as today's baseline
        localStorage.setItem(key, yesterdayBaseline);
        localStorage.setItem(`${key}_time`, timestamp);
        console.log(`✅ New day baseline set from previous day:
          Date: ${today}
          Time: ${new Date().toLocaleTimeString()}
          Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}
          Baseline: ${formatBalance(parseFloat(yesterdayBaseline))} SOL`);
        lastLoggedBaseline[wallet] = parseFloat(yesterdayBaseline);
      } else {
        // No previous baseline, use current balance
        localStorage.setItem(key, balance.toString());
        localStorage.setItem(`${key}_time`, timestamp);
        console.log(`✅ New day baseline set:
          Date: ${today}
          Time: ${new Date().toLocaleTimeString()}
          Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}
          Baseline: ${formatBalance(balance)} SOL`);
        lastLoggedBaseline[wallet] = balance;
      }
    } else {
      console.log(`ℹ️ Baseline already exists:
        Date: ${today}
        Time: ${new Date().toLocaleTimeString()}
        Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}
        Baseline: ${formatBalance(parseFloat(storedBaseline))} SOL`);
    }
  }
}

const lastLoggedPnLUpdate: { [key: string]: string } = {};

export function getLastPnLUpdate(wallet: string): Date | null {
  const today = new Date().toISOString().split('T')[0];
  const key = `${wallet}_baseline_${today}_time`;
  const timestamp = localStorage.getItem(key);
  
  if (timestamp && lastLoggedPnLUpdate[wallet] !== timestamp) {
    console.log(`⏰ PnL update time:
      Time: ${new Date(timestamp).toLocaleTimeString()}
      Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}`);
    lastLoggedPnLUpdate[wallet] = timestamp;
  }
  return timestamp ? new Date(timestamp) : null;
}

export function shouldUpdatePnL(wallet: string): boolean {
  const lastUpdate = getLastPnLUpdate(wallet);
  if (!lastUpdate) return true;
  
  const now = new Date();
  const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);
  const shouldUpdate = diffMinutes >= 5;
  
  if (shouldUpdate) {
    console.log(`⏰ PnL update needed:
      Last Update: ${lastUpdate.toLocaleTimeString()}
      Current Time: ${now.toLocaleTimeString()}
      Minutes Since Update: ${diffMinutes.toFixed(1)}
      Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}`);
  }
  return shouldUpdate;
}

export function shouldUpdateBaseline(wallet: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  const key = `${wallet}_baseline_${today}`;
  const baselineKey = `${wallet}_has_baseline`;
  
  console.log(`🔍 Checking Baseline Status:
    Date: ${today}
    Time: ${new Date().toLocaleTimeString()}
    Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}
    Storage Key: ${key}
    Has Baseline Key: ${baselineKey}
    Has Baseline: ${localStorage.getItem(baselineKey)}
    Today's Baseline: ${localStorage.getItem(key)}`);
  
  // Check if we've ever set a baseline
  const hasBaseline = localStorage.getItem(baselineKey);
  if (!hasBaseline) {
    console.log('✨ Initial baseline needed - first time setup');
    return true;
  }
  
  // Check if we need a new day's baseline
  const needsUpdate = !localStorage.getItem(key);
  if (needsUpdate) {
    console.log('✨ New day - baseline update needed');
  } else {
    console.log('ℹ️ Baseline is current and valid');
  }
  return needsUpdate;
} 