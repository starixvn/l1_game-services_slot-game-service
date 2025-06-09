import { SimpleSocketClient } from "./simpleSocketClient.js";

async function quickSigninTest() {
    const client = new SimpleSocketClient();

    try {
        console.log("🔌 Connecting...");
        await client.connect();

        console.log("🔐 Sending signin...");
        client.socket.emit("signin", {
            isAuthenticated: true,
            umInfo: null,
            username: "ONEworksVGCash_21031988",
            language: "vi-VN",
            ss: "hjxdjTAfoes3HXy6yV0zc2vda3GSJoFY_ONEworksVGCash_21031988",
            system: 1,
            memberName: "username_21031988",
            rate: 0.03935056827912655,
            fractionalOddsFormat: true,
            isUM: false,
            time: "2025-06-07T08:05:42.186Z",
        });

        console.log("⏳ Waiting 10 seconds for any response...");
        await new Promise((resolve) => setTimeout(resolve, 10000));

        console.log("📨 Events received:");
        const events = client.getReceivedEvents();
        events.forEach((event, index) => {
            console.log(`${index + 1}. ${event.eventName}:`, JSON.stringify(event.args, null, 2));
        });

        if (events.length === 0) {
            console.log("❌ No events received after signin");
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        client.disconnect();
    }
}

quickSigninTest();
