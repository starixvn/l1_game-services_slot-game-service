import { addIdentifiers, initializer, initSpanProcessor } from "sc-instrument";
import appConfigs from "./app-configs";

import { logger } from "sc-common";
import { Core } from "sc-game-base";
import GameManagementApiClientFactory, { getOrDefault } from "sc-game-base/src/core/game-management-api";
import { SlotGameData, SlotGameDefinition } from "sc-slot-game-base";
import gameSettings from "./game-settings";
import SlotGameContainerRegistry from "./slot-game-container-registry";

const run = async () => {
    const appName = process.env.APP_NAME;
    const gameName = appName ? appName.replace("service", "").replaceAll("_", "") : "";

    if (appConfigs.otel?.enabled) {
        const { otel } = appConfigs;
        initSpanProcessor(otel.endpoint, initializer);
        addIdentifiers(`${otel.system} - ${appName}`, appConfigs.sentry.env, initializer);
        initializer.start();
    }

    if (appName) {
        appConfigs.database.url = appConfigs.database.url.concat(`&appName=${gameName.toLowerCase()}`);
        appConfigs.sentry.logIdentifier = gameName.toLowerCase();

        const app = new Core.BaseGameApp(gameName, appConfigs);
        await app.run();

        const gameConfigs = await getOrDefault(
            new GameManagementApiClientFactory(appConfigs).instance().gameConfigs.getGameConfigs(gameName),
            null
        );

        if (gameConfigs) {
            gameSettings.id = gameConfigs.gameId;
            gameSettings.name = gameConfigs.displayName.replace(/ /g, "");

            const gameData = new SlotGameData(gameSettings.durations.wholeRound);
            gameData.gameConfigs = gameConfigs;

            const definition = new SlotGameDefinition(gameSettings);
            const container = new SlotGameContainerRegistry().register(appConfigs, definition, gameData);

            await app.startGame(container);
        } else {
            logger.logCritical(`${gameName} config doesn't exist`);
        }
    } else {
        console.log("App Name is not defined, failed to boostrap the service");
    }
};

process.on("exit", async (code) => {
    console.log(`About to exit with code: ${code}`);
    await initializer.shutdown();
});

run();
