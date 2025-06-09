import { testBasicBetting, testMultipleBetSizes, testGameConfiguration } from "./basicBetting.test.js";
import { testAllPromotions } from "./promotions.test.js";

// Main test runner
async function runAllTests(environment = "local") {
    console.log("🚀 === SOCKET CLIENT TEST SUITE ===");
    console.log(`Environment: ${environment.toUpperCase()}`);
    console.log(`Test started at: ${new Date().toISOString()}`);

    const results = {
        timestamp: new Date().toISOString(),
        environment,
        tests: {},
        summary: {
            total: 0,
            passed: 0,
            failed: 0,
        },
    };

    // Test 1: Game Configuration
    try {
        console.log("\n🔧 Running game configuration test...");
        results.tests.gameConfiguration = await testGameConfiguration(environment);
        results.summary.total++;
        if (results.tests.gameConfiguration.success) {
            results.summary.passed++;
        } else {
            results.summary.failed++;
        }
    } catch (error) {
        console.error("Game configuration test crashed:", error.message);
        results.tests.gameConfiguration = { success: false, error: error.message };
        results.summary.total++;
        results.summary.failed++;
    }

    // Test 2: Basic Betting
    try {
        console.log("\n🎲 Running basic betting test...");
        results.tests.basicBetting = await testBasicBetting(environment);
        results.summary.total++;
        if (results.tests.basicBetting.success) {
            results.summary.passed++;
        } else {
            results.summary.failed++;
        }
    } catch (error) {
        console.error("Basic betting test crashed:", error.message);
        results.tests.basicBetting = { success: false, error: error.message };
        results.summary.total++;
        results.summary.failed++;
    }

    // Test 3: Multiple Bet Sizes
    try {
        console.log("\n🎯 Running multiple bet sizes test...");
        results.tests.multipleBetSizes = await testMultipleBetSizes(environment);
        results.summary.total++;

        // Count successful/failed individual bet tests
        const betResults = Object.values(results.tests.multipleBetSizes);
        const successfulBets = betResults.filter((r) => r.success).length;
        const failedBets = betResults.filter((r) => !r.success).length;

        if (successfulBets > failedBets) {
            results.summary.passed++;
        } else {
            results.summary.failed++;
        }
    } catch (error) {
        console.error("Multiple bet sizes test crashed:", error.message);
        results.tests.multipleBetSizes = { error: error.message };
        results.summary.total++;
        results.summary.failed++;
    }

    // Test 4: Promotions (only for IGT environment)
    if (environment === "igt") {
        try {
            console.log("\n🎁 Running promotion tests...");
            results.tests.promotions = await testAllPromotions(environment);
            results.summary.total++;

            if (
                results.tests.promotions.normal?.success &&
                results.tests.promotions.freeSpins?.success &&
                results.tests.promotions.bonus?.success
            ) {
                results.summary.passed++;
            } else {
                results.summary.failed++;
            }
        } catch (error) {
            console.error("Promotion tests crashed:", error.message);
            results.tests.promotions = { success: false, error: error.message };
            results.summary.total++;
            results.summary.failed++;
        }
    } else {
        console.log("\n⚠️ Skipping promotion tests (IGT environment required)");
        console.log("To run promotion tests: node index.js igt");
    }

    // Final Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 === FINAL TEST SUMMARY ===");
    console.log("=".repeat(60));
    console.log(`Environment: ${environment.toUpperCase()}`);
    console.log(`Total Tests: ${results.summary.total}`);
    console.log(`Passed: ${results.summary.passed} ✅`);
    console.log(`Failed: ${results.summary.failed} ❌`);
    console.log(`Success Rate: ${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%`);
    console.log(`Completed at: ${new Date().toISOString()}`);

    // Test Details
    console.log("\n📋 Test Details:");
    for (const [testName, testResult] of Object.entries(results.tests)) {
        const status = testResult.success ? "✅ PASS" : "❌ FAIL";
        console.log(`  ${testName}: ${status}`);
        if (!testResult.success && testResult.error) {
            console.log(`    Error: ${testResult.error}`);
        }
    }

    // Environment-specific recommendations
    if (environment === "local") {
        console.log("\n💡 Recommendations:");
        console.log("  - Run with 'igt' environment for promotion testing");
        console.log("  - Ensure local server is running on port 5000");
        console.log("  - Check game configuration matches expected values");
    } else if (environment === "igt") {
        console.log("\n💡 IGT Environment Notes:");
        console.log("  - Promotion tests use predefined results");
        console.log("  - Ensure IGT server is running on port 5002");
        console.log("  - Results are deterministic for testing");
    }

    // Return results for programmatic use
    return results;
}

// Helper function to display usage information
function displayUsage() {
    console.log("🎮 Socket Client Test Suite");
    console.log("\nUsage:");
    console.log("  node index.js [environment]");
    console.log("\nEnvironments:");
    console.log("  local - Test against local development server (port 5000)");
    console.log("  igt   - Test against IGT server with deterministic results (port 5002)");
    console.log("\nExamples:");
    console.log("  node index.js local     # Test basic betting on local server");
    console.log("  node index.js igt       # Test all features including promotions");
    console.log("\nIndividual Tests:");
    console.log("  npm run test:basic:local      # Basic betting tests only");
    console.log("  npm run test:promotions:igt   # Promotion tests only");
}

// Parse command line arguments
const environment = process.argv[2];

if (!environment) {
    displayUsage();
    process.exit(0);
}

if (environment !== "local" && environment !== "igt") {
    console.error("❌ Invalid environment. Use 'local' or 'igt'");
    displayUsage();
    process.exit(1);
}

// Run the tests
try {
    const results = await runAllTests(environment);

    // Exit with error code if any tests failed
    if (results.summary.failed > 0) {
        console.log("\n💥 Some tests failed. Check the output above for details.");
        process.exit(1);
    } else {
        console.log("\n🎉 All tests passed successfully!");
        process.exit(0);
    }
} catch (error) {
    console.error("💥 Test suite execution failed:", error.message);
    console.error(error.stack);
    process.exit(1);
}
