// Import utilities from sc-game-service-integration-utils
import { normalUser, errorUser, botUser1 } from "sc-game-service-integration-utils";

// Test configurations for different environments
export const environments = {
    local: {
        socketUri: "http://localhost:5000/user/classicslot",
        gameName: "ClassicSlot",
        proxyRoute: "/socket.io",
        transports: ["websocket"],
        allowUpgrades: false,
        perMessageDeflate: false,
    },
    igt: {
        socketUri: "http://localhost:5002/user/classicslot",
        gameName: "ClassicSlot",
        proxyRoute: "/socket.io",
        transports: ["websocket"],
        allowUpgrades: false,
        perMessageDeflate: false,
    },
};

// Export users from integration utils
export const testUsers = {
    normalUser,
    errorUser,
    botUser1,
};

// Create user session for socket authentication (using the same format as integration tests)
export function createUserSession(user) {
    return {
        session: `${user.playerId}-session-id`,
        ss: `${user.playerId}-session-id`,
        currency: "$US",
        username: `${user.playerId}_${user.playerName}`,
        browserUserAgent: "socket-test-client",
    };
}

// Standard bet configurations based on the test data from the codebase
export const betConfigs = {
    smallBet: {
        amount: 0.1,
        betChoice: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    },
    mediumBet: {
        amount: 1.0,
        betChoice: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    },
    largeBet: {
        amount: 5.0,
        betChoice: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    },
    singlePayline: {
        amount: 0.1,
        betChoice: [0], // Only first payline
    },
    fivePaylines: {
        amount: 0.1,
        betChoice: [0, 1, 2, 3, 4], // First 5 paylines
    },
};

// Predefined results for IGT testing (from actual test data)
export const testResults = {
    // Result that triggers free spins (from settle.test.js)
    freeSpins: [1, 7, 3, 6, 6, 7, 2, 1, 7, 1, 0, 0, 0, 4, 1],

    // Result that triggers bonus game (from settle.test.js)
    bonus: [3, 2, 8, 5, 6, 5, 1, 1, 0, 2, 0, 8, 4, 4, 8],

    // Result with no special features
    normal: [2, 1, 1, 2, 1, 9, 0, 4, 1, 2, 3, 0, 0, 0, 5],

    // Result with big win (multiple 9s and 10s)
    bigWin: [9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 0, 0, 0, 1, 1],

    // Result with small win
    smallWin: [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4],
};

// Event type constants (using the ones from sc-game-service-integration-utils)
export const EVENT_TYPES = {
    SIGNED_IN: "signedIn",
    IN_GAME: "inGame",
    BET: "bet",
    END_BET: "endBet",
    FINISH: "finish",
    BONUSES: "bonuses",
    BONUS: "bonus",
    BONUS_CHEST: "bonusChest",
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    ERROR: "error",
};

// Test timeouts
export const TIMEOUTS = {
    CONNECTION: 10000,
    EVENT_WAIT: 5000,
    BET_RESULT: 8000,
    BONUS_RESULT: 3000,
};

// Game configuration expectations based on actual game data
export const EXPECTED_GAME_CONFIG = {
    betLevels: [0.1, 1, 5, 10],
    paylineCount: 25,
    symbolCount: 11, // 0-10 symbols
    minBetAmount: 0.1,
    maxBetAmount: 10,
};
