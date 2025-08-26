// Test memo length validation
const testMemos = [
  "JOIN_E1_123456",           // 14 bytes - OK
  "JOIN_E10_123456",          // 15 bytes - OK  
  "JOIN_E100_123456",         // 16 bytes - OK
  "JOIN_E1000_123456",        // 17 bytes - OK
];

testMemos.forEach(memo => {
  console.log(`"${memo}" - ${memo.length} bytes - ${memo.length <= 28 ? '✅ OK' : '❌ TOO LONG'}`);
});

// Output should show all memos are under 28 bytes
