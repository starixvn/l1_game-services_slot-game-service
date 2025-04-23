import mongoose from "mongoose";
import { gameConfigs as gameConfigsRepository } from "sc-base-database";
import { Core } from "sc-game-base";
import { initAPIStub, stubUserService, subGameManagementService } from "sc-game-service-integration-utils";
import { SlotGameData, SlotGameDefinition } from "sc-slot-game-base";
import appConfigs from "../../../src/app-configs.IGT";
import gameSettings from "../../../src/game-settings";
import IGTSlotGameContainerRegistry from "./igt-container-registry";

const run = async (appName) => {
    try {
        if (appName) {
            initAPIStub(appConfigs.apiSettings.apiUrl);
            stubUserService(appConfigs);

            appConfigs.database.url = appConfigs.database.url.concat(`&appName=${appName}`);
            const app = new Core.BaseGameApp(appName, appConfigs);
            await app.run();
            
            const gameConfigs = await gameConfigsRepository.findOne({ name: appName.toLowerCase() }).lean().exec();

            if (gameConfigs) {
                gameSettings.id = gameConfigs.gameId;
                gameSettings.name = gameConfigs.displayName.replace(/ /g, "");
                const definition = new SlotGameDefinition(gameSettings);
                await subGameManagementService(appConfigs, definition);

                const gameData = new SlotGameData(gameSettings.durations.wholeRound);
                const container = new IGTSlotGameContainerRegistry().register(appConfigs, definition, gameData);
                await app.startGame(container);
                console.log("start game!!!!!!!!!!!");
            }
        } else {
            console.log("App Name is not defined, failed to boostrap the service");
        }
    } catch (error) {
        console.log("readyState", mongoose.connection.readyState);
        console.log("error!!!!!!!!!!!!!");
        console.log(error);
    }
};

run("classicslot");
