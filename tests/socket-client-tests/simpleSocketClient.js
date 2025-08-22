import { io } from "socket.io-client";

class SimpleSocketClient {
    constructor(socketUri = "http://localhost:5000/user/dragonball") {
        this.socketUri = socketUri;
        this.socket = null;
        this.connected = false;
        this.events = [];
    }

    async connect() {
        return new Promise((resolve, reject) => {
            console.log(`🔌 Connecting to ${this.socketUri}...`);

            this.socket = io(this.socketUri, {
                transports: ["websocket"],
                allowUpgrades: false,
                perMessageDeflate: false,
                forceNew: true,
                extraHeaders: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
                },
            });

            this.socket.on("connect", () => {
                this.connected = true;
                console.log("✅ Connected successfully!");
                console.log(`Socket ID: ${this.socket.id}`);
                resolve();
            });

            this.socket.on("disconnect", () => {
                this.connected = false;
                console.log("❌ Disconnected from server");
            });

            this.socket.on("connect_error", (error) => {
                console.log("❌ Connection error:", error.message);
                reject(error);
            });

            // Listen to all events for debugging
            this.socket.onAny((eventName, ...args) => {
                console.log(`📨 Received event: ${eventName}`, args);
                this.events.push({ eventName, args, timestamp: Date.now() });
            });

            // Set connection timeout
            setTimeout(() => {
                if (!this.connected) {
                    reject(new Error("Connection timeout"));
                }
            }, 10000);
        });
    }

    async signIn(userSession = null) {
        if (!userSession) {
            userSession = {
                isAuthenticated: true,
                umInfo: null,
                username: "ONEworksVGCash_21031988",
                language: "vi-VN",
                ss: "ZJzsWdGW0kf0xxikvyE3KzhcDRj2c3Ij_ONEworksVGCash_21031988",
                system: 1,
                memberName: "username_21031988",
                rate: 0.03935056827912655,
                fractionalOddsFormat: true,
                isUM: false,
                time: "2025-06-07T08:05:42.186Z",
            };
        }

        return new Promise((resolve, reject) => {
            console.log("🔐 Sending sign in event...");

            this.socket.emit("signin", userSession);

            this.socket.once("signedIn", (response) => {
                console.log("✅ Signed in successfully:", response);
                resolve(response);
            });

            this.socket.once("error", (error) => {
                console.log("❌ Sign in error:", error);
                reject(error);
            });

            setTimeout(() => {
                console.log("📊 Events received during signin attempt:");
                const events = this.getReceivedEvents();
                events.forEach((event, index) => {
                    console.log(`${index + 1}. ${event.eventName}:`, JSON.stringify(event.args, null, 2));
                });
                reject(new Error("Sign in timeout"));
            }, 30000);
        });
    }

    async joinGame() {
        return new Promise((resolve, reject) => {
            console.log("🎮 Joining game...");

            this.socket.emit("inGame");

            this.socket.once("DragonBall", (response) => {
                console.log("✅ Joined game successfully:", response);
                // Resolve with gameConfigs data from the response
                const gameConfigs = response[0];
                resolve(gameConfigs);
            });

            this.socket.once("error", (error) => {
                console.log("❌ Join game error:", error);
                reject(error);
            });

            setTimeout(() => {
                reject(new Error("Join game timeout"));
            }, 5000);
        });
    }

    async placeBet(betData = null) {
        if (!betData) {
            betData = {
                amount: 1,
                betChoice: [0, 1, 2, 3, 4], // First 5 paylines
            };
        }

        return new Promise((resolve, reject) => {
            console.log("🎲 Placing bet:", betData);

            this.socket.emit("bet", betData);

            this.socket.once("bet", (response) => {
                console.log("✅ Bet placed successfully:", response);
                resolve(response);
            });

            this.socket.once("error", (error) => {
                console.log("❌ Bet error:", error);
                reject(error);
            });

            setTimeout(() => {
                reject(new Error("Bet timeout"));
            }, 200000);
        });
    }

    async endBet() {
        return new Promise((resolve, reject) => {
            console.log("🏁 Ending bet...");

            this.socket.emit("endBet");

            this.socket.once("endBet", (response) => {
                console.log("✅ Bet ended successfully:", response);
                resolve(response);
            });

            this.socket.once("error", (error) => {
                console.log("❌ End bet error:", error);
                reject(error);
            });

            setTimeout(() => {
                reject(new Error("End bet timeout"));
            }, 5000);
        });
    }

    async finish() {
        return new Promise((resolve, reject) => {
            console.log("🎯 Finishing round...");

            this.socket.emit("finish");

            this.socket.once("finish", (response) => {
                console.log("✅ Round finished successfully:", response);
                resolve(response);
            });

            this.socket.once("error", (error) => {
                console.log("❌ Finish error:", error);
                reject(error);
            });

            setTimeout(() => {
                reject(new Error("Finish timeout"));
            }, 5000);
        });
    }

    disconnect() {
        if (this.socket) {
            console.log("🔌 Disconnecting...");
            this.socket.disconnect();
            this.connected = false;
        }
    }

    getReceivedEvents() {
        return this.events;
    }

    waitForEvent(eventName, timeout = 5000) {
        return new Promise((resolve, reject) => {
            this.socket.once(eventName, (data) => {
                resolve(data);
            });

            setTimeout(() => {
                reject(new Error(`Timeout waiting for event: ${eventName}`));
            }, timeout);
        });
    }
}

export { SimpleSocketClient };
