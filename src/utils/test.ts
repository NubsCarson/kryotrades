import { calculatePnL, setDailyBaseline, getDailyBaseline } from './format';
import { fetchBalance } from './solana';

// Test wallet from the config
const TEST_WALLET = "HfpmrSSUuvwMjS15bbxByE1KgYjVi3CUf8rXomAG4jZp";

export async function simulatePnLTest() {
  console.log('🧪 Starting PnL Simulation Test');
  console.log('-------------------------------');

  // Step 1: Clear any existing baselines
  localStorage.clear();
  console.log('✨ Cleared localStorage');

  // Step 2: Get initial balance
  console.log('\n📊 Fetching initial balance...');
  const initialBalance = await fetchBalance(TEST_WALLET);
  if (initialBalance === null) {
    console.error('❌ Failed to fetch initial balance');
    return;
  }
  console.log(`✅ Initial balance: ${initialBalance.toFixed(4)} SOL`);

  // Step 3: Set initial baseline
  console.log('\n📌 Setting initial baseline...');
  setDailyBaseline(TEST_WALLET, initialBalance);
  const baseline = getDailyBaseline(TEST_WALLET);
  console.log(`✅ Baseline set: ${baseline.toFixed(4)} SOL`);

  // Step 4: Simulate balance changes
  console.log('\n🔄 Simulating balance changes...');
  
  // Test Case 1: No change
  console.log('\n📝 Test Case 1: No balance change');
  let pnl = calculatePnL(initialBalance, baseline);
  console.log(`Result: ${pnl.toFixed(4)} SOL (Expected: 0.0000)`);

  // Test Case 2: Profit
  console.log('\n📝 Test Case 2: Profit scenario');
  const profitBalance = initialBalance * 1.1; // 10% increase
  pnl = calculatePnL(profitBalance, baseline);
  console.log(`Result: ${pnl.toFixed(4)} SOL (Expected: ${(profitBalance - baseline).toFixed(4)})`);

  // Test Case 3: Loss
  console.log('\n📝 Test Case 3: Loss scenario');
  const lossBalance = initialBalance * 0.9; // 10% decrease
  pnl = calculatePnL(lossBalance, baseline);
  console.log(`Result: ${pnl.toFixed(4)} SOL (Expected: ${(lossBalance - baseline).toFixed(4)})`);

  // Test Case 4: Small change
  console.log('\n📝 Test Case 4: Small change (< 0.0001 SOL)');
  const smallChangeBalance = initialBalance + 0.00001;
  pnl = calculatePnL(smallChangeBalance, baseline);
  console.log(`Result: ${pnl.toFixed(4)} SOL (Expected: ~0.0000)`);

  // Test Case 5: Day change simulation
  console.log('\n📝 Test Case 5: Day change simulation');
  
  // Simulate end of day balance
  const endOfDayBalance = initialBalance * 1.05; // 5% up
  console.log(`End of day balance: ${endOfDayBalance.toFixed(4)} SOL`);
  
  // Simulate new day
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = `${TEST_WALLET}_baseline_${yesterday.toISOString().split('T')[0]}`;
  localStorage.setItem(yesterdayKey, endOfDayBalance.toString());
  
  // Clear today's baseline to simulate new day
  const today = new Date().toISOString().split('T')[0];
  const todayKey = `${TEST_WALLET}_baseline_${today}`;
  localStorage.removeItem(todayKey);
  
  // Get new baseline (should use yesterday's final balance)
  console.log('\n🌅 Simulating new day...');
  const newDayBalance = endOfDayBalance * 0.98; // 2% down from yesterday
  setDailyBaseline(TEST_WALLET, newDayBalance);
  const newBaseline = getDailyBaseline(TEST_WALLET);
  pnl = calculatePnL(newDayBalance, newBaseline);
  console.log(`New day PnL: ${pnl.toFixed(4)} SOL`);

  console.log('\n-------------------------------');
  console.log('🏁 PnL Simulation Test Complete');
}

// Function to run the test
export function runPnLTest() {
  console.log('🚀 Running PnL Test Suite');
  simulatePnLTest().catch(error => {
    console.error('❌ Test failed:', error);
  });
} 