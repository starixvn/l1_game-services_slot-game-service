import awilix from "awilix";
import * as Slot from "sc-slot-game-base";
import { Jackpots } from "sc-slot-game-base/src/models";
import { fames, freeSpins, rounds } from "./models";

const { asValue } = awilix;

export default class SlotGameContainerRegistry extends Slot.SlotContainerRegistry {
    registerModels() {
        const definition = this.container.resolve("definition");

        super.registerModels();

        this.container.register({
            roundsRepository: asValue(rounds(definition.configName)),
            famesRepository: asValue(fames(definition.configName)),
            freeSpinsRepository: asValue(freeSpins(definition.configName)),
            jackpotsRepository: asValue(Jackpots),
        });
    }

    register(appConfigs, definition, gameData) {
        const container = super.register(appConfigs, definition, gameData);

        // Register config object for userSignInConsumer
        container.register({
            config: asValue({
                playGamePermissionValidator: container.resolve("playGamePermissionValidator"),
                appConfigs: container.resolve("appConfigs"),
                gameManagementApiClientFactory: container.resolve("gameManagementApiClientFactory"),
                logService: container.resolve("logService"),
                gamePromotionApiClient: container.resolve("gamePromotionApiClient"),
            }),
        });

        return container;
    }
}
