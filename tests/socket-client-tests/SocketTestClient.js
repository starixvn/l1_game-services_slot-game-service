import { GameClientDriver, eventTypes } from "sc-game-service-integration-utils";
import axios from "axios";

export class SocketTestClient extends GameClientDriver {
    constructor(socketOptions, userSession) {
        super(socketOptions, userSession);
        this.connected = false;
        this.eventHandlers = new Map();
        this.setupEnhancedEventListeners();
    }

    async connect() {
        console.log(`Connecting to: ${this.socket.io.uri}`);
        console.log("User session:", this.userSession);

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Connection timeout"));
            }, 10000);

            this.socket.on("connect", () => {
                clearTimeout(timeout);
                this.connected = true;
                console.log("✅ Connected to server");
                resolve();
            });

            this.socket.on("connect_error", (error) => {
                clearTimeout(timeout);
                console.error("❌ Connection error:", error);
                reject(error);
            });
        });
    }

    setupEnhancedEventListeners() {
        this.socket.on("signedIn", (data) => {
            console.log("🔐 Signed in:", data);
            this.triggerHandler("signedIn", data);
        });

        this.socket.on(this.gameName, (data) => {
            // Handle all game-specific events
            if (data.gameConfigs || data.user) {
                console.log("🎮 In game data received");
                console.log("Game configs:", data.gameConfigs ? "✅" : "❌");
                console.log("User info:", data.user ? "✅" : "❌");
                this.triggerHandler("inGame", data);
            }

            if (data.endBet !== undefined) {
                console.log("🎰 End bet:", {
                    endBet: data.endBet,
                    freeSpin: data.freeSpin || false,
                });
                this.triggerHandler("endBet", data);
            }

            if (data.finish) {
                console.log("🏁 Finish result:");
                console.log("  - Bet amount:", data.finish?.totalAmount);
                console.log("  - Win amount:", data.finish?.betWin);
                console.log("  - Free spins:", data.finish?.settlementResult?.freeSpins?.count || 0);
                console.log("  - Bonus:", data.finish?.settlementResult?.bonus?.count || 0);
                console.log("  - By free spin:", data.finish?.betByFreeSpin || false);
                this.triggerHandler("finish", data);
            }

            if (data.bonuses) {
                console.log("🎁 Bonuses triggered:", data.bonuses);
                this.triggerHandler("bonuses", data);
            }

            if (data.bonusChest) {
                console.log("💰 Bonus chest opened:", {
                    amount: data.bonusChest?.amount,
                    chest: data.bonusChest?.chest,
                });
                this.triggerHandler("bonusChest", data);
            }
        });

        this.socket.on("error", (error) => {
            console.error("🚨 Socket error:", error);
        });

        this.socket.on("disconnect", (reason) => {
            console.log("🔌 Disconnected:", reason);
            this.connected = false;
        });
    }

    triggerHandler(event, data) {
        if (this.eventHandlers.has(event)) {
            this.eventHandlers.get(event)(data);
        }
    }

    onEvent(event, handler) {
        this.eventHandlers.set(event, handler);
    }

    placeBet(betParams) {
        console.log("🎲 Placing bet:", {
            amount: betParams.amount,
            totalAmount: betParams.amount * betParams.betChoice.length,
            paylines: betParams.betChoice.length,
        });
        this.sendBetEvent(betParams.betChoice, betParams.amount);
    }

    openBonusChest(chestIndex) {
        console.log(`📦 Opening bonus chest ${chestIndex}`);
        this.emit("bonus", { chest: chestIndex });
    }

    disconnect() {
        if (this.socket) {
            console.log("🔌 Disconnecting...");
            this.close();
            this.connected = false;
        }
    }

    // Helper method to wait for an event with timeout
    waitForEvent(eventName, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Timeout waiting for ${eventName}`));
            }, timeout);

            this.onEvent(eventName, (data) => {
                clearTimeout(timer);
                resolve(data);
            });
        });
    }

    // Enhanced method to wait for specific game events
    async waitForGameEvent(condition, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Timeout waiting for game event`));
            }, timeout);

            const handler = (data) => {
                try {
                    if (!condition || condition(data)) {
                        clearTimeout(timer);
                        this.socket.off(this.gameName, handler);
                        resolve(data);
                    }
                } catch (error) {
                    clearTimeout(timer);
                    this.socket.off(this.gameName, handler);
                    reject(error);
                }
            };

            this.socket.on(this.gameName, handler);
        });
    }

    // Method to validate game configuration
    validateGameConfig(gameData) {
        const { gameConfigs, user } = gameData;

        if (!gameConfigs) {
            throw new Error("No game configuration received");
        }

        if (!user) {
            throw new Error("No user data received");
        }

        // Validate expected game configuration
        if (!gameConfigs.betLevels || !Array.isArray(gameConfigs.betLevels)) {
            throw new Error("Invalid bet levels in game config");
        }

        if (!gameConfigs.odds || typeof gameConfigs.odds !== "object") {
            throw new Error("Invalid odds in game config");
        }

        console.log("✅ Game configuration validation passed");
        return true;
    }

    // Method to calculate expected bet total
    calculateTotalBet(betParams) {
        return betParams.amount * betParams.betChoice.length;
    }

    // Method to analyze bet results
    analyzeBetResult(finishData) {
        const result = finishData.finish;
        const analysis = {
            betAmount: result.totalAmount,
            winAmount: result.betWin,
            netResult: result.betWin - result.totalAmount,
            freeSpins: result.settlementResult?.freeSpins?.count || 0,
            bonus: result.settlementResult?.bonus?.count || 0,
            byFreeSpin: result.betByFreeSpin || false,
            winningPaylines: result.settlementResult?.winningPaylines || [],
        };

        console.log("📊 Bet Analysis:", analysis);
        return analysis;
    }
}

// Helper function to set game result for IGT testing (enhanced with better error handling)
export async function setGameResult(result, playerName = "NormalUser", port = 5002) {
    try {
        const url = `http://localhost:${port}/igt-api/set-board`;
        console.log(`🎯 Setting game result for ${playerName}:`, result);

        if (!Array.isArray(result) || result.length !== 15) {
            throw new Error("Result must be an array of 15 symbols");
        }

        await axios.post(url, {
            name: playerName,
            result,
        });

        console.log("✅ Game result set successfully");
    } catch (error) {
        if (error.code === "ECONNREFUSED") {
            console.error("❌ Cannot connect to IGT API - make sure the server is running on port", port);
        } else {
            console.error("❌ Failed to set game result:", error.message);
        }
        throw error;
    }
}

export default SocketTestClient;
