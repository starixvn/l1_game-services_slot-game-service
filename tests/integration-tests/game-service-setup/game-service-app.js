import { SlotGameData, SlotGameDefinition } from "sc-slot-game-base";
import { Core } from "sc-game-base";
import { gameConfigs as gameConfigsRepository } from "sc-base-database";
import { initAPIStub, stubUserService } from "sc-game-service-integration-utils";
import appConfigs from "../../../src/app-configs.IGT";
import gameSettings from "../../../src/game-settings";
import IGTSlotGameContainerRegistry from "./igt-container-registry";

const run = async (appName) => {
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

            const gameData = new SlotGameData(gameSettings.durations.wholeRound);
            const definition = new SlotGameDefinition(gameSettings);
            const container = new IGTSlotGameContainerRegistry().register(appConfigs, definition, gameData);

            await app.startGame(container);
        }
    } else {
        console.log("App Name is not defined, failed to boostrap the service");
    }
};

run("classicslot");
