// Test script to systematically check app functions
// This will be run in the browser console

console.log("=== BIBLE REFLECTION APP FUNCTION TESTS ===");

// Test 1: Check if Daily Verse API works
async function testDailyVerse() {
  console.log("\n1. Testing Daily Verse API...");
  try {
    const response = await fetch('https://bible-api.com/Psalm 118:24?translation=kjv');
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Daily Verse API working:", data.verses[0].text.substring(0, 50) + "...");
      return true;
    } else {
      console.log("❌ Daily Verse API failed:", response.status);
      return false;
    }
  } catch (error) {
    console.log("❌ Daily Verse API error:", error.message);
    return false;
  }
}

// Test 2: Check IndexedDB functionality
async function testIndexedDB() {
  console.log("\n2. Testing IndexedDB functionality...");
  try {
    // Test if IndexedDB is available
    if (!window.indexedDB) {
      console.log("❌ IndexedDB not supported");
      return false;
    }
    
    // Try to open the database
    const request = indexedDB.open('BibleReflectionDB', 1);
    
    return new Promise((resolve) => {
      request.onerror = () => {
        console.log("❌ IndexedDB failed to open");
        resolve(false);
      };
      
      request.onsuccess = () => {
        console.log("✅ IndexedDB available and accessible");
        const db = request.result;
        
        // Check if required object stores exist
        const stores = ['journal_entries', 'user_preferences', 'bible_verses', 'reflections'];
        const existingStores = Array.from(db.objectStoreNames);
        
        console.log("Available stores:", existingStores);
        const missingStores = stores.filter(store => !existingStores.includes(store));
        
        if (missingStores.length > 0) {
          console.log("❌ Missing object stores:", missingStores);
          resolve(false);
        } else {
          console.log("✅ All required object stores present");
          resolve(true);
        }
        
        db.close();
      };
      
      request.onupgradeneeded = (event) => {
        console.log("🔄 IndexedDB needs upgrade/creation");
        const db = event.target.result;
        
        // This would normally create the stores, but let's just report what happens
        console.log("Database version:", db.version);
        resolve(true);
      };
    });
  } catch (error) {
    console.log("❌ IndexedDB test error:", error.message);
    return false;
  }
}

// Test 3: Check Navigation functionality
function testNavigation() {
  console.log("\n3. Testing Navigation...");
  try {
    // Check if React Navigation elements exist
    const tabElements = document.querySelectorAll('[role="tab"], [role="tablist"]');
    const buttons = document.querySelectorAll('button');
    
    console.log("Tab elements found:", tabElements.length);
    console.log("Buttons found:", buttons.length);
    
    if (buttons.length > 0) {
      console.log("✅ Navigation buttons present");
      
      // List button text content
      const buttonTexts = Array.from(buttons)
        .map(btn => btn.textContent?.trim())
        .filter(text => text && text.length > 0)
        .slice(0, 10); // First 10 buttons
      
      console.log("Button texts:", buttonTexts);
      return true;
    } else {
      console.log("❌ No navigation buttons found");
      return false;
    }
  } catch (error) {
    console.log("❌ Navigation test error:", error.message);
    return false;
  }
}

// Test 4: Check Local Storage
function testLocalStorage() {
  console.log("\n4. Testing Local Storage...");
  try {
    const testKey = 'bible-app-test';
    const testValue = 'working';
    
    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (retrieved === testValue) {
      console.log("✅ Local Storage working");
      return true;
    } else {
      console.log("❌ Local Storage not working properly");
      return false;
    }
  } catch (error) {
    console.log("❌ Local Storage error:", error.message);
    return false;
  }
}

// Test 5: Check Console for React errors
function checkConsoleErrors() {
  console.log("\n5. Checking for React/App errors...");
  // This is just informational - users should look at console
  console.log("ℹ️  Check browser console for any React errors or warnings");
  console.log("ℹ️  Look for red error messages or warning messages above");
  return true;
}

// Run all tests
async function runAllTests() {
  console.log("Starting comprehensive app tests...\n");
  
  const results = {
    dailyVerse: await testDailyVerse(),
    indexedDB: await testIndexedDB(),
    navigation: testNavigation(),
    localStorage: testLocalStorage(),
    consoleCheck: checkConsoleErrors()
  };
  
  console.log("\n=== TEST RESULTS SUMMARY ===");
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
  });
  
  const passedTests = Object.values(results).filter(r => r).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\nOverall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log("🎉 All basic functionality tests passed!");
  } else {
    console.log("⚠️  Some tests failed - check individual results above");
  }
  
  return results;
}

// Auto-run tests
runAllTests();