// Focused test for reflection deletion issue
// Run this in browser console when on the reflections list page

console.log("=== REFLECTION DELETION DEBUG TEST ===");

async function testReflectionDeletion() {
  console.log("1. Checking if reflection deletion debugging is active...");
  
  // Try to access the IndexedDB directly
  try {
    const request = indexedDB.open('BibleReflectionDB', 1);
    
    request.onsuccess = async function(event) {
      const db = event.target.result;
      console.log("✅ Database connection established");
      
      // Get all reflections
      const transaction = db.transaction(['reflections'], 'readonly');
      const store = transaction.objectStore('reflections');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = function() {
        const reflections = getAllRequest.result;
        console.log(`📊 Found ${reflections.length} reflections in database:`);
        
        reflections.forEach((reflection, index) => {
          console.log(`  ${index + 1}. ID: ${reflection.id} (${typeof reflection.id})`);
          console.log(`     Content: "${reflection.content.substring(0, 50)}..."`);
          console.log(`     Created: ${reflection.createdAt}`);
        });
        
        if (reflections.length > 0) {
          console.log("\n🧪 To test deletion:");
          console.log("1. Click delete button on any reflection");
          console.log("2. Watch console for detailed debug output");
          console.log("3. Check if reflection disappears from list");
          console.log("4. Refresh page and see if reflection is still gone");
          
          // Test manual deletion
          console.log("\n🔧 Testing manual deletion of first reflection:");
          const firstReflection = reflections[0];
          
          const deleteTransaction = db.transaction(['reflections'], 'readwrite');
          const deleteStore = deleteTransaction.objectStore('reflections');
          const deleteRequest = deleteStore.delete(firstReflection.id);
          
          deleteRequest.onsuccess = function() {
            console.log(`✅ Manual deletion successful for ID: ${firstReflection.id}`);
            
            // Verify deletion
            const verifyTransaction = db.transaction(['reflections'], 'readonly');
            const verifyStore = verifyTransaction.objectStore('reflections');
            const verifyRequest = verifyStore.getAll();
            
            verifyRequest.onsuccess = function() {
              const remainingReflections = verifyRequest.result;
              console.log(`📊 Reflections after manual deletion: ${remainingReflections.length}`);
              
              const stillExists = remainingReflections.find(r => r.id === firstReflection.id);
              if (stillExists) {
                console.log("❌ CRITICAL: Manual deletion failed - reflection still exists");
              } else {
                console.log("✅ Manual deletion confirmed - reflection removed from database");
                console.log("🔍 Issue may be in the UI deletion function, not database");
              }
            };
          };
          
          deleteRequest.onerror = function() {
            console.log("❌ Manual deletion failed:", deleteRequest.error);
          };
        } else {
          console.log("ℹ️  No reflections found to test deletion");
          console.log("💡 Create a reflection first, then test deletion");
        }
        
        db.close();
      };
      
      getAllRequest.onerror = function() {
        console.log("❌ Failed to get reflections:", getAllRequest.error);
        db.close();
      };
    };
    
    request.onerror = function() {
      console.log("❌ Failed to open database:", request.error);
    };
    
    request.onupgradeneeded = function(event) {
      console.log("🔄 Database needs upgrade - this may indicate initialization issues");
    };
    
  } catch (error) {
    console.log("❌ IndexedDB test failed:", error);
  }
}

// Check if we're on the right page
if (window.location.href.includes('localhost:8081')) {
  console.log("✅ Running on development server");
  testReflectionDeletion();
} else {
  console.log("⚠️  Please run this on the development server (localhost:8081)");
}

// Also check for React error boundary issues
window.addEventListener('error', (event) => {
  console.log("🚨 JavaScript Error:", event.error);
});

console.log("\n📋 Instructions:");
console.log("1. Navigate to 'My Reflections' screen");
console.log("2. Run this test script");
console.log("3. Try deleting a reflection and watch the console");
console.log("4. Compare app behavior vs manual database deletion results");