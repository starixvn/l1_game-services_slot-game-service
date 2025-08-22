import { SocketTestClient, setGameResult } from "./SocketTestClient.js";
import { environments, testUsers, createUserSession, betConfigs, testResults, TIMEOUTS } from "./config.js";

// Test free spins promotion
async function testFreeSpinsPromotion(environment = "igt") {
    console.log("\n🎰 === FREE SPINS PROMOTION TEST ===");
    console.log(`Environment: ${environment}`);

    if (environment !== "igt") {
        console.warn("⚠️ Free spins test requires IGT environment for result control");
    }

    const socketOptions = environments[environment];
    const user = testUsers.normalUser;
    const userSession = createUserSession(user);
    const client = new SocketTestClient(socketOptions, userSession);

    try {
        // Set result for free spins (only works in IGT mode)
        if (environment === "igt") {
            console.log("\n🎯 Setting up free spins result...");
            await setGameResult(testResults.freeSpins, user.playerName);
        }

        // Connect and join game
        console.log("\n📡 Connecting and joining game...");
        await client.connect();
        await client.handleSignedInEvent();
        client.sendInGameEvent();

        const gameData = await client.waitForGameEvent((data) => data.gameConfigs && data.user, TIMEOUTS.EVENT_WAIT);
        client.validateGameConfig(gameData);

        console.log("Initial user balance:", gameData.user.red);

        // Place bet
        console.log("\n🎲 Placing bet to trigger free spins...");
        const betParams = betConfigs.smallBet;
        const expectedTotal = client.calculateTotalBet(betParams);

        client.placeBet(betParams);

        // Wait for bet result
        const endBetResult = await client.waitForGameEvent((data) => data.endBet !== undefined, TIMEOUTS.BET_RESULT);
        const finishResult = await client.waitForGameEvent((data) => data.finish, TIMEOUTS.EVENT_WAIT);

        const analysis = client.analyzeBetResult(finishResult);

        // Check if free spins were triggered
        if (analysis.freeSpins > 0) {
            console.log(`🎉 Free spins triggered! Count: ${analysis.freeSpins}`);

            // Process each free spin
            const freeSpinResults = [];
            for (let i = 0; i < analysis.freeSpins; i++) {
                console.log(`\n🎰 Processing free spin ${i + 1}/${analysis.freeSpins}...`);

                client.placeBet(betParams);

                const freeSpinEndBet = await client.waitForGameEvent((data) => data.endBet !== undefined, TIMEOUTS.BET_RESULT);
                const freeSpinFinish = await client.waitForGameEvent((data) => data.finish, TIMEOUTS.EVENT_WAIT);

                const freeSpinAnalysis = client.analyzeBetResult(freeSpinFinish);
                freeSpinResults.push(freeSpinAnalysis);

                // Validate that this was indeed a free spin
                if (!freeSpinAnalysis.byFreeSpin) {
                    console.warn(`⚠️ Free spin ${i + 1} was not marked as free spin`);
                }

                console.log(`Free spin ${i + 1} win: ${freeSpinAnalysis.winAmount}`);
            }

            // Calculate total free spin winnings
            const totalFreeSpinWins = freeSpinResults.reduce((sum, result) => sum + result.winAmount, 0);
            console.log(`\n💰 Total free spin winnings: ${totalFreeSpinWins}`);
            console.log(`Total wins (including trigger): ${analysis.winAmount + totalFreeSpinWins}`);

            return {
                success: true,
                triggerBet: analysis,
                freeSpinCount: analysis.freeSpins,
                freeSpinResults: freeSpinResults,
                totalFreeSpinWins: totalFreeSpinWins,
                totalWinnings: analysis.winAmount + totalFreeSpinWins,
            };
        } else {
            console.log("❌ Free spins were not triggered");
            return {
                success: false,
                error: "Free spins not triggered",
                triggerBet: analysis,
            };
        }
    } catch (error) {
        console.error("\n❌ Free spins test failed:", error.message);
        return {
            success: false,
            error: error.message,
        };
    } finally {
        client.disconnect();
        console.log("🔌 Disconnected from server");
    }
}

// Test bonus promotion
async function testBonusPromotion(environment = "igt") {
    console.log("\n🎁 === BONUS PROMOTION TEST ===");
    console.log(`Environment: ${environment}`);

    if (environment !== "igt") {
        console.warn("⚠️ Bonus test requires IGT environment for result control");
    }

    const socketOptions = environments[environment];
    const user = testUsers.normalUser;
    const userSession = createUserSession(user);
    const client = new SocketTestClient(socketOptions, userSession);

    try {
        // Set result for bonus (only works in IGT mode)
        if (environment === "igt") {
            console.log("\n🎯 Setting up bonus result...");
            await setGameResult(testResults.bonus, user.playerName);
        }

        // Connect and join game
        console.log("\n📡 Connecting and joining game...");
        await client.connect();
        await client.handleSignedInEvent();
        client.sendInGameEvent();

        const gameData = await client.waitForGameEvent((data) => data.gameConfigs && data.user, TIMEOUTS.EVENT_WAIT);
        client.validateGameConfig(gameData);

        // Place bet
        console.log("\n🎲 Placing bet to trigger bonus...");
        const betParams = betConfigs.smallBet;

        client.placeBet(betParams);

        // Wait for bonus trigger
        console.log("\n⏳ Waiting for bonus trigger...");
        const bonusData = await client.waitForGameEvent((data) => data.bonuses, TIMEOUTS.BET_RESULT);

        if (bonusData.bonuses && bonusData.bonuses.bonus > 0) {
            console.log(`🎉 Bonus triggered! Bonus value: ${bonusData.bonuses.bonus}`);

            // Open bonus chests
            const chestsToOpen = [0, 1, 2]; // Open first 3 chests as per the original test
            const chestResults = [];

            for (const chestIndex of chestsToOpen) {
                console.log(`\n📦 Opening bonus chest ${chestIndex}...`);
                client.openBonusChest(chestIndex);

                const chestResult = await client.waitForGameEvent((data) => data.bonusChest, TIMEOUTS.BONUS_RESULT);
                chestResults.push(chestResult.bonusChest);

                console.log(`Chest ${chestIndex} result:`, {
                    amount: chestResult.bonusChest.amount,
                    chest: chestResult.bonusChest.chest,
                });
            }

            // Calculate total bonus winnings
            const totalBonusWins = chestResults.reduce((sum, chest) => sum + (chest.amount || 0), 0);
            console.log(`\n💰 Total bonus winnings: ${totalBonusWins}`);

            // Get final bet result
            const finishResult = await client.waitForGameEvent((data) => data.finish, TIMEOUTS.EVENT_WAIT);
            const analysis = client.analyzeBetResult(finishResult);

            return {
                success: true,
                bonusTriggered: bonusData.bonuses.bonus,
                chestResults: chestResults,
                totalBonusWins: totalBonusWins,
                triggerBet: analysis,
                totalWinnings: analysis.winAmount + totalBonusWins,
            };
        } else {
            console.log("❌ Bonus was not triggered");

            // Still get the finish result for analysis
            const finishResult = await client.waitForGameEvent((data) => data.finish, TIMEOUTS.EVENT_WAIT);
            const analysis = client.analyzeBetResult(finishResult);

            return {
                success: false,
                error: "Bonus not triggered",
                triggerBet: analysis,
            };
        }
    } catch (error) {
        console.error("\n❌ Bonus test failed:", error.message);
        return {
            success: false,
            error: error.message,
        };
    } finally {
        client.disconnect();
        console.log("🔌 Disconnected from server");
    }
}

// Test normal betting (without promotions) for comparison
async function testNormalBetting(environment = "igt") {
    console.log("\n🎲 === NORMAL BETTING TEST (NO PROMOTIONS) ===");

    const socketOptions = environments[environment];
    const user = testUsers.normalUser;
    const userSession = createUserSession(user);
    const client = new SocketTestClient(socketOptions, userSession);

    try {
        // Set normal result (only works in IGT mode)
        if (environment === "igt") {
            console.log("\n🎯 Setting up normal result...");
            await setGameResult(testResults.normal, user.playerName);
        }

        // Connect and join game
        await client.connect();
        await client.handleSignedInEvent();
        client.sendInGameEvent();

        const gameData = await client.waitForGameEvent((data) => data.gameConfigs && data.user, TIMEOUTS.EVENT_WAIT);
        client.validateGameConfig(gameData);

        // Place bet
        const betParams = betConfigs.smallBet;
        client.placeBet(betParams);

        // Wait for results
        await client.waitForGameEvent((data) => data.endBet !== undefined, TIMEOUTS.BET_RESULT);
        const finishResult = await client.waitForGameEvent((data) => data.finish, TIMEOUTS.EVENT_WAIT);

        const analysis = client.analyzeBetResult(finishResult);

        // Verify no promotions were triggered
        if (analysis.freeSpins > 0 || analysis.bonus > 0) {
            console.warn("⚠️ Unexpected promotions triggered in normal betting test");
        } else {
            console.log("✅ Normal betting completed without promotions");
        }

        return {
            success: true,
            result: analysis,
            hasPromotions: analysis.freeSpins > 0 || analysis.bonus > 0,
        };
    } catch (error) {
        console.error("❌ Normal betting test failed:", error.message);
        return {
            success: false,
            error: error.message,
        };
    } finally {
        client.disconnect();
    }
}

// Comprehensive promotion test suite
async function testAllPromotions(environment = "igt") {
    console.log("\n🎪 === COMPREHENSIVE PROMOTION TEST SUITE ===");
    console.log(`Environment: ${environment}`);

    const results = {
        normal: null,
        freeSpins: null,
        bonus: null,
    };

    try {
        // Test normal betting first
        console.log("\n1️⃣ Testing normal betting...");
        results.normal = await testNormalBetting(environment);

        // Small delay between tests
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Test free spins
        console.log("\n2️⃣ Testing free spins promotion...");
        results.freeSpins = await testFreeSpinsPromotion(environment);

        // Small delay between tests
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Test bonus
        console.log("\n3️⃣ Testing bonus promotion...");
        results.bonus = await testBonusPromotion(environment);

        // Summary
        console.log("\n📊 === PROMOTION TEST SUMMARY ===");
        console.log("Normal betting:", results.normal.success ? "✅ PASS" : "❌ FAIL");
        console.log("Free spins:", results.freeSpins.success ? "✅ PASS" : "❌ FAIL");
        console.log("Bonus:", results.bonus.success ? "✅ PASS" : "❌ FAIL");

        if (results.normal.success && results.freeSpins.success && results.bonus.success) {
            console.log("\n🎉 All promotion tests passed!");
        } else {
            console.log("\n⚠️ Some promotion tests failed");
        }

        return results;
    } catch (error) {
        console.error("❌ Promotion test suite failed:", error.message);
        return {
            success: false,
            error: error.message,
            results,
        };
    }
}

// Export functions for use in other scripts
export { testFreeSpinsPromotion, testBonusPromotion, testNormalBetting, testAllPromotions };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const environment = process.argv[2] || "igt";

    console.log("🚀 Starting promotion tests...");
    console.log(`Using environment: ${environment}`);

    if (environment !== "igt") {
        console.warn("⚠️ For full promotion testing, use 'igt' environment");
        console.warn("Usage: node promotions.test.js igt");
    }

    try {
        await testAllPromotions(environment);
        console.log("\n🎉 Promotion tests completed!");
    } catch (error) {
        console.error("💥 Promotion test execution failed:", error);
        process.exit(1);
    }
}
