import { SocketTestClient } from "./SocketTestClient.js";
import { environments, testUsers, createUserSession, betConfigs, TIMEOUTS, EXPECTED_GAME_CONFIG } from "./config.js";

async function testBasicBetting(environment = "local") {
    console.log("\n🎮 === BASIC BETTING TEST ===");
    console.log(`Environment: ${environment}`);

    const socketOptions = environments[environment];
    const user = testUsers.normalUser;
    const userSession = createUserSession(user);

    const client = new SocketTestClient(socketOptions, userSession);

    try {
        // Step 1: Connect to server
        console.log("\n📡 Step 1: Connecting to server...");
        await client.connect();

        // Step 2: Wait for sign-in (automatic with GameClientDriver)
        console.log("\n🔐 Step 2: Waiting for sign-in...");
        const signInData = await client.handleSignedInEvent();
        console.log("Sign-in successful!");

        // Step 3: Join game (using sendInGameEvent from GameClientDriver)
        console.log("\n🎮 Step 3: Joining game...");
        client.sendInGameEvent();

        // Step 4: Wait for game data using enhanced method
        console.log("\n📋 Step 4: Waiting for game configuration...");
        const gameData = await client.waitForGameEvent((data) => data.gameConfigs && data.user, TIMEOUTS.EVENT_WAIT);

        // Validate game data using built-in validation
        client.validateGameConfig(gameData);

        console.log("Available bet levels:", gameData.gameConfigs.betLevels);
        console.log("User balance:", gameData.user.red);
        console.log("User currency:", gameData.user.currency);

        // Validate against expected configuration
        const expectedBetLevels = EXPECTED_GAME_CONFIG.betLevels;
        const actualBetLevels = gameData.gameConfigs.betLevels;

        if (JSON.stringify(expectedBetLevels) !== JSON.stringify(actualBetLevels)) {
            console.warn("⚠️ Bet levels don't match expected configuration");
            console.warn("Expected:", expectedBetLevels);
            console.warn("Actual:", actualBetLevels);
        }

        // Step 5: Place a small bet
        console.log("\n🎲 Step 5: Placing small bet...");
        const betParams = betConfigs.smallBet;
        const expectedTotal = client.calculateTotalBet(betParams);

        console.log(`Betting ${betParams.amount} per payline on ${betParams.betChoice.length} paylines`);
        console.log(`Expected total bet amount: ${expectedTotal}`);

        client.placeBet(betParams);

        // Step 6: Wait for bet result using game event handler
        console.log("\n⏳ Step 6: Waiting for bet result...");
        const endBetResult = await client.waitForGameEvent((data) => data.endBet !== undefined, TIMEOUTS.BET_RESULT);
        console.log("Bet processed successfully");

        // Step 7: Wait for final result
        console.log("\n🏁 Step 7: Waiting for final result...");
        const finishResult = await client.waitForGameEvent((data) => data.finish, TIMEOUTS.EVENT_WAIT);

        // Analyze results using built-in analysis
        const analysis = client.analyzeBetResult(finishResult);

        // Validate basic expectations
        if (analysis.betAmount !== expectedTotal) {
            console.warn(`⚠️ Bet amount mismatch: expected ${expectedTotal}, got ${analysis.betAmount}`);
        }

        if (analysis.winAmount < 0) {
            console.warn("⚠️ Negative win amount detected");
        }

        // Check for RTP (Return to Player) - should be reasonable
        const rtp = analysis.betAmount > 0 ? (analysis.winAmount / analysis.betAmount) * 100 : 0;
        console.log(`RTP for this bet: ${rtp.toFixed(2)}%`);

        console.log("\n✅ Basic betting test completed successfully!");
        return {
            success: true,
            ...analysis,
            rtp: rtp,
            expectedBetAmount: expectedTotal,
        };
    } catch (error) {
        console.error("\n❌ Basic betting test failed:", error.message);
        return {
            success: false,
            error: error.message,
        };
    } finally {
        client.disconnect();
        console.log("🔌 Disconnected from server");
    }
}

// Function to test multiple bet sizes with enhanced error handling
async function testMultipleBetSizes(environment = "local") {
    console.log("\n🎯 === MULTIPLE BET SIZES TEST ===");

    const results = {};
    const socketOptions = environments[environment];
    const user = testUsers.normalUser;

    for (const [betName, betConfig] of Object.entries(betConfigs)) {
        console.log(`\n--- Testing ${betName} ---`);

        const userSession = createUserSession(user);
        const client = new SocketTestClient(socketOptions, userSession);

        try {
            await client.connect();
            await client.handleSignedInEvent();
            client.sendInGameEvent();

            // Wait for game data
            const gameData = await client.waitForGameEvent((data) => data.gameConfigs && data.user, TIMEOUTS.EVENT_WAIT);
            client.validateGameConfig(gameData);

            // Place bet
            const expectedTotal = client.calculateTotalBet(betConfig);
            client.placeBet(betConfig);

            // Wait for results
            await client.waitForGameEvent((data) => data.endBet !== undefined, TIMEOUTS.BET_RESULT);
            const finishResult = await client.waitForGameEvent((data) => data.finish, TIMEOUTS.EVENT_WAIT);

            const analysis = client.analyzeBetResult(finishResult);
            const rtp = analysis.betAmount > 0 ? (analysis.winAmount / analysis.betAmount) * 100 : 0;

            results[betName] = {
                ...analysis,
                rtp: parseFloat(rtp.toFixed(2)),
                expectedBetAmount: expectedTotal,
                success: true,
            };

            console.log(`✅ ${betName}: Bet ${analysis.betAmount}, Win ${analysis.winAmount}, RTP ${rtp.toFixed(2)}%`);
        } catch (error) {
            console.error(`❌ ${betName} failed:`, error.message);
            results[betName] = {
                error: error.message,
                success: false,
            };
        } finally {
            client.disconnect();
        }

        // Small delay between tests to avoid overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("\n📊 === MULTIPLE BET SIZES SUMMARY ===");
    console.table(results);

    // Calculate average RTP across successful bets
    const successfulBets = Object.values(results).filter((r) => r.success);
    if (successfulBets.length > 0) {
        const avgRTP = successfulBets.reduce((sum, r) => sum + r.rtp, 0) / successfulBets.length;
        console.log(`\n📈 Average RTP across all bet sizes: ${avgRTP.toFixed(2)}%`);
    }

    return results;
}

// Function to test game configuration consistency
async function testGameConfiguration(environment = "local") {
    console.log("\n🔧 === GAME CONFIGURATION TEST ===");

    const socketOptions = environments[environment];
    const user = testUsers.normalUser;
    const userSession = createUserSession(user);
    const client = new SocketTestClient(socketOptions, userSession);

    try {
        await client.connect();
        await client.handleSignedInEvent();
        client.sendInGameEvent();

        const gameData = await client.waitForGameEvent((data) => data.gameConfigs && data.user, TIMEOUTS.EVENT_WAIT);

        console.log("\n📋 Game Configuration Details:");
        console.log("Bet Levels:", gameData.gameConfigs.betLevels);
        console.log("Available Odds:", Object.keys(gameData.gameConfigs.odds || {}));
        console.log("User Balance:", gameData.user.red);
        console.log("User Type (Bot):", gameData.user.type);

        // Validate configuration
        client.validateGameConfig(gameData);

        // Check if all expected bet levels are available
        const hasAllExpectedLevels = EXPECTED_GAME_CONFIG.betLevels.every((level) => gameData.gameConfigs.betLevels.includes(level));

        if (!hasAllExpectedLevels) {
            console.warn("⚠️ Some expected bet levels are missing");
        }

        console.log("✅ Game configuration test passed");
        return { success: true, gameConfigs: gameData.gameConfigs, user: gameData.user };
    } catch (error) {
        console.error("❌ Game configuration test failed:", error.message);
        return { success: false, error: error.message };
    } finally {
        client.disconnect();
    }
}

// Export functions for use in other scripts
export { testBasicBetting, testMultipleBetSizes, testGameConfiguration };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const environment = process.argv[2] || "local";

    console.log("🚀 Starting enhanced socket client tests...");
    console.log(`Using environment: ${environment}`);

    try {
        await testGameConfiguration(environment);
        await testBasicBetting(environment);
        await testMultipleBetSizes(environment);
        console.log("\n🎉 All tests completed!");
    } catch (error) {
        console.error("💥 Test execution failed:", error);
        process.exit(1);
    }
}
