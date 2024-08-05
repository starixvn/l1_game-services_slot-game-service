import mongoose from "mongoose";
import { users } from "sc-base-database";
import { middlewares } from "sc-common";
import {
    createDummyCurrency,
    createDummyUsers,
    createExchangeRate,
    createGameConfig,
    createPartnerConfig,
    normalUser,
} from "sc-game-service-integration-utils";

import appConfigs from "../../../src/app-configs.IGT";
import { rounds as Rounds } from "../../../src/models";
import currencyGroupGames from "../../../src/models/currency-group-games";
import { currencyData, game, gameConfig, rounds } from "./test-data";

const connectDatabase = async () => {
    console.log("connect database");
    await middlewares.database.configureDatabase(mongoose, appConfigs.database);

    await clearAllData();
};

const clearAllData = async () => {
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
        await collection.remove();
    }
};

export const createTestData = async () => {
    await connectDatabase();
    await createExchangeRate();
    await createGameConfig(gameConfig);
    const partnerConfig = await createPartnerConfig(game.id);

    const currency = await createDummyCurrency(partnerConfig.partnerId, currencyData.code, currencyData.name);
    await createCurrencyGroupGames(currency.groupId, game.id, gameConfig);
    await createDummyUsers(currency);
    await createRounds();

    console.log("Create exchange rate, game config & dummy user for testing successfully!");
    process.exit(0);
};

const getUserId = async (playerId) => {
    const user = await users.findOne({ "local.playerId": playerId }, { _id: true }).lean();
    return user._id.toString();
};

const createRounds = async () => {
    const userId = await getUserId(normalUser.playerId);

    const data = rounds({ uid: userId, name: normalUser.playerName, playerId: normalUser.playerId });

    return Rounds("classicslot").insertMany(data);
};

const createCurrencyGroupGames = async (currencyGroupId, gameId, gameConfig) => {
    const data = {
        enabled: true,
        stakeLevels: [{ stake: 0.1 }, { stake: 1 }, { stake: 5 }],
        groupId: currencyGroupId,
        maxWinPerRound: 50000,
        betLevels: [0.1, 1, 5],
        defaultBetLevel: 1,
    };

    return currencyGroupGames.create({ gameId, ...gameConfig, ...data });
};

createTestData();
