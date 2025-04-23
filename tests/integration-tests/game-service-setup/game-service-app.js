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


            appConfigs.database.url = appConfigs.database.url.concat(`&appName=${appName}`);

            const app = new Core.BaseGameApp(appName, appConfigs);
            await app.run();

            gameSettings.id = 999;
            gameSettings.name = "ClassicSlot";
            const definition = new SlotGameDefinition(gameSettings);
            await initAPIStub(appConfigs.apiSettings.apiUrl);
            await stubUserService(appConfigs);
            await subGameManagementService(appConfigs, definition);

            const gameConfigs = await gameConfigsRepository.findOne({ name: appName.toLowerCase() }).lean().exec();

            if (gameConfigs) {
                const gameData = new SlotGameData(gameSettings.durations.wholeRound);

                const container = new IGTSlotGameContainerRegistry().register(appConfigs, definition, gameData);

                //await app.startGame(container);
                console.log("start game!!!!!!!!!!!");
            }
        } else {
            console.log("App Name is not defined, failed to boostrap the service");
        }
    } catch (error) {
        console.log("error!!!!!!!!!!!!!");
        console.log(error);
    }
};

run("classicslot");
