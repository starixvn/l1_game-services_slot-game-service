import { GameClientDriver, normalUser, eventTypes } from "sc-game-service-integration-utils";
import { initUserSession } from "./helpers";
import { socketOptions } from "./stubs/test-data";
import Chance from "chance";
import axios from "axios";

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

const setResult = async (result) => {
    await axios.post("http://localhost:5002/igt-api/set-board", {
        name: normalUser.playerName,
        result,
    });
};

const setupClientReadyBet = async () => {
    const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
    await client.handleSignedInEvent();
    client.sendInGameEvent();

    return client;
};

export const settleTest = () => {
    describe("settle", () => {
        describe("when win bonus", () => {
            let client;

            beforeAll(async (done) => {
                client = await setupClientReadyBet();

                done();
            });

            afterAll(() => {
                client.close();
            });

            it("should receive bonus", async () => {
                // Arrange
                await setResult(resultTemplate.bonus);

                // Act
                client.emit("bet", betParams);
                const bonusResult = await client.handleGameEvent((data) => data.bonuses);

                //Assert
                expect(bonusResult.bonuses.bonus).toEqual(3);
            });

            describe("when user open bonus box", () => {
                it("should receive bonus chest winning amount", async () => {
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
                });
            });
        });

        describe("when win freeSpin", () => {
            let client;

            beforeAll(async (done) => {
                client = await setupClientReadyBet();

                done();
            });

            afterAll(() => {
                client.close();
            });

            it("should receive result having free spins", async () => {
                // Arrange
                await setResult(resultTemplate.freeSpin);

                // Act
                client.emit(eventTypes.bet, betParams);
                const actualResult = await client.handleGameEvent((data) => data.finish);

                //Assert
                expect(actualResult.finish.settlementResult.freeSpins.count).toEqual(3);
            });

            describe("when process free spins", () => {
                it("should receive endBet with correct bet value & freeSpin is true", async () => {
                    // Act
                    client.emit(eventTypes.bet, betParams);

                    const endBetResult = await client.handleGameEvent((data) => data.endBet);
                    const finishResult = await client.handleGameEvent((data) => data.finish);

                    //Assert
                    expect(endBetResult.freeSpin).toBeTruthy();
                    expect(endBetResult.endBet).toBe(betAmount);
                    expect(finishResult.finish.betByFreeSpin).toBeTruthy();
                });

                it("should receive finish with betByFreeSpin is true", async () => {
                    // Act
                    client.emit(eventTypes.bet, betParams);

                    const finishResult = await client.handleGameEvent((data) => data.finish);

                    //Assert
                    expect(finishResult.finish.betByFreeSpin).toBeTruthy();
                });
            });
        });
    });
};
