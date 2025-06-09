import { SimpleSocketClient } from "./simpleSocketClient.js";

async function runBasicSocketTest() {
    const client = new SimpleSocketClient();

    try {
        console.log("🚀 Starting Socket Client Test");
        console.log("=" * 50);

        // Test 1: Connection
        console.log("\n📋 Test 1: Connection");
        await client.connect();

        // Test 2: Sign In
        console.log("\n📋 Test 2: Sign In");
        const signInResponse = await client.signIn();

        // Test 3: Join Game
        console.log("\n📋 Test 3: Join Game");
        const gameResponse = await client.joinGame();

        // Test 4: Place Bet
        console.log("\n📋 Test 4: Place Bet");
        const betResponse = await client.placeBet({
            amount: 1,
            betChoice: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        });

        // Test 5: End Bet
        console.log("\n📋 Test 5: End Bet");
        const endBetResponse = await client.endBet();

        // Test 6: Finish Round
        console.log("\n📋 Test 6: Finish Round");
        const finishResponse = await client.finish();

        // Summary
        console.log("\n🎉 All tests completed successfully!");
        console.log("=" * 50);
        console.log("📊 Summary of received events:");

        const events = client.getReceivedEvents();
        events.forEach((event, index) => {
            console.log(`${index + 1}. ${event.eventName} - ${new Date(event.timestamp).toLocaleTimeString()}`);
        });

        console.log(`\n✅ Total events received: ${events.length}`);
    } catch (error) {
        console.error("❌ Test failed:", error.message);
        console.error("Stack trace:", error.stack);
    } finally {
        client.disconnect();
    }
}

async function runConnectionTest() {
    const client = new SimpleSocketClient();

    try {
        console.log("🔌 Testing simple connection...");
        await client.connect();

        console.log("✅ Connection test successful!");

        // Wait a bit to see if we receive any initial events
        console.log("⏳ Waiting for any initial events...");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const events = client.getReceivedEvents();
        console.log(`📨 Received ${events.length} events during connection test`);

        events.forEach((event) => {
            console.log(`  - ${event.eventName}`);
        });
    } catch (error) {
        console.error("❌ Connection test failed:", error.message);
    } finally {
        client.disconnect();
    }
}

// Check command line arguments
const testType = process.argv[2] || "basic";

if (testType === "connection") {
    runConnectionTest();
} else {
    runBasicSocketTest();
}
