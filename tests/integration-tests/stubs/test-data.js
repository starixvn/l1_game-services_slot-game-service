const game = {
    id: 999,
    name: "ClassicSlot",
};

const currencyData = { code: "USD", name: "$US" };

const socketOptions = {
    socketUri: `http://localhost:5002/user/classicslot`,
    gameName: "ClassicSlot",
    proxyRoute: "/socket.io",
};

const gameConfig = {
    type: 2,
    name: "classicslot",
    gameId: 999,
    displayName: "Classic Slot",
    slotsConfig: {
        mode: 1,
        bigWinRatio: 2.5,
        stakeLevels: [
            {
                stake: 0.1,
                jackpot: 0,
                botRatio: 0.4,
            },
            {
                stake: 1,
                jackpot: 0,
                botRatio: 0.4,
            },
            {
                stake: 5,
                jackpot: 0,
                botRatio: 0.2,
            },
        ],
        icons: {
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
        },
        betLevels: [0.1, 0.2, 1, 1.25, 1.5, 2, 3, 5],
        bonus: {
            min: 8,
            max: 28,
        },
        jackpot: {
            enabled: false,
            excludeUUS: false,
            winningRatio: 0,
            playerContributionRatio: 0,
            botContributionRatio: 0,
            pools: {
                minor: {
                    init: 5000,
                    playerSettings: { contrib: 0.1, alloc: 90 },
                    botSettings: { contrib: 0.01, alloc: 80 },
                },
                major: {
                    init: 25000,
                    playerSettings: { contrib: 0.15, alloc: 9 },
                    botSettings: { contrib: 0.015, alloc: 15 },
                },
                grand: {
                    init: 50000,
                    playerSettings: { contrib: 0.25, alloc: 1 },
                    botSettings: { contrib: 0.025, alloc: 5 },
                },
            },
        },
        symbolWeight: {
            1: [
                [55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 4],
                [1, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0],
                [1, 1, 2, 0, 1, 0, 0, 0, 0, 0, 0],
            ],
            2: [
                [55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5],
                [1, 1, 1, 2, 0, 0, 0, 1, 1, 0, 1],
                [1, 1, 2, 0, 1, 0, 0, 0, 0, 0, 0],
            ],
            3: [
                [55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5],
                [1, 1, 1, 2, 0, 0, 0, 1, 1, 0, 0],
                [3, 1, 0, 0, 1, 0, 0, 0, 0, 0, 2],
            ],
        },
    },
};

const rounds = (user) => [
    {
        bet: 1,
        totalAmount: 25,
        paylines: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        freeSpin: false,
        result: [2, 1, 1, 2, 1, 9, 0, 4, 1, 2, 3, 0, 0, 0, 5],
        betWin: 44,
        paid: true,
        id: 1,
        uid: user.uid,
        name: user.name,
        rate: 1,
        exchangeRateId: 1,
        siteId: "4100300",
        currency: "$US",
        operatorId: "ONEworks1",
        playerId: user.playerId,
        bonusChests: [],
        __v: 1,
        odds: {
            0: { 2: 0, 3: 2, 4: 5, 5: 10 },
            1: { 2: 0, 3: 5, 4: 10, 5: 25 },
            2: { 2: 0, 3: 5, 4: 25, 5: 50 },
            3: { 2: 0, 3: 10, 4: 30, 5: 150 },
            4: { 2: 0, 3: 12, 4: 45, 5: 275 },
            5: { 2: 0, 3: 16, 4: 60, 5: 375 },
            6: { 2: 0, 3: 20, 4: 75, 5: 500 },
            7: { 2: 0, 3: 3, 4: 6, 5: 18 },
            8: { 2: 0, 3: 3, 4: 4, 5: 5 },
            9: { 2: 8, 3: 50, 4: 1000, 5: 8000 },
            10: { 2: 4, 3: 25, 4: 100, 5: 5000 },
        },
        settlementResult: {
            freeSpins: { count: 0, odds: 0 },
            bonus: { count: 0, odds: 0 },
            jackpot: null,
            winningPaylines: [
                { payline: 1, symbol: "2", count: 3, odds: 5 },
                { payline: 2, symbol: "1", count: 3, odds: 5 },
                { payline: 6, symbol: "1", count: 3, odds: 5 },
                { payline: 14, symbol: "1", count: 3, odds: 5 },
                { payline: 16, symbol: "1", count: 3, odds: 5 },
                { payline: 17, symbol: "2", count: 3, odds: 5 },
                { payline: 18, symbol: "0", count: 3, odds: 2 },
                { payline: 19, symbol: "0", count: 3, odds: 2 },
                { payline: 22, symbol: "0", count: 4, odds: 5 },
                { payline: 23, symbol: "0", count: 4, odds: 5 },
            ],
        },
    },
    {
        bet: 1,
        totalAmount: 25,
        paylines: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        freeSpin: false,
        result: [2, 1, 2, 3, 1, 3, 2, 1, 3, 0, 2, 4, 0, 2, 0],
        betWin: 20,
        paid: true,
        id: 2,
        uid: user.id,
        name: user.name,
        rate: 1,
        exchangeRateId: 1,
        siteId: "4100300",
        currency: "$US",
        operatorId: "ONEworks1",
        playerId: user.playerId,
        bonusChests: [],
        __v: 1,
        odds: {
            0: { 2: 0, 3: 2, 4: 5, 5: 10 },
            1: { 2: 0, 3: 5, 4: 10, 5: 25 },
            2: { 2: 0, 3: 5, 4: 25, 5: 50 },
            3: { 2: 0, 3: 10, 4: 30, 5: 150 },
            4: { 2: 0, 3: 12, 4: 45, 5: 275 },
            5: { 2: 0, 3: 16, 4: 60, 5: 375 },
            6: { 2: 0, 3: 20, 4: 75, 5: 500 },
            7: { 2: 0, 3: 3, 4: 6, 5: 18 },
            8: { 2: 0, 3: 3, 4: 4, 5: 5 },
            9: { 2: 8, 3: 50, 4: 1000, 5: 8000 },
            10: { 2: 4, 3: 25, 4: 100, 5: 5000 },
        },
        settlementResult: {
            freeSpins: { count: 0, odds: 0 },
            bonus: { count: 0, odds: 0 },
            jackpot: null,
            winningPaylines: [
                { payline: 0, symbol: "1", count: 3, odds: 5 },
                { payline: 3, symbol: "2", count: 3, odds: 5 },
                { payline: 13, symbol: "2", count: 3, odds: 5 },
                { payline: 15, symbol: "2", count: 3, odds: 5 },
            ],
        },
    },
];

export { currencyData, game, gameConfig, rounds, socketOptions };

