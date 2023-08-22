import appConfigs from "./app-configs";
import { Trace } from "sc-instrument";

import { gameConfigs as gameConfigsRepository } from "sc-base-database";
import { logger } from "sc-common";
import { SlotGameData, SlotGameDefinition, SlotGameApp } from "sc-slot-game-base";
import gameSettings from "./game-settings";
import SlotGameContainerRegistry from "./slot-game-container-registry";

const run = async () => {
    const appName = process.env.APP_NAME;
    const gameName = appName ? appName.replace("service", "").replaceAll("_", "") : "";

    if (appConfigs.otel?.enabled) {
        const { otel } = appConfigs;
        Trace.initSpanProcessor(otel.endpoint);
        Trace.addIdentifiers(`${otel.system} - ${appName}`, appConfigs.sentry.env);
        await Trace.default.start();
    }

    if (appName) {
        appConfigs.database.url = appConfigs.database.url.concat(`&appName=${gameName.toLowerCase()}`);
        appConfigs.sentry.logIdentifier = gameName.toLowerCase();

        const app = new SlotGameApp(gameName, appConfigs);
        await app.run();

        const gameConfigs = await gameConfigsRepository.findOne({ name: gameName.toLowerCase() }).lean().exec();

        if (gameConfigs) {
            gameSettings.id = gameConfigs.gameId;
            gameSettings.name = gameConfigs.displayName.replace(/ /g, "");

            const gameData = new SlotGameData(gameSettings.durations.wholeRound);
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
    await Trace.default.shutdown();
});

run();
