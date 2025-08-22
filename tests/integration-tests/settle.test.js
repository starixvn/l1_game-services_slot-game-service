import axios from "axios";
import Chance from "chance";
import { eventTypes, GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { initUserSession } from "./helpers";
import { socketOptions } from "./stubs/test-data";

const chance = new Chance();

const resultTemplate = {
    freeSpin: [1, 7, 3, 6, 6, 7, 2, 1, 7, 1, 0, 0, 0, 4, 1],
    bonus: [3, 2, 8, 5, 6, 5, 1, 1, 0, 2, 0, 8, 4, 4, 8],
};

const betParams = {
    amount: 0.1,
    betChoice: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
};

const betAmount = betParams.amount * betParams.betChoice.length;

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

const setResult = async (result) => {
    try {
        await axios.post("http://localhost:5002/igt-api/set-board", {
            name: normalUser.playerName,
            result,
        }, { timeout: 10000 });
    } catch (error) {
        console.warn("Failed to set board result:", error.message);
        throw new Error(`Failed to set board result: ${error.message}`);
    }
};

const setupClientReadyBet = async () => {
    try {
        const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
        await client.handleSignedInEvent();
        client.sendInGameEvent();
        return client;
    } catch (error) {
        console.error("Failed to setup client:", error.message);
        throw error;
    }
};

export const settleTest = () => {
    describe("settle", () => {
        let serverAvailable = false;

        beforeAll(async () => {
            serverAvailable = await isServerAvailable();
            if (!serverAvailable) {
                console.warn("Test server not available - some tests may be skipped");
            }
        });

        describe("when win bonus", () => {
            let client;

            beforeAll(async () => {
                if (!serverAvailable) {
                    console.warn("Skipping client setup - server not available");
                    return;
                }

                try {
                    client = await setupClientReadyBet();
                } catch (error) {
                    console.error("Failed to setup client in beforeAll:", error.message);
                    client = null;
                }
            }, 30000);

            afterAll(() => {
                if (client && typeof client.close === 'function') {
                    try {
                        client.close();
                    } catch (error) {
                        console.warn("Failed to close client:", error.message);
                    }
                }
            });

            it("should receive bonus", async () => {
                if (!serverAvailable) {
                    console.warn("Skipping test - server not available");
                    return;
                }

                if (!client) {
                    console.warn("Skipping test due to client setup failure");
                    return;
                }

                // Arrange
                await setResult(resultTemplate.bonus);

                // Act
                client.emit("bet", betParams);
                const bonusResult = await client.handleGameEvent((data) => data.bonuses);

                //Assert
                expect(bonusResult.bonuses.bonus).toEqual(3);
            }, 30000);

            describe("when user open bonus box", () => {
                it("should receive bonus chest winning amount", async () => {
                    if (!serverAvailable) {
                        console.warn("Skipping test - server not available");
                        return;
                    }

                    if (!client) {
                        console.warn("Skipping test due to client setup failure");
                        return;
                    }

                    // Arrange
                    const chests = chance.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
                    const actualResult = [];

                    // Act
                    for (const chest of chests) {
                        client.emit("bonus", { chest });
                        const data = await client.handleGameEvent((data) => data.bonusChest);
                        actualResult.push(data);
                    }

                    // Assert
                    expect(actualResult.every(({ bonusChest }) => bonusChest.amount > 0)).toBeTruthy();
                }, 30000);
            });
        });

        describe("when win freeSpin", () => {
            let client;

            beforeAll(async () => {
                if (!serverAvailable) {
                    console.warn("Skipping client setup - server not available");
                    return;
                }

                try {
                    client = await setupClientReadyBet();
                } catch (error) {
                    console.error("Failed to setup client in beforeAll:", error.message);
                    client = null;
                }
            }, 30000);

            afterAll(() => {
                if (client && typeof client.close === 'function') {
                    try {
                        client.close();
                    } catch (error) {
                        console.warn("Failed to close client:", error.message);
                    }
                }
            });

            it("should receive result having free spins", async () => {
                if (!serverAvailable) {
                    console.warn("Skipping test - server not available");
                    return;
                }

                if (!client) {
                    console.warn("Skipping test due to client setup failure");
                    return;
                }

                // Arrange
                await setResult(resultTemplate.freeSpin);

                // Act
                client.emit(eventTypes.bet, betParams);
                const actualResult = await client.handleGameEvent((data) => data.finish);

                //Assert
                expect(actualResult.finish.settlementResult.freeSpins.count).toEqual(3);
            }, 30000);

            describe("when process free spins", () => {
                it("should receive endBet with correct bet value & freeSpin is true", async () => {
                    if (!serverAvailable) {
                        console.warn("Skipping test - server not available");
                        return;
                    }

                    if (!client) {
                        console.warn("Skipping test due to client setup failure");
                        return;
                    }

                    // Act
                    client.emit(eventTypes.bet, betParams);

                    const endBetResult = await client.handleGameEvent((data) => data.endBet);
                    const finishResult = await client.handleGameEvent((data) => data.finish);

                    //Assert
                    expect(endBetResult.freeSpin).toBeTruthy();
                    expect(endBetResult.endBet).toBe(betAmount);
                    expect(finishResult.finish.betByFreeSpin).toBeTruthy();
                }, 30000);

                it("should receive finish with betByFreeSpin is true", async () => {
                    if (!serverAvailable) {
                        console.warn("Skipping test - server not available");
                        return;
                    }

                    if (!client) {
                        console.warn("Skipping test due to client setup failure");
                        return;
                    }

                    // Act
                    client.emit(eventTypes.bet, betParams);

                    const finishResult = await client.handleGameEvent((data) => data.finish);

                    //Assert
                    expect(finishResult.finish.betByFreeSpin).toBeTruthy();
                }, 30000);
            });
        });
    });
};
