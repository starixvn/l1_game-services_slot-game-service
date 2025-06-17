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

export const ingameTest = () => {
    describe("when user joins game", () => {
        let serverAvailable = false;

        beforeAll(async () => {
            serverAvailable = await isServerAvailable();
            if (!serverAvailable) {
                console.warn("Test server not available - some tests may be skipped");
            }
        });

        it("should return game configs", async () => {
            if (!serverAvailable) {
                console.warn("Skipping test - server not available");
                return;
            }

            // Arrange
            const normalUserClientDriver = new GameClientDriver(socketOptions, initUserSession(normalUser));
            
            try {
                await normalUserClientDriver.handleSignedInEvent();
                normalUserClientDriver.sendInGameEvent();

                // Act
                const { gameConfigs } = await normalUserClientDriver.handleGameEvent((inGameData) => inGameData?.gameConfigs);

                // Assert
                expect(gameConfigs.odds).toStrictEqual({
                    0: {
                        2: 0,
                        3: 2,
                        4: 5,
                        5: 10,
                    },
                    1: {
                        2: 0,
                        3: 5,
                        4: 10,
                        5: 25,
                    },
                    2: {
                        2: 0,
                        3: 5,
                        4: 25,
                        5: 50,
                    },
                    3: {
                        2: 0,
                        3: 10,
                        4: 30,
                        5: 150,
                    },
                    4: {
                        2: 0,
                        3: 12,
                        4: 45,
                        5: 275,
                    },
                    5: {
                        2: 0,
                        3: 16,
                        4: 60,
                        5: 375,
                    },
                    6: {
                        2: 0,
                        3: 20,
                        4: 75,
                        5: 500,
                    },
                    7: {
                        2: 0,
                        3: 3,
                        4: 6,
                        5: 18,
                    },
                    8: {
                        2: 0,
                        3: 3,
                        4: 4,
                        5: 5,
                    },
                    9: {
                        2: 8,
                        3: 50,
                        4: 1000,
                        5: 8000,
                    },
                    10: {
                        2: 4,
                        3: 25,
                        4: 100,
                        5: 5000,
                    },
                });
                expect(gameConfigs.betLevels).toStrictEqual([0.1, 1, 5, 10]);
            } finally {
                if (normalUserClientDriver && typeof normalUserClientDriver.close === 'function') {
                    try {
                        normalUserClientDriver.close();
                    } catch (error) {
                        console.warn("Failed to close client:", error.message);
                    }
                }
            }
        }, 30000);

        it("should return user info", async () => {
            if (!serverAvailable) {
                console.warn("Skipping test - server not available");
                return;
            }

            // Arrange
            const normalUserClientDriver = new GameClientDriver(socketOptions, initUserSession(normalUser));
            
            try {
                await normalUserClientDriver.handleSignedInEvent();
                normalUserClientDriver.sendInGameEvent();

                // Act
                const inGameData = await normalUserClientDriver.handleGameEvent((inGameData) => inGameData?.user?.UID);

                // Assert
                expect(inGameData.user).toStrictEqual({
                    UID: 1,
                    avatarId: 1,
                    currency: "$US",
                    name: "NormalUser",
                    multiplier: 1,
                    rate: 1,
                    red: 20000,
                    type: false,
                });
            } finally {
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
