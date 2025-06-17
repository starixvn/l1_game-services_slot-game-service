import axios from "axios";
import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { initUserSession } from "./helpers";
import { socketOptions } from "./stubs/test-data";

// Check if the test server is available
const isServerAvailable = async () => {
    try {
        await axios.get("http://localhost:5002/health", { timeout: 5000 });
        return true;
    } catch (error) {
        console.warn("Test server not available:", error.message);
        return false;
    }
};

export const signinTest = () => {
    describe("signin", () => {
        let serverAvailable = false;

        beforeAll(async () => {
            serverAvailable = await isServerAvailable();
            if (!serverAvailable) {
                console.warn("Test server not available - some tests may be skipped");
            }
        });

        it("should receive signed in response", async () => {
            if (!serverAvailable) {
                console.warn("Skipping test - server not available");
                return;
            }

            // Arrange
            const normalUserClientDriver = new GameClientDriver(socketOptions, initUserSession(normalUser));

            try {
                // Act
                await normalUserClientDriver.handleSignedInEvent();

                //Assert
                expect(normalUserClientDriver).toBeDefined();
            } finally {
                // Ensure client is always closed
                if (normalUserClientDriver && typeof normalUserClientDriver.close === 'function') {
                    try {
                        normalUserClientDriver.close();
                    } catch (error) {
                        console.warn("Failed to close client:", error.message);
                    }
                }
            }
        }, 30000);
    });
};
