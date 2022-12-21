import { Core } from "sc-game-base";
import { SlotGameData, SlotGameDefinition } from "sc-slot-game-base";
import { gameConfigs as gameConfigsRepository } from "sc-base-database";
import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import SlotGameContainerRegistry from "./slot-game-container-registry";

const run = async () => {
    const appName = process.env.APP_NAME;

    if (appName) {
        appConfigs.database.url = appConfigs.database.url.concat(`&appName=${appName}`);

        const app = new Core.BaseGameApp(appName, appConfigs);
        await app.run();

        const gameConfigs = await gameConfigsRepository.findOne({ name: appName.toLowerCase() }).lean().exec();

        if (gameConfigs) {
            gameSettings.id = gameConfigs.gameId;
            gameSettings.name = appName;

            const gameData = new SlotGameData(gameSettings.durations.wholeRound);
            const definition = new SlotGameDefinition(gameSettings);
            const container = new SlotGameContainerRegistry().register(appConfigs, definition, gameData);

            await app.startGame(container);
        }
    } else {
        console.log("App Name is not defined, failed to boostrap the service");
    }
};

run();
