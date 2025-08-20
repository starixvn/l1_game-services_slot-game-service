import appConfigs from "./app-configs.js";

import { logger } from "sc-common";
import { Core } from "sc-game-base";
import GameManagementApiClientFactory, { getOrDefault } from "sc-game-base/src/core/game-management-api";
import { SlotGameData, SlotGameDefinition } from "sc-slot-game-base";
import gameSettings from "./game-settings";
import SlotGameContainerRegistry from "./slot-game-container-registry";
import { signInGame } from "sc-game-base/src/core/helpers/user-service-helpers";
import { PlayGamePermissionValidator } from "sc-game-base/src/core/validators";

const run = async () => {
    const appName = process.env.APP_NAME;
    const gameName = appName ? appName.replace("service", "").replaceAll("_", "") : "";

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

            // const params = {
            //     session: "vJCwko9wnRNCJwoOlwDjqHPFnlxL8tOC_ONEworks1_21031988",
            //     username: "ONEworks1_21031988",
            //     browserUserAgent:
            //         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
            // };

            // //{"username":"ONEworks1_21031988","language":"vi-VN","ss":"oyXVXoK2lD2mIyKQkaJyqZEzoFLqJiP2_ONEworks1_21031988","time":"2025-08-20T02:51:28.295Z","isAuthenticated":true,"system":1}
            // const session = await signInGame(appConfigs.userServiceSettings.url, params);

            await app.startGame(container);

            // const validator = new PlayGamePermissionValidator(definition, gameData, null);
            // validator.isHavePlayingPermission(session);
        } else {
            logger.logCritical(`${gameName} config doesn't exist`);
        }
    } else {
        console.log("App Name is not defined, failed to boostrap the service");
    }
};

run();
